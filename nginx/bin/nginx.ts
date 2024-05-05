#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NginxStack } from '../lib/nginx-stack';

const app = new cdk.App();
const targetEnv: string = app.node.tryGetContext('env'); // Get 'env' from the command line parameter
const envProps = app.node.tryGetContext(`ENV:${targetEnv.toUpperCase()}`); // Get properties for environments. This is fetched from cdk.context.json
console.log(`Environment Chosen: ${targetEnv}`);

new NginxStack(app, `nginx-stack-${targetEnv}`, {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    },
    deployEnvironment: targetEnv,
    ...envProps
});