from aws_cdk import (
    App,
    Stack,
    Duration,
    CfnOutput
)
import aws_cdk.aws_ecs as ecs
import aws_cdk.aws_ec2 as ec2
import aws_cdk.aws_ecr as ecr
import aws_cdk.aws_elasticloadbalancingv2 as elb
import aws_cdk.aws_certificatemanager as acm
from constructs import Construct


class EcsCdkStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Create a VPC
        vpc = ec2.Vpc(self, "Vpc", max_azs=2)

        # Create an ECS Cluster
        cluster = ecs.Cluster(self, "EcsCluster", vpc=vpc)

        # Reference an existing ECR repository
        repository = ecr.Repository.from_repository_name(self, "ExistingECRRepo", "card-price-scraper-ecr")

        # Define the ECS task with the Docker image from ECR
        task_definition = ecs.FargateTaskDefinition(self, "TaskDef", 
                                                    memory_limit_mib=1024, 
                                                    cpu=512)
        
        # Add container to the ECS task definition
        task_definition.add_container("FastApiContainer",
                                    image=ecs.ContainerImage.from_ecr_repository(repository, "latest"),
                                    logging=ecs.LogDrivers.aws_logs(stream_prefix="FastApi"),
                                    port_mappings=[ecs.PortMapping(container_port=8000)])
        
        # Create a security group for the service to allow inbound traffic on port 8000
        security_group = ec2.SecurityGroup(self, "FastApiSecurityGroup", vpc=vpc)
        security_group.add_ingress_rule(ec2.Peer.any_ipv4(), ec2.Port.tcp(8000), "Allow HTTP traffic")

        # Create the ECS Fargate service and associate the security group
        service = ecs.FargateService(self, "FastApiService",
                                    cluster=cluster,
                                    task_definition=task_definition,
                                    security_groups=[security_group])
        
        # Create an Application Load Balancer (ALB) to expose the service publicly
        load_balancer = elb.ApplicationLoadBalancer(self, "ALB", vpc=vpc, internet_facing=True)

        # Load ACM certificate by ARN
        certificate = acm.Certificate.from_certificate_arn(self, "SiteCertificate",
                                                        "arn:aws:acm:us-east-2:060389843270:certificate/1c10cbf3-415c-407f-99ba-298935fccd6a")

        # Add an HTTPS listener on port 443 for the ALB, using the ACM certificate
        https_listener = load_balancer.add_listener("HttpsListener", port=443, certificates=[certificate])

        # Add ECS service to the HTTPS listener's targets, pointing to the container port (8000)
        https_listener.add_targets("ECSTargets",
                                port=8000,
                                targets=[service],
                                health_check=elb.HealthCheck(
                                    interval=Duration.seconds(30),
                                    path="/health",
                                    port="8000"
                                ))

        # Optional: Create an HTTP listener that redirects traffic to HTTPS
        http_listener = load_balancer.add_listener("HttpListener", port=80)
        http_listener.add_action(
            "HttpRedirect",
            action=elb.ListenerAction.redirect(
                protocol="HTTPS",
                port="443",
                permanent=True
            )
        )

        # Output the URL of the ALB
        CfnOutput(self, "LoadBalancerURL", value=f"https://{load_balancer.load_balancer_dns_name}")