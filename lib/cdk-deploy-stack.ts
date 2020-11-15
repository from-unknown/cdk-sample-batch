import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import { Schedule } from "@aws-cdk/aws-applicationautoscaling";
import { Rule } from "@aws-cdk/aws-events";
import { EcsTask } from "@aws-cdk/aws-events-targets";
import * as logs from "@aws-cdk/aws-logs";

export interface StageValues {
  account: string;
  region: string;
  vpcId: string;
  securityGroupId: string;
  postFix: string;
  currentMode: string;
  subnets: Subnet[];
}

export interface Subnet {
  subnetId: string;
  availabilityZone: string;
  routeTableId: string;
}

export class CdkDeployStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    console.log(`node: ${this.node}`);
    const config: StageValues = this.node.tryGetContext(
      process.env.STAGE || "develop"
    );

    // 環境変数
    // let sampleString = "";
    // if (!process.env.SAMPLE_STRING) {
    //   throw new Error("sample string is not defined");
    // }
    // sampleString = process.env.SAMPLE_STRING;

    const vpc = ec2.Vpc.fromLookup(this, `sampleVpc${config.postFix}`, { vpcId: config.vpcId });
    const cluster = new ecs.Cluster(this, `sampleCluster${config.postFix}`, { vpc });
    const securityGroupIds = config.securityGroupId.split(",");
    const securityGroups = securityGroupIds.map((id: string, index: number) => {
      return ec2.SecurityGroup.fromSecurityGroupId(this, `SecurityGroup${index}${config.postFix}`, id);
    });

    const task = new ecs.FargateTaskDefinition(this, `TaskDefinition${config.postFix}`, {
      family: `sampleBatchScheduledTask${config.postFix}`,
      cpu: 256,
      memoryLimitMiB: 512,
    });

    const logGroup = new logs.LogGroup(this, "sampleBatchLog", {
      logGroupName: `sample${config.postFix}`,
      retention: logs.RetentionDays.TWO_YEARS,
    });
    const logging = ecs.LogDriver.awsLogs({
      streamPrefix: "sample-batch",
      logGroup,
    });

    task.addContainer("sampleBatchFargate", {
      image: ecs.ContainerImage.fromAsset(`${__dirname}/../src`),
      environment: {
        DEPLOYED_DATE: Date.now().toLocaleString(),
        CURRENT_MODE: config.currentMode,
      },
      cpu: 256,
      memoryLimitMiB: 512,
      logging,
    });

    const subnets = config.subnets.map((subnet: Subnet, index: number) => {
      return ec2.Subnet.fromSubnetAttributes(this, `subnets${index}${config.postFix}`, subnet);
    });

    const subnetSelection = vpc.selectSubnets({
      subnets,
    });

    new Rule(this, "Rule", {
      description: "description",
      enabled: true,
      schedule: Schedule.cron({ hour: "16", minute: "00" }), // UTCで指定する 例は午前3時
      targets: [
        new EcsTask({
          cluster: cluster,
          taskDefinition: task,
          securityGroups,
          subnetSelection,
        }),
      ],
    });

    new cdk.CfnOutput(this, "SampleBatch", {
      value: "sample batch",
    });
  }
}
