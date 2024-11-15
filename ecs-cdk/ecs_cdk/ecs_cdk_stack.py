from aws_cdk import (
    App,
    Stack,
    Duration,
    CfnOutput,
    aws_ecs as ecs,
    aws_ec2 as ec2,
    aws_ecr as ecr,
    aws_elasticloadbalancingv2 as elb,
    aws_certificatemanager as acm,
    aws_ecr_assets as ecr_assets,
)
from constructs import Construct


class EcsCdkStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Define Docker Image Asset (builds and pushes to ECR automatically)
        docker_image = ecr_assets.DockerImageAsset(self, "FastApiDockerImage",
            directory="../backend",  # Path to your Dockerfile
        )

        # Create a VPC for ECS to run in, with 3 AZs for better high availability
        vpc = ec2.Vpc(self, "Vpc", max_azs=3)

        # Create an ECS Cluster within the VPC
        cluster = ecs.Cluster(self, "EcsCluster", vpc=vpc)

        # Create the ECS Fargate Task Definition with increased memory and CPU
        task_definition = ecs.FargateTaskDefinition(self, "TaskDef", 
                                                    memory_limit_mib=4096,  # 4 GB
                                                    cpu=2048)               # 2 vCPU

        # Add the Docker image container to the ECS task definition
        task_definition.add_container("FastApiContainer",
                                    image=ecs.ContainerImage.from_docker_image_asset(docker_image),
                                    logging=ecs.LogDrivers.aws_logs(stream_prefix="FastApi"),
                                    port_mappings=[ecs.PortMapping(container_port=8000)])

        # Create a security group for the ECS service to allow inbound traffic on port 8000
        security_group = ec2.SecurityGroup(self, "FastApiSecurityGroup", vpc=vpc)
        security_group.add_ingress_rule(ec2.Peer.any_ipv4(), ec2.Port.tcp(8000), "Allow HTTP traffic")

        # Create the ECS Fargate Service and associate the security group
        service = ecs.FargateService(self, "FastApiService",
                                    cluster=cluster,
                                    task_definition=task_definition,
                                    security_groups=[security_group])

        # Create an Application Load Balancer (ALB) for the service, internet-facing
        load_balancer = elb.ApplicationLoadBalancer(self, "ALB", vpc=vpc, internet_facing=True)

        # Load ACM certificate by ARN (or create your own certificate if needed)
        certificate = acm.Certificate.from_certificate_arn(self, "SiteCertificate",
                                                        "arn:aws:acm:us-east-2:060389843270:certificate/1c10cbf3-415c-407f-99ba-298935fccd6a")

        # Add an HTTPS listener on port 443 for the ALB with the ACM certificate
        https_listener = load_balancer.add_listener("HttpsListener", port=443, certificates=[certificate])

        # Add ECS service to the HTTPS listener's targets, pointing to the container port (8000)
        https_listener.add_targets("ECSTargets",
                                port=8000,
                                targets=[service],
                                # Optional health check configuration
                                health_check=elb.HealthCheck(
                                    interval=Duration.seconds(30),
                                    timeout=Duration.seconds(10),
                                    path="/health",
                                    port="8000",
                                    healthy_threshold_count=2,
                                    unhealthy_threshold_count=5,)
                                )

        # Optional: Create an HTTP listener to redirect traffic to HTTPS
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


# Initialize the CDK app and stack
# app = App()
# EcsCdkStack(app, "EcsCdkStack")
# app.synth()
