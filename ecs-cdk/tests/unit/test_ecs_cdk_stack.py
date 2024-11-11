import aws_cdk as core
import aws_cdk.assertions as assertions

from ecs_cdk.ecs_cdk_stack import EcsCdkStack

# example tests. To run these tests, uncomment this file along with the example
# resource in ecs_cdk/ecs_cdk_stack.py
def test_sqs_queue_created():
    app = core.App()
    stack = EcsCdkStack(app, "ecs-cdk")
    template = assertions.Template.from_stack(stack)

#     template.has_resource_properties("AWS::SQS::Queue", {
#         "VisibilityTimeout": 300
#     })
