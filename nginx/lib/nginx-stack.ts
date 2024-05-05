import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as fs from 'fs';
import * as path from 'path';

export class NginxStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    // Get latest AL3 image
    const nginxInstanceAmi = ec2.MachineImage.latestAmazonLinux2023({
      cpuType: ec2.AmazonLinuxCpuType["X86_64"],
      cachedInContext: true
    })


    // Use default VPC for simplicity
    const vpc = ec2.Vpc.fromLookup(this, "vpc", {
      isDefault: true
    });

    // Create new security group which allows port 80 access from anywhere
    const nginxSecurityGroup = new ec2.SecurityGroup(this, 'nginx-security-group', {
      vpc,
      securityGroupName: `nginx-security-group`,
      allowAllOutbound: true
    });
    nginxSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.HTTP, "Allow HTTP access to this instance from anywhere");

    // Userdata to setup nginx
    const userData: ec2.UserData =  ec2.UserData.forLinux();
    userData.addCommands(fs.readFileSync(path.join(__dirname, 'userdata.sh'), 'utf8'));

    const nginxInstance: ec2.Instance = new ec2.Instance(this, 'NginxInstance', {
      instanceName: `nginx`,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO
      ),
      vpc,
      securityGroup: nginxSecurityGroup,
      machineImage: nginxInstanceAmi,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC
      },
      requireImdsv2: true,
      userData
    });

    new cdk.CfnOutput(this, "nginxDns", {
      value: `http://${nginxInstance.instancePublicDnsName}`,
      exportName: "nginxDns"
    });

    new cdk.CfnOutput(this, "nginxIpUrl", {
      value: `http://${nginxInstance.instancePublicIp}`,
      exportName: "nginxIpUrl"
    });
  }
}