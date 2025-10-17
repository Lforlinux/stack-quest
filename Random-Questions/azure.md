# Azure 🌩️

## Table of Contents

- [Basic Concepts](#basic-concepts)
- [Advanced](#advanced)

---

## Basic Concepts

<details>
<summary>What is Azure?</summary>

Microsoft Azure is a cloud computing platform and service created by Microsoft for building, testing, deploying, and managing applications and services through Microsoft-managed data centers. It provides a comprehensive suite of cloud services including computing, analytics, storage, and networking. Azure supports multiple programming languages, tools, and frameworks, and offers both Platform-as-a-Service (PaaS) and Infrastructure-as-a-Service (IaaS) capabilities.

Key features of Azure include:
- Virtual machines and cloud services
- App services and serverless computing
- Storage solutions (blob, file, table, queue)
- Database services (SQL Database, Cosmos DB)
- Networking and security services
- AI and machine learning services
- DevOps and monitoring tools

</details>

<details>
<summary>What are ARM templates in Azure?</summary>

Azure Resource Manager (ARM) templates are JSON files that define the infrastructure and configuration for your Azure solution. They provide a declarative way to deploy and manage Azure resources consistently and repeatedly.

Key benefits of ARM templates:
- **Infrastructure as Code**: Define your infrastructure in code
- **Idempotent**: Can be run multiple times with the same result
- **Dependency Management**: Automatically handles resource dependencies
- **Rollback Capability**: Can rollback to previous deployments
- **Version Control**: Templates can be stored in version control systems

ARM templates use JSON syntax and can include:
- Resource definitions
- Parameters for customization
- Variables for reusable values
- Outputs for returning values
- Functions for dynamic values

Example template structure:
```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": { },
  "variables": { },
  "resources": [ ],
  "outputs": { }
}
```

</details>

<details>
<summary>What is Azure CDN?</summary>

Azure Content Delivery Network (CDN) is a global network of servers that caches and delivers web content to users based on their geographic location. It improves performance by reducing latency and bandwidth consumption.

Key features of Azure CDN:
- **Global Edge Locations**: Servers located worldwide for faster content delivery
- **Caching**: Stores frequently accessed content closer to users
- **Compression**: Reduces file sizes to improve transfer speeds
- **HTTPS Support**: Secure content delivery
- **Custom Domains**: Use your own domain names
- **Analytics**: Detailed usage and performance metrics

Azure CDN supports:
- Static web content (images, CSS, JavaScript)
- Video streaming
- Software downloads
- API responses
- Dynamic content acceleration

Benefits:
- Reduced latency for end users
- Lower bandwidth costs
- Improved scalability
- Better user experience
- Reduced load on origin servers

</details>

<details>
<summary>How is Azure App Service different from Azure Functions?</summary>

Azure App Service and Azure Functions are both compute services but serve different purposes:

**Azure App Service:**
- **Purpose**: Host web applications, APIs, and mobile backends
- **Runtime**: Always-on applications with continuous execution
- **Scaling**: Manual or automatic scaling based on demand
- **Pricing**: Pay for allocated resources (even when idle)
- **Use Cases**: Web apps, REST APIs, mobile backends, long-running processes
- **Deployment**: Supports multiple deployment methods (Git, FTP, CI/CD)
- **Features**: Built-in authentication, SSL certificates, custom domains

**Azure Functions:**
- **Purpose**: Event-driven, serverless compute service
- **Runtime**: Execute code in response to events or triggers
- **Scaling**: Automatic scaling, pay-per-execution
- **Pricing**: Pay only for execution time and resources used
- **Use Cases**: Event processing, scheduled tasks, microservices, data processing
- **Deployment**: Code deployment through various methods
- **Features**: Built-in triggers, bindings, monitoring

**Key Differences:**
- App Service is for always-on applications; Functions are for event-driven tasks
- App Service has higher baseline costs; Functions are more cost-effective for sporadic workloads
- App Service provides more control; Functions abstract away infrastructure management

</details>

<details>
<summary>How to define an Environment Variable on Azure using Azure CLI?</summary>

You can define environment variables in Azure using Azure CLI in several ways:

**1. For App Service:**
```bash
# Set a single environment variable
az webapp config appsettings set --resource-group myResourceGroup --name myAppName --settings "MY_VAR=my_value"

# Set multiple environment variables
az webapp config appsettings set --resource-group myResourceGroup --name myAppName --settings "VAR1=value1" "VAR2=value2"

# Set connection string
az webapp config connection-string set --resource-group myResourceGroup --name myAppName --connection-string-type SQLServer --settings "MyConnectionString=Server=..."
```

**2. For Container Instances:**
```bash
az container create --resource-group myResourceGroup --name myContainer --image myimage --environment-variables "ENV_VAR=value"
```

**3. For Azure Functions:**
```bash
az functionapp config appsettings set --resource-group myResourceGroup --name myFunctionApp --settings "FUNCTION_VAR=value"
```

**4. For Virtual Machines:**
```bash
# Set environment variables in VM startup script
az vm run-command invoke --resource-group myResourceGroup --name myVM --command-id RunShellScript --scripts "export MY_VAR=value"
```

**Best Practices:**
- Use Azure Key Vault for sensitive values
- Use application settings for configuration
- Avoid hardcoding secrets in scripts
- Use ARM templates for consistent deployments

</details>

<details>
<summary>How would you choose between Azure Blob Storage vs. Azure File Service?</summary>

The choice between Azure Blob Storage and Azure File Service depends on your specific use case:

**Azure Blob Storage:**
- **Use Cases**: 
  - Unstructured data (images, videos, documents)
  - Backup and archival
  - Data lake scenarios
  - Static website hosting
  - Big data analytics
- **Access**: REST API, SDKs, Azure Storage Explorer
- **Protocols**: HTTP/HTTPS
- **Performance**: Optimized for large files and high throughput
- **Cost**: Lower cost for large amounts of data
- **Features**: Hot, cool, archive tiers; lifecycle management

**Azure File Service:**
- **Use Cases**:
  - File shares for applications
  - Lift-and-shift scenarios
  - Shared storage for VMs
  - User home directories
  - Application data sharing
- **Access**: SMB protocol, mounted as network drives
- **Protocols**: SMB 2.1, SMB 3.0
- **Performance**: Optimized for random access and small files
- **Cost**: Higher cost but more familiar file system interface
- **Features**: NTFS permissions, Active Directory integration

**Decision Factors:**
- **Access Pattern**: Blob for programmatic access, File for file system access
- **Protocol Requirements**: File for SMB, Blob for HTTP/REST
- **Integration**: File for legacy applications, Blob for cloud-native apps
- **Performance**: Blob for large files, File for frequent small file access
- **Cost**: Blob for cost optimization, File for convenience

</details>

<details>
<summary>What is the difference between Keys and Secrets in Azure Key Vault?</summary>

Azure Key Vault stores three types of sensitive information: Keys, Secrets, and Certificates.

**Keys:**
- **Purpose**: Cryptographic keys for encryption/decryption and signing
- **Types**: RSA, EC (Elliptic Curve), HSM-protected keys
- **Use Cases**: 
  - Data encryption/decryption
  - Digital signatures
  - JWT token signing
  - Database encryption
- **Operations**: Encrypt, Decrypt, Sign, Verify, Wrap, Unwrap
- **Access**: Through cryptographic APIs
- **Rotation**: Can be rotated automatically or manually

**Secrets:**
- **Purpose**: Store sensitive text-based information
- **Types**: Passwords, connection strings, API keys, tokens
- **Use Cases**:
  - Database connection strings
  - API keys and tokens
  - Passwords and credentials
  - Configuration values
- **Operations**: Get, Set, Delete, List
- **Access**: Through REST API or SDKs
- **Rotation**: Manual rotation (can be automated with custom logic)

**Key Differences:**
- **Keys**: Cryptographic operations, hardware security modules (HSM) support
- **Secrets**: Simple storage and retrieval of sensitive text
- **Performance**: Keys optimized for cryptographic operations
- **Security**: Keys can be HSM-protected for higher security
- **Usage**: Keys for encryption, Secrets for configuration

**Best Practices:**
- Use Keys for cryptographic operations
- Use Secrets for configuration and credentials
- Implement proper access policies
- Enable soft delete and purge protection
- Monitor access and usage

</details>

<details>
<summary>What's the difference between Azure SQL Database and Azure SQL Managed Instance?</summary>

Azure SQL Database and Azure SQL Managed Instance are both managed SQL services but with different levels of compatibility and management:

**Azure SQL Database:**
- **Type**: Platform-as-a-Service (PaaS)
- **Compatibility**: Optimized for cloud-native applications
- **Management**: Microsoft manages OS, database engine, and infrastructure
- **Features**: 
  - Single database or elastic pools
  - Built-in high availability
  - Automatic backups and point-in-time restore
  - Built-in security features
  - Serverless compute option
- **Limitations**: 
  - No SQL Server Agent
  - Limited cross-database queries
  - No CLR support
  - No distributed transactions
- **Use Cases**: New cloud applications, SaaS applications, microservices

**Azure SQL Managed Instance:**
- **Type**: Infrastructure-as-a-Service (IaaS) with PaaS benefits
- **Compatibility**: Near 100% compatibility with SQL Server
- **Management**: Microsoft manages infrastructure, you manage database
- **Features**:
  - Full SQL Server feature compatibility
  - SQL Server Agent support
  - Cross-database queries
  - CLR support
  - Distributed transactions
  - Native virtual network integration
- **Limitations**: 
  - Higher cost
  - Longer deployment time
  - Some features still in preview
- **Use Cases**: Lift-and-shift migrations, complex enterprise applications

**Key Differences:**
- **Compatibility**: Managed Instance offers near-complete SQL Server compatibility
- **Cost**: SQL Database is more cost-effective
- **Features**: Managed Instance supports more SQL Server features
- **Migration**: Managed Instance easier for on-premises migrations
- **Management**: SQL Database requires less management overhead

</details>

<details>
<summary>When should we use Azure Table Storage over Azure SQL?</summary>

Azure Table Storage and Azure SQL serve different data storage needs:

**Use Azure Table Storage when:**
- **NoSQL Requirements**: Need flexible schema or schema-less data
- **Massive Scale**: Storing billions of entities with high throughput
- **Cost Optimization**: Need very low-cost storage for large datasets
- **Simple Queries**: Primarily key-value lookups and simple queries
- **Unstructured Data**: Storing logs, telemetry, user preferences
- **High Availability**: Need 99.99% availability with automatic replication
- **Global Distribution**: Need data replicated across multiple regions

**Use Azure SQL when:**
- **Relational Data**: Complex relationships between entities
- **Complex Queries**: Need SQL queries, joins, aggregations
- **ACID Properties**: Need transactions and data consistency
- **Structured Data**: Well-defined schema requirements
- **Reporting**: Need complex reporting and analytics
- **Integration**: Need to integrate with existing SQL-based systems
- **Advanced Features**: Need stored procedures, triggers, views

**Azure Table Storage Characteristics:**
- **Schema**: Flexible, can store different properties per entity
- **Querying**: Limited to partition key and row key queries
- **Consistency**: Eventually consistent (strong consistency available)
- **Cost**: Very low cost per GB stored
- **Performance**: Optimized for high throughput, low latency
- **Limitations**: No complex queries, no joins, no foreign keys

**Decision Factors:**
- **Data Structure**: Structured (SQL) vs. Unstructured (Table)
- **Query Complexity**: Simple lookups (Table) vs. Complex queries (SQL)
- **Scale**: Massive scale (Table) vs. Moderate scale (SQL)
- **Cost**: Cost-sensitive (Table) vs. Feature-rich (SQL)
- **Consistency**: Eventual consistency (Table) vs. ACID (SQL)

</details>

<details>
<summary>Explain the difference between Block Blobs, Append Blobs and Page Blobs in Azure?</summary>

Azure Blob Storage offers three types of blobs, each optimized for different use cases:

**Block Blobs:**
- **Structure**: Composed of blocks (up to 100MB each, max 50,000 blocks)
- **Use Cases**: 
  - Text and binary files
  - Images, videos, documents
  - Backup and archival
  - Static website content
- **Operations**: Upload, download, delete entire blob
- **Performance**: Optimized for streaming large files
- **Access Tiers**: Hot, Cool, Archive
- **Max Size**: 4.75 TB
- **Upload**: Can upload blocks in parallel for better performance

**Append Blobs:**
- **Structure**: Composed of blocks that can only be appended to
- **Use Cases**:
  - Log files
  - Audit trails
  - Data streaming
  - IoT sensor data
- **Operations**: Append data only (no modification of existing data)
- **Performance**: Optimized for append operations
- **Access Tiers**: Hot, Cool (no Archive)
- **Max Size**: 195 GB
- **Concurrency**: Supports concurrent append operations

**Page Blobs:**
- **Structure**: Collection of 512-byte pages
- **Use Cases**:
  - Virtual machine disks (VHD files)
  - Random read/write scenarios
  - Database files
  - High-performance applications
- **Operations**: Read/write individual pages
- **Performance**: Optimized for random access
- **Access Tiers**: Hot, Cool (no Archive)
- **Max Size**: 8 TB
- **Features**: Snapshot support, incremental snapshots

**Key Differences:**
- **Block Blobs**: Best for large files, streaming, archival
- **Append Blobs**: Best for logging, sequential data
- **Page Blobs**: Best for random access, VM disks
- **Modification**: Block and Page allow modification, Append only allows appending
- **Performance**: Each optimized for different access patterns
- **Cost**: Similar pricing, but different access tier availability

**Selection Criteria:**
- **Access Pattern**: Sequential (Block/Append) vs. Random (Page)
- **Modification**: Need to modify (Block/Page) vs. Append-only (Append)
- **Use Case**: Files (Block), Logs (Append), Disks (Page)
- **Size**: Large files (Block), Moderate size (Append/Page)

</details>

## Advanced

<details>
<summary>What to use: many small Azure Storage Blob containers vs one really large container with tons of blobs?</summary>

The choice between many small containers vs. one large container depends on several factors:

**Many Small Containers:**
- **Benefits**:
  - Better access control (per-container permissions)
  - Easier organization and management
  - Independent lifecycle management
  - Better performance for parallel operations
  - Easier backup and restore strategies
  - Better monitoring and analytics per container
- **Use Cases**:
  - Multi-tenant applications
  - Different data types or access patterns
  - Compliance requirements (data isolation)
  - Different retention policies
  - Team-based access control

**One Large Container:**
- **Benefits**:
  - Simpler management and fewer resources
  - Lower administrative overhead
  - Better cost efficiency (fewer container operations)
  - Easier cross-blob operations
  - Simpler backup strategies
- **Use Cases**:
  - Single-tenant applications
  - Homogeneous data types
  - Simple access patterns
  - Cost optimization
  - Legacy system migrations

**Performance Considerations:**
- **Small Containers**: Better for parallel operations, but more container operations
- **Large Container**: Fewer operations, but potential bottlenecks with high concurrency
- **Blob Operations**: Container choice doesn't significantly affect individual blob performance
- **Listing**: Large containers may have slower listing operations

**Security Considerations:**
- **Small Containers**: Granular access control, better isolation
- **Large Container**: Simpler security model, but less granular control
- **Compliance**: Small containers better for data segregation requirements

**Best Practices:**
- **Hybrid Approach**: Use containers for logical grouping (by tenant, data type, etc.)
- **Naming Convention**: Use consistent naming for easy management
- **Access Patterns**: Align container structure with access patterns
- **Monitoring**: Monitor container-level metrics for optimization
- **Lifecycle Management**: Use different policies per container when needed

**Recommendation**: Use many small containers when you need granular control, security, or organization. Use one large container when simplicity and cost are priorities.

</details>
