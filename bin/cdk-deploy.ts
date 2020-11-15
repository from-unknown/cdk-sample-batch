#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";
import { CdkDeployStack, StageValues } from "../lib/cdk-deploy-stack";

const app = new cdk.App();
const config: StageValues = app.node.tryGetContext(
  process.env.STAGE || "develop"
);

new CdkDeployStack(app, `sampleBatch${config.postFix}`, {
  env: {
    account: config.account,
    region: config.region,
  },
});
