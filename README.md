# AWS CDK Github Actions Workshop

In this section, we will configure our AWS and Github for the workshop

## AWS Setup

All examples in workshop will use the Sydney (ap-southeast-2) region. You are free to use any other AWS Region.  

#### CDK Setup
If you haven't used CDK in your AWS Account and the region you've chosen, you'll have to first run the bootstrap your environment. 

Simplest way to do this is open a CloudShell instance from AWS Console and run the following command:

```shell
cdk bootstrap aws://ACCOUNT-NUMBER/REGION
```
This will deploy a Cloudformation stack to your environment with all resources required for CDK to function.

#### Github Actions Role
Github Actions runners can be self-hosted or they can be managed by Github. In this workshop, we will go with the latter as they're the quickest to get started with. With this approach we need to provide a way for Github to authenticate with our AWS environment in a secure manner. 

AWS and Github recommend using [Github OIDC provider](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services). Essentially, we setup an IAM Role which is only allowed to be assumed by an Action workflow triggered from a Github Workflow.

To expedite this process, we will deployed a pre-configured Cloudformation stack. Using console or CLI deploy [github-role-stack.yml](./github-role-stack.yml). 

Note: You will have to provide a value for `SubjectClaimFilters` parameter which follows the pattern: `repo:OWNER/REPOSITORY:environment:NAME`. We will allow this role to be deployable from _all branches_ of _this repository_ to _all environments_ (more on environments later) so for this repository it would be something like: `repo:karchit/aws-cdk-workshop:*:*`

<details open>
    <summary>CLI Command</summary>
    Replace SCF variable with your user/organisation. This can be run from the CloudShell environment you set up earlier for bootstrap.

    SCF="repo:karchit/aws-cdk-workshop:*:*" &&

    aws cloudformation deploy --template-file /path_to_template/template.json --stack-name github-actions-role --parameter-overrides SubjectClaimFilters=$SCF
</details>
 