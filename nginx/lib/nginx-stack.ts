import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as fs from 'fs';
import * as path from 'path';

export interface NginxStackProps extends cdk.StackProps {
  deployEnvironment: string, 
  nginxInstanceProps: {
    cpuType: ec2.AmazonLinuxCpuType, 
    instanceClass: ec2.InstanceClass,
    instanceSize: ec2.InstanceSize
  }
}

export class NginxStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: NginxStackProps) {
    super(scope, id, props);

    // Get latest AL3 image
    const nginxInstanceAmi = ec2.MachineImage.latestAmazonLinux2023({
      cpuType: props.nginxInstanceProps.cpuType,
      cachedInContext: true
    })


    // Use default VPC for simplicity
    const vpc = ec2.Vpc.fromLookup(this, "vpc", {
      isDefault: true
    });

    // Create new security group which allows port 80 access from anywhere
    const nginxSecurityGroup = new ec2.SecurityGroup(this, 'NginxSecurityGroup', {
      vpc,
      securityGroupName: `nginx-security-group-${props.deployEnvironment}`,
      allowAllOutbound: true
    });
    nginxSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.HTTP, "Allow HTTP access to this instance from anywhere");

    // Userdata to setup nginx
    const userData: ec2.UserData =  ec2.UserData.forLinux();
    const userDataCommands = fs.readFileSync(path.join(__dirname, 'userdata.sh'), 'utf8')
                               .replace("#DEPLOY_ENV#", props.deployEnvironment.toUpperCase());
    userData.addCommands(userDataCommands);

    const nginxInstance: ec2.Instance = new ec2.Instance(this, 'NginxInstance', {
      instanceName: `nginx-${props.deployEnvironment}`,
      instanceType: ec2.InstanceType.of(
        props.nginxInstanceProps.instanceClass,
        props.nginxInstanceProps.instanceSize
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

    new cdk.CfnOutput(this, "NginxDns", {
      value: `http://${nginxInstance.instancePublicDnsName}`,
      exportName: `nginxDns-${props.deployEnvironment}`
    });

    new cdk.CfnOutput(this, "NginxIpUrl", {
      value: `http://${nginxInstance.instancePublicIp}`,
      exportName: `nginxIpUrl-${props.deployEnvironment}`
    });
  }
}