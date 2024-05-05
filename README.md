# AWS CDK Github Actions Workshop

In this workshop, we will setup a simple stack using AWS CDK. We will then vary this stack to two different environments, and deploy it using Github Actions. 

### Prerequisites

You'll need the following before starting this workshop:
- AWS Account
- A Github Account

>[!WARNING]
>While every effort has been made to minimise AWS costs arising from this workshop, you may incur higher than expected costs depending on how long you leave your infrastructure running. Be sure to cleanup all resources (described in the last step) once you've completed this exercise.
 
And locally, you'll need these tools to complete this workshop:
- Node.js
- Git
- AWS CDK CLI (`npm i -g aws-cdk`)

>[!TIP]
>This repository is configured to setup a Github Codespaces which can help you get setup quickly. More information on Github Codespaces can be found [here](https://docs.github.com/en/codespaces/overview)

A few technologies we'll be working with:

- AWS CDK (w/ Typescript) & Cloudformation
- Github Actions
- AWS EC2
- Nginx

To get started with the workshop, please [fork this repository](https://github.com/karchit/aws-cdk-github-workshop/fork) into your own account/organisation. Be sure to untick the "Copy the `0-intro branch` only" option. Once you're set up, switch to the [1-setup](https://github.com/karchit/aws-cdk-github-workshop/tree/1-setup) branch.
