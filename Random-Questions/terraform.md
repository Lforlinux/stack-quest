# Terraform 🏗️

## Table of Contents

- [Basic Concepts](#basic-concepts)
- [Advanced](#advanced)

---

## Basic Concepts

<details>
<summary>What is IaC? What is Terraform?</summary>

Answer goes here

</details>

<details>
<summary>What is Terraform state?</summary>

Answer goes here

</details>

<details>
<summary>What are most common Terraform commands?</summary>

Answer goes here

</details>

<details>
<summary>What is Terraform backend?</summary>

Answer goes here

</details>

<details>
<summary>What are modules in Terraform?</summary>

Answer goes here

</details>

<details>
<summary>What is Terragrunt?</summary>

Answer goes here

</details>

<details>
<summary>Explain the workflow of the core Terraform?</summary>

Answer goes here

</details>

<details>
<summary>Difference between Terraform, AWS CloudFormation and Azure ARM?</summary>

Answer goes here

</details>

<details>
<summary>What is the difference between Terraform and Ansible?</summary>

Answer goes here

</details>

<details>
<summary>What are provisioners in Terraform?</summary>

Answer goes here

</details>

<details>
<summary>How can two people using the Terraform cloud can create two different sets of infrastructure using the same working directory?</summary>

Answer goes here

</details>

<details>
<summary>What is a null resource in Terraform?</summary>

Answer goes here

</details>

<details>
<summary>Which command is used to perform syntax validation on terraform configuration files?</summary>

`terraform validate`

</details>

<details>
<summary>How can I format my current directory of Terraform config files in the HCP format?</summary>

`terraform fmt --recursive`

</details>

## Advanced

<details>
<summary>Given a Terraform configuration that manages a fleet of identical EC2 instances across multiple availability zones, how would you modify the configuration to use an external module to manage the IAM roles and permissions for these instances, while also ensuring that the IAM resources are created in the same region as the rest of the infrastructure?</summary>

## Comprehensive Terraform Module Refactoring for IAM Management

### Overview

This solution demonstrates how to refactor an existing Terraform configuration to use external modules for IAM role management while maintaining regional consistency and following Terraform best practices.

### Prerequisites

- Terraform 1.0+ (recommended 1.5+)
- AWS Provider 5.0+
- Understanding of Terraform modules and state management

### Step 1: Create the External IAM Module

**Directory Structure:**
```
modules/
├── iam-roles/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── versions.tf
└── ec2-fleet/
    ├── main.tf
    ├── variables.tf
    └── outputs.tf
```

**modules/iam-roles/main.tf:**
```hcl
# IAM Role for EC2 instances
resource "aws_iam_role" "ec2_role" {
  name = "${var.name_prefix}-ec2-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = var.tags
}

# IAM Policy for EC2 instances
resource "aws_iam_policy" "ec2_policy" {
  name        = "${var.name_prefix}-ec2-policy"
  description = "Policy for EC2 instances in the fleet"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject"
        ]
        Resource = [
          "${var.s3_bucket_arn}/*",
          "${var.s3_bucket_arn}"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:${var.aws_region}:*:log-group:/aws/ec2/*"
      },
      {
        Effect = "Allow"
        Action = [
          "ssm:GetParameter",
          "ssm:GetParameters",
          "ssm:GetParametersByPath"
        ]
        Resource = "arn:aws:ssm:${var.aws_region}:*:parameter/${var.name_prefix}/*"
      }
    ]
  })

  tags = var.tags
}

# Attach policy to role
resource "aws_iam_role_policy_attachment" "ec2_policy_attachment" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = aws_iam_policy.ec2_policy.arn
}

# Instance Profile
resource "aws_iam_instance_profile" "ec2_profile" {
  name = "${var.name_prefix}-ec2-profile"
  role = aws_iam_role.ec2_role.name

  tags = var.tags
}
```

**modules/iam-roles/variables.tf:**
```hcl
variable "name_prefix" {
  description = "Prefix for naming resources"
  type        = string
  default     = "fleet"
}

variable "aws_region" {
  description = "AWS region for resource creation"
  type        = string
}

variable "s3_bucket_arn" {
  description = "ARN of the S3 bucket for EC2 access"
  type        = string
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}

variable "additional_policies" {
  description = "List of additional policy ARNs to attach"
  type        = list(string)
  default     = []
}
```

**modules/iam-roles/outputs.tf:**
```hcl
output "iam_role_arn" {
  description = "ARN of the IAM role"
  value       = aws_iam_role.ec2_role.arn
}

output "iam_role_name" {
  description = "Name of the IAM role"
  value       = aws_iam_role.ec2_role.name
}

output "instance_profile_arn" {
  description = "ARN of the instance profile"
  value       = aws_iam_instance_profile.ec2_profile.arn
}

output "instance_profile_name" {
  description = "Name of the instance profile"
  value       = aws_iam_instance_profile.ec2_profile.name
}
```

**modules/iam-roles/versions.tf:**
```hcl
terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}
```

### Step 2: Create the EC2 Fleet Module

**modules/ec2-fleet/main.tf:**
```hcl
# Data source for availability zones
data "aws_availability_zones" "available" {
  state = "available"
}

# Launch Template
resource "aws_launch_template" "fleet_template" {
  name_prefix   = "${var.name_prefix}-"
  image_id      = var.ami_id
  instance_type = var.instance_type
  
  vpc_security_group_ids = var.security_group_ids
  
  iam_instance_profile {
    name = var.iam_instance_profile_name
  }
  
  user_data = base64encode(var.user_data)
  
  tag_specifications {
    resource_type = "instance"
    tags = merge(var.tags, {
      Name = "${var.name_prefix}-instance"
    })
  }
  
  tags = var.tags
}

# Auto Scaling Group
resource "aws_autoscaling_group" "fleet_asg" {
  name                = "${var.name_prefix}-asg"
  vpc_zone_identifier = var.subnet_ids
  target_group_arns   = var.target_group_arns
  health_check_type   = var.health_check_type
  health_check_grace_period = var.health_check_grace_period
  
  min_size         = var.min_size
  max_size         = var.max_size
  desired_capacity = var.desired_capacity
  
  launch_template {
    id      = aws_launch_template.fleet_template.id
    version = "$Latest"
  }
  
  dynamic "tag" {
    for_each = var.tags
    content {
      key                 = tag.key
      value               = tag.value
      propagate_at_launch = true
    }
  }
  
  lifecycle {
    create_before_destroy = true
  }
}
```

**modules/ec2-fleet/variables.tf:**
```hcl
variable "name_prefix" {
  description = "Prefix for naming resources"
  type        = string
}

variable "ami_id" {
  description = "AMI ID for EC2 instances"
  type        = string
}

variable "instance_type" {
  description = "Instance type for EC2 instances"
  type        = string
  default     = "t3.medium"
}

variable "subnet_ids" {
  description = "List of subnet IDs for the ASG"
  type        = list(string)
}

variable "security_group_ids" {
  description = "List of security group IDs"
  type        = list(string)
}

variable "iam_instance_profile_name" {
  description = "Name of the IAM instance profile"
  type        = string
}

variable "target_group_arns" {
  description = "List of target group ARNs"
  type        = list(string)
  default     = []
}

variable "min_size" {
  description = "Minimum number of instances"
  type        = number
  default     = 1
}

variable "max_size" {
  description = "Maximum number of instances"
  type        = number
  default     = 10
}

variable "desired_capacity" {
  description = "Desired number of instances"
  type        = number
  default     = 3
}

variable "health_check_type" {
  description = "Type of health check"
  type        = string
  default     = "EC2"
}

variable "health_check_grace_period" {
  description = "Health check grace period in seconds"
  type        = number
  default     = 300
}

variable "user_data" {
  description = "User data script"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
```

### Step 3: Main Configuration

**main.tf:**
```hcl
# Provider configuration with explicit region
provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.project_name
      ManagedBy   = "Terraform"
    }
  }
}

# Data sources
data "aws_vpc" "main" {
  tags = {
    Name = var.vpc_name
  }
}

data "aws_subnets" "private" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.main.id]
  }
  
  tags = {
    Type = "private"
  }
}

data "aws_ami" "latest_amazon_linux" {
  most_recent = true
  owners      = ["amazon"]
  
  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

# S3 Bucket for application data
resource "aws_s3_bucket" "app_data" {
  bucket = "${var.project_name}-${var.environment}-app-data"
  
  tags = {
    Name        = "${var.project_name}-${var.environment}-app-data"
    Environment = var.environment
  }
}

# Security Group for EC2 instances
resource "aws_security_group" "ec2_sg" {
  name_prefix = "${var.project_name}-ec2-"
  vpc_id      = data.aws_vpc.main.id
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "${var.project_name}-ec2-sg"
  }
}

# IAM Module
module "iam_roles" {
  source = "./modules/iam-roles"
  
  name_prefix  = "${var.project_name}-${var.environment}"
  aws_region   = var.aws_region
  s3_bucket_arn = aws_s3_bucket.app_data.arn
  
  tags = {
    Environment = var.environment
    Project     = var.project_name
    Component   = "IAM"
  }
}

# EC2 Fleet Module
module "ec2_fleet" {
  source = "./modules/ec2-fleet"
  
  name_prefix                = "${var.project_name}-${var.environment}"
  ami_id                    = data.aws_ami.latest_amazon_linux.id
  instance_type             = var.instance_type
  subnet_ids                = data.aws_subnets.private.ids
  security_group_ids        = [aws_security_group.ec2_sg.id]
  iam_instance_profile_name = module.iam_roles.instance_profile_name
  
  min_size         = var.min_instance_count
  max_size         = var.max_instance_count
  desired_capacity = var.desired_instance_count
  
  user_data = templatefile("${path.module}/user_data.sh", {
    s3_bucket = aws_s3_bucket.app_data.bucket
    region    = var.aws_region
  })
  
  tags = {
    Environment = var.environment
    Project     = var.project_name
    Component   = "EC2"
  }
}
```

**variables.tf:**
```hcl
variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "us-west-2"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "fleet-app"
}

variable "vpc_name" {
  description = "Name of the VPC"
  type        = string
  default     = "main"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.medium"
}

variable "min_instance_count" {
  description = "Minimum number of instances"
  type        = number
  default     = 2
}

variable "max_instance_count" {
  description = "Maximum number of instances"
  type        = number
  default     = 10
}

variable "desired_instance_count" {
  description = "Desired number of instances"
  type        = number
  default     = 3
}
```

**outputs.tf:**
```hcl
output "iam_role_arn" {
  description = "ARN of the IAM role"
  value       = module.iam_roles.iam_role_arn
}

output "instance_profile_name" {
  description = "Name of the instance profile"
  value       = module.iam_roles.instance_profile_name
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.app_data.bucket
}

output "asg_name" {
  description = "Name of the Auto Scaling Group"
  value       = module.ec2_fleet.asg_name
}
```

### Step 4: User Data Script

**user_data.sh:**
```bash
#!/bin/bash
yum update -y
yum install -y aws-cli

# Configure CloudWatch agent
yum install -y amazon-cloudwatch-agent

# Create application directory
mkdir -p /opt/app
cd /opt/app

# Download application from S3
aws s3 cp s3://${s3_bucket}/app.tar.gz /opt/app/app.tar.gz
tar -xzf app.tar.gz

# Start application
./start.sh
```

### Step 5: Terraform Configuration Files

**terraform.tf:**
```hcl
terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  # Remote state backend (example with S3)
  backend "s3" {
    bucket         = "your-terraform-state-bucket"
    key            = "fleet-app/terraform.tfstate"
    region         = "us-west-2"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}
```

### Step 6: Deployment and Usage

**Initialize and Deploy:**
```bash
# Initialize Terraform
terraform init

# Plan the deployment
terraform plan -var-file="dev.tfvars"

# Apply the configuration
terraform apply -var-file="dev.tfvars"
```

**dev.tfvars:**
```hcl
aws_region = "us-west-2"
environment = "dev"
project_name = "fleet-app"
instance_type = "t3.medium"
min_instance_count = 2
max_instance_count = 5
desired_instance_count = 3
```

### Key Benefits of This Approach

1. **Modularity**: Clear separation of concerns between IAM and EC2 management
2. **Reusability**: IAM module can be reused across different projects
3. **Regional Consistency**: All resources created in the same region
4. **State Management**: Proper state isolation between modules
5. **Scalability**: Easy to add more instances or modify configurations
6. **Security**: IAM roles follow least privilege principle
7. **Maintainability**: Clear structure and documentation

### Best Practices Implemented

- **Module Structure**: Proper module organization with versions.tf
- **Variable Validation**: Type constraints and descriptions
- **Output Management**: Clear outputs for module communication
- **Tagging Strategy**: Consistent tagging across all resources
- **State Management**: Remote state backend configuration
- **Security**: Least privilege IAM policies
- **Documentation**: Comprehensive inline documentation

### Advanced Considerations

1. **Cross-Region Resources**: For global applications, consider using data sources
2. **State Locking**: Implement DynamoDB table for state locking
3. **Workspace Management**: Use Terraform workspaces for environment separation
4. **Secret Management**: Integrate with AWS Secrets Manager or Parameter Store
5. **Monitoring**: Add CloudWatch alarms and logging
6. **Backup Strategy**: Implement automated backups for critical data

This solution provides a production-ready foundation for managing EC2 fleets with proper IAM integration while maintaining regional consistency and following Terraform best practices.

</details>

<details>
<summary>I have 3 people in my team who want to work on the same AWS Infrastructure on Terraform as well as same state. What can I do to ensure there are no clashes?</summary>

## Terraform Team Collaboration and State Management

### Problem Analysis
When multiple team members work on the same Terraform infrastructure, several challenges arise:
- **State File Conflicts**: Multiple people modifying the same state file
- **Resource Conflicts**: Simultaneous changes to the same resources
- **Inconsistent Environments**: Different team members having different configurations

### Solution: Remote State Backend with State Locking

#### 1. **S3 Backend with DynamoDB State Locking**

**terraform.tf:**
```hcl
terraform {
  required_version = ">= 1.0"
  
  backend "s3" {
    bucket         = "your-company-terraform-state"
    key            = "infrastructure/terraform.tfstate"
    region         = "us-west-2"
    encrypt        = true
    dynamodb_table = "terraform-state-locks"
    
    # Optional: Enable versioning
    versioning = true
  }
}
```

**DynamoDB Table for State Locking:**
```hcl
resource "aws_dynamodb_table" "terraform_locks" {
  name           = "terraform-state-locks"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "LockID"
  
  attribute {
    name = "LockID"
    type = "S"
  }
  
  tags = {
    Name        = "Terraform State Locking"
    Environment = "shared"
  }
}
```

#### 2. **Team Workflow Best Practices**

**Git Workflow:**
```bash
# 1. Always pull latest changes before starting work
git pull origin main

# 2. Create feature branch for your changes
git checkout -b feature/add-new-resource

# 3. Make your changes and test locally
terraform plan
terraform apply

# 4. Commit and push changes
git add .
git commit -m "Add new RDS instance"
git push origin feature/add-new-resource

# 5. Create Pull Request for review
```

**Terraform Workflow:**
```bash
# 1. Initialize with remote backend
terraform init

# 2. Always plan before apply
terraform plan -out=tfplan

# 3. Review the plan carefully
terraform show tfplan

# 4. Apply only after team approval
terraform apply tfplan

# 5. Clean up plan files
rm tfplan
```

#### 3. **Environment Separation Strategy**

**Directory Structure:**
```
terraform/
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── terraform.tfvars
│   ├── staging/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── terraform.tfvars
│   └── prod/
│       ├── main.tf
│       ├── variables.tf
│       └── terraform.tfvars
├── modules/
│   ├── vpc/
│   ├── ec2/
│   └── rds/
└── shared/
    ├── backend.tf
    └── providers.tf
```

**Environment-specific Backend Configuration:**
```hcl
# environments/dev/backend.tf
terraform {
  backend "s3" {
    bucket         = "your-company-terraform-state"
    key            = "dev/terraform.tfstate"
    region         = "us-west-2"
    encrypt        = true
    dynamodb_table = "terraform-state-locks"
  }
}
```

#### 4. **Team Communication Protocols**

**Slack/Teams Integration:**
```bash
# Notify team before making changes
terraform plan -var-file="dev.tfvars" | tee plan-output.txt
# Share plan-output.txt in team channel for review
```

**Change Management:**
1. **Pre-Change Notification**: Always notify team before major changes
2. **Plan Review**: Share terraform plan output for team review
3. **Approval Process**: Get approval from at least one team member
4. **Change Windows**: Establish specific times for production changes

#### 5. **Advanced State Management**

**State Import for Existing Resources:**
```bash
# Import existing resources into state
terraform import aws_instance.web i-1234567890abcdef0
terraform import aws_s3_bucket.app_data my-app-bucket
```

**State Operations:**
```bash
# List resources in state
terraform state list

# Show specific resource
terraform state show aws_instance.web

# Move resources between states
terraform state mv aws_instance.web aws_instance.web_server

# Remove resources from state (without destroying)
terraform state rm aws_instance.old_web
```

#### 6. **CI/CD Integration**

**GitHub Actions Workflow:**
```yaml
name: 'Terraform Plan and Apply'
on:
  pull_request:
    paths:
      - 'terraform/**'
  push:
    branches:
      - main
    paths:
      - 'terraform/**'

jobs:
  terraform:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
        with:
          terraform_version: 1.5.0
      
      - name: Terraform Init
        run: terraform init
        working-directory: ./terraform/environments/dev
      
      - name: Terraform Plan
        run: terraform plan -out=tfplan
        working-directory: ./terraform/environments/dev
      
      - name: Terraform Apply (on main branch)
        if: github.ref == 'refs/heads/main' && github.event_name == 'push'
        run: terraform apply tfplan
        working-directory: ./terraform/environments/dev
```

#### 7. **Monitoring and Alerting**

**CloudWatch Alarms for State Changes:**
```hcl
resource "aws_cloudwatch_metric_alarm" "terraform_state_changes" {
  alarm_name          = "terraform-state-changes"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "StateFileModifications"
  namespace           = "Terraform/State"
  period              = "300"
  statistic           = "Sum"
  threshold           = "0"
  alarm_description   = "This metric monitors terraform state changes"
}
```

### Key Benefits

1. **State Consistency**: All team members work with the same state
2. **Conflict Prevention**: State locking prevents simultaneous modifications
3. **Audit Trail**: Complete history of infrastructure changes
4. **Rollback Capability**: Easy rollback to previous states
5. **Team Collaboration**: Clear workflow for team coordination

### Best Practices Summary

- Always use remote state backends
- Implement state locking with DynamoDB
- Use environment separation
- Follow Git workflow best practices
- Implement CI/CD for automated deployments
- Establish clear communication protocols
- Regular state backups and monitoring

</details>

<details>
<summary>In a pipeline, where would you store the Terraform state?</summary>

## Terraform State Storage in CI/CD Pipelines

### Recommended Approach: Remote State Backend

#### 1. **S3 Backend with DynamoDB Locking (Recommended)**

**Configuration:**
```hcl
terraform {
  backend "s3" {
    bucket         = "company-terraform-state-prod"
    key            = "infrastructure/terraform.tfstate"
    region         = "us-west-2"
    encrypt        = true
    dynamodb_table = "terraform-state-locks"
    versioning     = true
  }
}
```

**Benefits:**
- **Durability**: 99.999999999% (11 9's) durability
- **Availability**: 99.99% availability
- **State Locking**: Prevents concurrent modifications
- **Versioning**: Complete change history
- **Encryption**: Data encrypted at rest and in transit

#### 2. **Pipeline-Specific State Management**

**Environment Separation:**
```hcl
# environments/dev/backend.tf
terraform {
  backend "s3" {
    bucket         = "company-terraform-state"
    key            = "dev/terraform.tfstate"
    region         = "us-west-2"
    encrypt        = true
    dynamodb_table = "terraform-state-locks"
  }
}

# environments/staging/backend.tf
terraform {
  backend "s3" {
    bucket         = "company-terraform-state"
    key            = "staging/terraform.tfstate"
    region         = "us-west-2"
    encrypt        = true
    dynamodb_table = "terraform-state-locks"
  }
}

# environments/prod/backend.tf
terraform {
  backend "s3" {
    bucket         = "company-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-west-2"
    encrypt        = true
    dynamodb_table = "terraform-state-locks"
  }
}
```

#### 3. **CI/CD Pipeline Configuration**

**GitHub Actions Example:**
```yaml
name: 'Terraform Pipeline'
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  TF_VERSION: '1.5.0'
  AWS_REGION: 'us-west-2'

jobs:
  terraform-plan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}
      
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
        with:
          terraform_version: ${{ env.TF_VERSION }}
      
      - name: Terraform Init
        run: terraform init
        working-directory: ./terraform/environments/${{ github.ref_name }}
      
      - name: Terraform Plan
        run: terraform plan -out=tfplan
        working-directory: ./terraform/environments/${{ github.ref_name }}
      
      - name: Upload Plan
        uses: actions/upload-artifact@v3
        with:
          name: terraform-plan
          path: ./terraform/environments/${{ github.ref_name }}/tfplan

  terraform-apply:
    needs: terraform-plan
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}
      
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
        with:
          terraform_version: ${{ env.TF_VERSION }}
      
      - name: Download Plan
        uses: actions/download-artifact@v3
        with:
          name: terraform-plan
          path: ./terraform/environments/${{ github.ref_name }}
      
      - name: Terraform Apply
        run: terraform apply tfplan
        working-directory: ./terraform/environments/${{ github.ref_name }}
```

#### 4. **State Security Best Practices**

**S3 Bucket Configuration:**
```hcl
resource "aws_s3_bucket" "terraform_state" {
  bucket = "company-terraform-state"
  
  versioning {
    enabled = true
  }
  
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
  
  lifecycle_rule {
    enabled = true
    noncurrent_version_expiration {
      days = 90
    }
  }
}

resource "aws_s3_bucket_public_access_block" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
```

**DynamoDB Table for State Locking:**
```hcl
resource "aws_dynamodb_table" "terraform_locks" {
  name           = "terraform-state-locks"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "LockID"
  
  attribute {
    name = "LockID"
    type = "S"
  }
  
  point_in_time_recovery {
    enabled = true
  }
  
  tags = {
    Name        = "Terraform State Locking"
    Environment = "shared"
  }
}
```

#### 5. **Alternative State Storage Options**

**Terraform Cloud/Enterprise:**
```hcl
terraform {
  cloud {
    organization = "your-org"
    workspaces {
      name = "production"
    }
  }
}
```

**Azure Storage Backend:**
```hcl
terraform {
  backend "azurerm" {
    resource_group_name  = "terraform-state"
    storage_account_name = "tfstateaccount"
    container_name       = "tfstate"
    key                  = "terraform.tfstate"
  }
}
```

**Google Cloud Storage:**
```hcl
terraform {
  backend "gcs" {
    bucket = "terraform-state-bucket"
    prefix = "terraform/state"
  }
}
```

#### 6. **State Management in Multi-Environment Pipelines**

**Pipeline Structure:**
```
pipeline/
├── .github/workflows/
│   ├── dev-deploy.yml
│   ├── staging-deploy.yml
│   └── prod-deploy.yml
├── terraform/
│   ├── environments/
│   │   ├── dev/
│   │   ├── staging/
│   │   └── prod/
│   └── modules/
└── scripts/
    ├── plan.sh
    └── apply.sh
```

**Environment-specific State Keys:**
```bash
# Dev environment
terraform init -backend-config="key=dev/terraform.tfstate"

# Staging environment  
terraform init -backend-config="key=staging/terraform.tfstate"

# Production environment
terraform init -backend-config="key=prod/terraform.tfstate"
```

#### 7. **State Backup and Recovery**

**Automated State Backups:**
```bash
#!/bin/bash
# backup-state.sh

BUCKET="company-terraform-state"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup
aws s3 cp s3://$BUCKET/dev/terraform.tfstate s3://$BUCKET/backups/dev/terraform.tfstate.$DATE

# Keep only last 30 days of backups
aws s3 ls s3://$BUCKET/backups/dev/ | awk '$1 < "'$(date -d '30 days ago' '+%Y-%m-%d')'" {print $4}' | xargs -I {} aws s3 rm s3://$BUCKET/backups/dev/{}
```

**State Recovery Process:**
```bash
# 1. Stop all Terraform operations
# 2. Download backup state
aws s3 cp s3://company-terraform-state/backups/dev/terraform.tfstate.20231201_120000 s3://company-terraform-state/dev/terraform.tfstate

# 3. Verify state integrity
terraform state list

# 4. Plan to ensure consistency
terraform plan
```

### Key Recommendations

1. **Never store state in Git repositories**
2. **Always use remote state backends**
3. **Implement state locking**
4. **Enable state versioning**
5. **Use environment-specific state files**
6. **Implement automated backups**
7. **Monitor state file access and changes**
8. **Use least privilege access for state operations**

### Security Considerations

- **Encryption**: Always encrypt state files
- **Access Control**: Use IAM policies to restrict state access
- **Audit Logging**: Enable CloudTrail for state operations
- **Network Security**: Use VPC endpoints for S3 access
- **Secrets Management**: Never store secrets in state files

</details>

- Can I test my terraform modules? If so, how can I test them? Is there a common framework used to Terraform modules?
- How does state file locking work?
- What is Checkov?
- How can I use Terraform in a pipeline?
- How can one export data from one module to another?
- How can you import existing resources under Terraform management?
- Which command can be used to reconcile the Terraform state with the actual real-world infrastructure?
- What are some best practices when using Terraform modules?
- How do you handle secrets and sensitive data in Terraform?
- What are some best practices when writing Terraform code?
- How do you export data from one module to another?
