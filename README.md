# AWS CDK Github Actions Workshop

In this final step of the workshop, we will modify our nginx stack and CI workflow to support multiple environments. Specifically, we will create cater for a dev and prod environment (development and production environments respectively). 

In most organisations, these two environments would reside in two different AWS accounts but in a bid to keep things simple we will keep both environments in the same account.


Before proceeding, delete the stack created in Step 2 via [Cloudformation console](https://ap-southeast-2.console.aws.amazon.com/cloudformation/home). This is so we can create new stacks which are environment specific. 

You can review all the changes we've made to support multiple environments in this pull-request: https://github.com/karchit/aws-cdk-github-workshop/pull/2

### CDK Setup

CDK allows inputs to stack using ["runtime contexts"](https://docs.aws.amazon.com/cdk/v2/guide/context.html). These context key-value pairs can be passed in multiple ways, but we will employ the `cdk.context.json` file and very subtly through the `--context` parameter to the `cdk` command. 

Our dev and prod environments will both contain an nginx server, however you've been asked to try the new-ish, slightly less expensive [ARM-based](https://aws.amazon.com/ec2/graviton/) processors so you decide to deploy this to your "dev" environment for testing. 

To begin with, review the updated [lib/nginx.ts](./nginx/lib/nginx-stack.ts) file where we a new interface has been defined. This interface contains properties that vary between our environments. 

In the same file, review the modified `NginxStack` class. The resources use the variable properties defined in our `NginxStackProps` interface. We The names of all resources now contain the name of the environment (`deployEnvironment` property). Finally, the `nginxInstance`'s cpu type, instance class and size are also based on the values fed in from the context. 

> [!IMPORTANT] 
> Cloudformation output values are unique within an AWS Account. Thus it is important to modify the output export names to contain the environment name. Of course, this isn't necessary if the two stacks are deployed to different AWS accounts. 

Now ,check out [`cdk.context.json`](./nginx/cdk.context.json) file which contains the key-value pairs for the environment's properties. Our 'dev' environment will use `arm64` architecture and 'prod' will use `x86` architecture 

The stack is initialised from [bin/nginx.ts](./nginx/bin/nginx.ts). It has been modified to fetch our variable context parameters and pass it on to the stack. Pay close attention to how `tryGetContext` function is utilised to fetch the environment from `cdk deploy` and then the environment's properties from `cdk.context.json`. 

### Github Actions Setup

To start, delete the `DEPLOY_ROLE_ARN` secret that we created in the last step. 

Next, go to your repository's Settings > Environments > New environment. Create two environments named "Dev" and "Prod". 
Go into each environment and create a secret named `DEPLOY_ROLE_ARN` and put in the ARN of your `github-actions-role` you noted down in step 1. Doing so allows us to vary this value, which determines which AWS account to deploy our stack to, between environments

Now, we update the CI Deploy workflow to utilise these new Github environments. Take a few minutes to review the modified [deploy.yml](./.github/workflows/deploy.yml) file.

Deploy to both environments from the Github Actions tab. Once deployed, open the public IP/DNS of your NGINX instance and you should see the the name of the environment in the output. 

Congratulations! You've successfully amended your stack to support multiple environments! Feel free to experiment with Github Actions and CDK - both of which are immensely powerful to rapidly provision and scale your infrastructure in AWS. 

Once you're done, clean up your stacks by deleting them from Cloudformation console. 