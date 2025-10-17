# Kubernetes 🎻

## Table of Contents

- [Basic Concepts](#basic-concepts)
- [Advanced Topics](#advanced-topics)

---

## Basic Concepts

<details>
<summary>What is Kubernetes?</summary>
Kubernetes (K8s) is an open-source container orchestration platform that automates the deployment, scaling, and management of containerized applications. It provides a framework for running distributed systems resiliently, with built-in capabilities for service discovery, load balancing, storage orchestration, automated rollouts and rollbacks, secret and configuration management, and horizontal scaling.
</details>

<details>
<summary>What problems does Kubernetes solve?</summary>
Kubernetes solves several key problems in containerized application management:
- **Container Orchestration**: Automatically manages container lifecycle, placement, and scaling
- **Service Discovery**: Enables containers to find and communicate with each other
- **Load Balancing**: Distributes traffic across multiple container instances
- **Storage Orchestration**: Manages persistent storage for stateful applications
- **Automated Rollouts/Rollbacks**: Handles application updates with zero downtime
- **Secret Management**: Securely manages sensitive configuration data
- **Horizontal Scaling**: Automatically scales applications based on demand
- **Self-Healing**: Restarts failed containers and replaces unhealthy nodes
</details>

<details>
<summary>What is the difference between Docker and Kubernetes?</summary>
**Docker** is a containerization platform that packages applications and their dependencies into lightweight, portable containers. **Kubernetes** is a container orchestration platform that manages and coordinates multiple Docker containers across a cluster of machines.

Key differences:
- **Scope**: Docker focuses on container creation and management; Kubernetes focuses on container orchestration
- **Scale**: Docker works on single machines; Kubernetes manages containers across multiple machines
- **Features**: Docker provides container runtime; Kubernetes provides scheduling, networking, storage, and service discovery
- **Use Case**: Docker is for building and running containers; Kubernetes is for managing containerized applications at scale
</details>

<details>
<summary>What are the core components of the Kubernetes control plane?</summary>
The Kubernetes control plane consists of several key components:

**Control Plane Components:**
- **kube-apiserver**: The front-end for the Kubernetes control plane, handles all API requests
- **etcd**: Distributed key-value store that stores cluster state and configuration
- **kube-scheduler**: Watches for newly created Pods and assigns them to nodes
- **kube-controller-manager**: Runs controller processes (Node Controller, Replication Controller, etc.)
- **cloud-controller-manager**: Manages cloud-specific resources and services

**Data Plane Components:**
- **kubelet**: Agent that runs on each node and manages Pod lifecycle
- **kube-proxy**: Network proxy that maintains network rules and handles load balancing
- **Container Runtime**: Software responsible for running containers (Docker, containerd, etc.)
</details>

<details>
<summary>What is a Pod and what does it do?</summary>
A **Pod** is the smallest deployable unit in Kubernetes. It represents a single instance of a running process in your cluster and can contain one or more containers that share:
- **Storage**: Volumes are shared between containers in the same Pod
- **Network**: Containers share the same IP address and port space
- **Specifications**: All containers in a Pod share the same lifecycle and scheduling

Key characteristics:
- Pods are ephemeral - they can be created, destroyed, and recreated
- Each Pod gets a unique IP address within the cluster
- Containers in a Pod can communicate via localhost
- Pods are typically managed by higher-level controllers like Deployments
</details>

<details>
<summary>How can containers within a pod communicate with each other?</summary>
Containers within the same Pod can communicate with each other using:
- **localhost**: All containers in a Pod share the same network namespace, so they can communicate via localhost
- **Shared IP Address**: All containers share the same Pod IP address
- **Port Numbers**: Containers can communicate using different port numbers on localhost
- **Shared Volumes**: Containers can share data through mounted volumes
- **Inter-Process Communication**: Containers can use IPC mechanisms like shared memory

Example: If you have a web server container on port 8080 and a database container on port 5432, they can communicate as:
- Web server → Database: `localhost:5432`
- Database → Web server: `localhost:8080`
</details>

<details>
<summary>What is a Kubernetes cluster?</summary>
A **Kubernetes cluster** is a set of nodes (physical or virtual machines) that run containerized applications. It consists of:

**Master Node (Control Plane):**
- Manages the cluster state and configuration
- Runs control plane components (API server, scheduler, controller manager, etcd)
- Makes decisions about cluster management

**Worker Nodes:**
- Run the actual application workloads
- Each node runs a kubelet agent and kube-proxy
- Host the container runtime (Docker, containerd, etc.)

**Key Features:**
- **High Availability**: Multiple master nodes for redundancy
- **Scalability**: Can add/remove nodes dynamically
- **Fault Tolerance**: Automatically handles node failures
- **Load Distribution**: Spreads workloads across available nodes
</details>

<details>
<summary>What are Deployments in Kubernetes?</summary>
A **Deployment** is a Kubernetes resource that provides declarative updates for Pods and ReplicaSets. It manages the desired state of your application and handles:

**Key Features:**
- **Rolling Updates**: Updates Pods gradually without downtime
- **Rollbacks**: Can revert to previous versions if issues occur
- **Scaling**: Can scale the number of Pod replicas up or down
- **Self-Healing**: Automatically replaces failed Pods

**Common Use Cases:**
- Stateless applications (web servers, APIs)
- Microservices architecture
- Applications requiring zero-downtime deployments

**Example Deployment:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```
</details>

<details>
<summary>What are StatefulSets in Kubernetes?</summary>
A **StatefulSet** is a Kubernetes workload resource that manages stateful applications. Unlike Deployments, StatefulSets provide:

**Key Features:**
- **Stable Network Identity**: Each Pod gets a persistent hostname
- **Stable Storage**: Each Pod gets persistent storage that survives Pod restarts
- **Ordered Deployment**: Pods are created and deleted in a predictable order
- **Ordered Scaling**: Pods are scaled up/down in order

**Use Cases:**
- Databases (MySQL, PostgreSQL, MongoDB)
- Message queues (RabbitMQ, Apache Kafka)
- Distributed systems requiring stable identities
- Applications with persistent data requirements

**Characteristics:**
- Pods have predictable names: `<statefulset-name>-<ordinal>`
- Each Pod gets its own PersistentVolumeClaim
- Pods are created sequentially (0, 1, 2, ...)
- Pods are deleted in reverse order
</details>

<details>
<summary>How do you restrict pod-to-pod communication in a cluster?</summary>
Pod-to-pod communication can be restricted using **Network Policies** in Kubernetes:

**Network Policy Features:**
- **Ingress Rules**: Control incoming traffic to Pods
- **Egress Rules**: Control outgoing traffic from Pods
- **Label Selectors**: Target specific Pods using labels
- **Namespace Isolation**: Restrict traffic between namespaces

**Example Network Policy:**
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
  namespace: default
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
```

**Common Restrictions:**
- **Deny All**: Block all pod-to-pod communication
- **Namespace Isolation**: Prevent cross-namespace communication
- **Service-Specific**: Allow communication only to specific services
- **Port-Based**: Restrict communication to specific ports

**Requirements:**
- CNI plugin that supports Network Policies (Calico, Weave Net, etc.)
- Network Policy controller must be enabled
</details>

<details>
<summary>How can I rollback a deployment in Kubernetes?</summary>
Kubernetes provides several ways to rollback deployments:

**Using kubectl:**
```bash
# View deployment history
kubectl rollout history deployment/nginx-deployment

# Rollback to previous version
kubectl rollout undo deployment/nginx-deployment

# Rollback to specific revision
kubectl rollout undo deployment/nginx-deployment --to-revision=2
```

**Rollback Process:**
1. **Check History**: View all deployment revisions
2. **Identify Target**: Choose which revision to rollback to
3. **Execute Rollback**: Use `kubectl rollout undo`
4. **Monitor Status**: Watch the rollback progress
5. **Verify**: Ensure the rollback was successful

**Rollback Features:**
- **Zero Downtime**: Rolling rollback maintains service availability
- **Automatic**: Kubernetes handles the rollback process
- **Reversible**: Can rollback the rollback if needed
- **Status Tracking**: Monitor rollback progress in real-time
</details>

<details>
<summary>What are namespaces in Kubernetes?</summary>
**Namespaces** in Kubernetes provide a way to divide cluster resources between multiple users, teams, or projects. They act as virtual clusters within a physical cluster.

**Key Features:**
- **Resource Isolation**: Separate resources between different teams/projects
- **Access Control**: Apply RBAC policies per namespace
- **Resource Quotas**: Limit resource usage per namespace
- **Network Policies**: Apply network isolation per namespace
- **DNS Resolution**: Services are accessible within the same namespace

**Default Namespaces:**
- **default**: Default namespace for resources
- **kube-system**: System components (kube-proxy, DNS, etc.)
- **kube-public**: Publicly accessible resources
- **kube-node-lease**: Node heartbeat data

**Example Usage:**
```bash
# Create a namespace
kubectl create namespace production

# Deploy to specific namespace
kubectl apply -f app.yaml -n production

# List resources in namespace
kubectl get pods -n production
```
</details>

<details>
<summary>What is the role of the kube-apiserver?</summary>
The **kube-apiserver** is the front-end for the Kubernetes control plane and serves as the central management point for the entire cluster.

**Key Responsibilities:**
- **API Gateway**: Handles all API requests from clients (kubectl, UI, etc.)
- **Authentication**: Verifies user identity and permissions
- **Authorization**: Enforces RBAC policies and access controls
- **Admission Control**: Validates and mutates requests before processing
- **State Management**: Reads from and writes to etcd
- **Communication Hub**: Coordinates between all cluster components

**Key Features:**
- **RESTful API**: Provides a REST API for cluster operations
- **Versioning**: Supports multiple API versions simultaneously
- **Validation**: Ensures resource specifications are valid
- **Rate Limiting**: Prevents API abuse and overload
- **Audit Logging**: Records all API requests for security

**Architecture:**
- **Stateless**: Can be scaled horizontally
- **High Availability**: Multiple instances for redundancy
- **Load Balancer**: Distributes requests across API server instances
</details>

<details>
<summary>What is an Ingress controller in Kubernetes?</summary>
An **Ingress Controller** is a component that manages external access to services within a Kubernetes cluster, typically HTTP/HTTPS traffic.

**Key Features:**
- **External Access**: Exposes services to external traffic
- **Load Balancing**: Distributes traffic across multiple service instances
- **SSL Termination**: Handles HTTPS certificates and encryption
- **Path-based Routing**: Routes traffic based on URL paths
- **Host-based Routing**: Routes traffic based on hostnames
- **Rate Limiting**: Controls request rates and bandwidth

**Popular Ingress Controllers:**
- **NGINX Ingress**: Most popular, feature-rich
- **Traefik**: Cloud-native, automatic service discovery
- **HAProxy**: High-performance load balancer
- **Istio Gateway**: Service mesh integration
- **AWS Load Balancer Controller**: AWS-specific integration

**Example Ingress:**
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: example-ingress
spec:
  rules:
  - host: example.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 80
```
</details>

<details>
<summary>What is the role of etcd in Kubernetes?</summary>
**etcd** is a distributed, consistent key-value store that serves as the single source of truth for Kubernetes cluster state and configuration.

**Key Responsibilities:**
- **Cluster State Storage**: Stores all cluster configuration and state
- **Configuration Management**: Holds cluster configuration, secrets, and configmaps
- **Service Discovery**: Maintains service registry and endpoints
- **Leader Election**: Facilitates leader election for control plane components
- **Backup and Recovery**: Provides data persistence and recovery capabilities

**Key Features:**
- **Consistency**: Ensures data consistency across all nodes
- **High Availability**: Can be clustered for redundancy
- **Watch API**: Allows components to watch for changes
- **Transaction Support**: ACID transactions for data integrity
- **Snapshot/Restore**: Backup and restore capabilities

**Architecture:**
- **Distributed**: Runs on multiple nodes for high availability
- **Raft Consensus**: Uses Raft algorithm for consensus
- **Client-Server**: Components communicate with etcd via API
- **Persistent Storage**: Data survives cluster restarts
</details>

<details>
<summary>Explain what are Taints and Tolerations in Kubernetes?</summary>
**Taints and Tolerations** are Kubernetes mechanisms that allow you to control which Pods can be scheduled on which nodes.

**Taints:**
- Applied to **nodes** to repel Pods
- Prevent Pods from being scheduled on specific nodes
- Three effects: `NoSchedule`, `PreferNoSchedule`, `NoExecute`

**Tolerations:**
- Applied to **Pods** to allow them to be scheduled on tainted nodes
- Must match the taint's key, value, and effect
- Allow Pods to "tolerate" node taints

**Example Taint:**
```bash
# Add taint to node
kubectl taint nodes node1 key1=value1:NoSchedule
```

**Example Toleration:**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx
  tolerations:
  - key: "key1"
    operator: "Equal"
    value: "value1"
    effect: "NoSchedule"
```

**Use Cases:**
- **Dedicated Nodes**: Reserve nodes for specific workloads
- **Hardware Requirements**: Schedule Pods on nodes with specific hardware
- **Maintenance**: Evict Pods during node maintenance
- **Cost Optimization**: Use different node types for different workloads
</details>

## Advanced Topics

- Take me through a full cycle of an app deployment from code to an app running on a pod/deployment. 
- Can you mention some good practices to follow when creating containers?
- Can you explain a simple K8s cluster architecture and the components within it?
- What happens when a master node fails? 
- What happens when a worker node fails?
- What is an Ingress controller?
- How can one build a highly availabe (HA) cluster in K8s?
- What is the role of ETCD in K8s?
- Explain what are Taints and Tolerations in K8s?
