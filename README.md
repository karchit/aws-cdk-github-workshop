# AWS CDK Github Actions Workshop

In this section, we will configure our AWS and Github for the workshop


## Github Setup
Github Actions supports creation of environments which are used by workflows for deployments. In this workshop we will create two environments: dev & prod. 
To do this:
- Go to your repository's Settings -> Environments -> New Environment
- Create two environments named: dev, prod

These environments will play a critical role in our deployments so we will be configuring these frequently. 

## AWS Setup

All examples in workshop will use the Sydney (ap-southeast-2) region. You are free to use any other AWS Region.  

#### CDK Setup
If you haven't used CDK in your AWS Account and the region you've chosen, you'll have to first bootstrap your environment. 

Simplest way to do this is open a CloudShell instance from AWS Console and run the following command:

```shell
cdk bootstrap aws://ACCOUNT-NUMBER/REGION
```
This will deploy a Cloudformation stack to your environment with all resources required for CDK to function.

#### Github Actions Role
Github Actions runners can be self-hosted or they can be managed by Github. In this workshop, we will go with the latter as they're the quickest to get started with. With this approach we need to provide a way for Github to authenticate with our AWS environment in a secure manner. 

AWS and Github recommend using [Github OIDC provider](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services). Essentially, we setup an IAM Role which is only allowed to be assumed by an Action workflow triggered from a specific repository.

To expedite this process, we will deployed a pre-configured Cloudformation stack. Using console or CLI deploy [github-role-stack.yml](./github-role-stack.yml). 

>[!NOTE]
>You will have to provide a value for `SubjectClaimFilters` parameter which follows the pattern: `repo:OWNER/REPOSITORY:environment:NAME`. We will allow this role to be deployable from _all branches_ of _this repository_ to _all environments_ so for this repository it would be look like: `repo:karchit/aws-cdk-github-workshop:*`

<details open>
    <summary>CLI Command</summary>
    Replace SCF variable with your user/organisation. This can be run from the CloudShell environment you set up earlier for bootstrap.

```shell
# Replace SCF value with your own github repository name
SCF="repo:karchit/aws-cdk-workshop:*" && \

wget -O stack.yml https://raw.githubusercontent.com/karchit/aws-cdk-github-workshop/1-cdk/github-role-stack.yml && \

aws cloudformation deploy --template-file ./stack.yml --stack-name github-actions-role --parameter-overrides SubjectClaimFilters=$SCF --capabilities "CAPABILITY_NAMED_IAM"
```
</details>
 
 Once the stack is successfully deployed, note down the ARN of the IAM `github-actions-role` IAM role. [This quick link](https://us-east-1.console.aws.amazon.com/iam/home#/roles/details/github-actions-role?section=permissions) will take you to the appropriate page on AWS Console. 

 Switch to [2-cdk-single-env](https://github.com/karchit/aws-cdk-github-workshop/tree/2-cdk-single-env) branch where we dive into creating our CDK stack.
