# Docker 🐳

## Table of Contents

- [Basic Concepts](#basic-concepts)
- [Common Questions](#common-questions)
- [Advanced](#advanced)

---

## Basic Concepts

<details>
<summary>What is Docker and how does it work?</summary>
Docker a software platform that allows you to build, test, and deploy applications quickly using containers. Containers allow a developer to package up an application with all of the parts it needs, such as libraries and other dependencies, and ship it all out as one package.
</details>

<details>
<summary>What is a container and what are its fundamentals?</summary>
Containers are packages of software that contain all of the necessary elements to run in any environment. In this way, containers virtualize the operating system and run anywhere, from a private data center to the public cloud or even on a developer's personal machine.
</details>

<details>
<summary>What are c-groups and namespaces in Linux?</summary>
Control groups, which are called by their shorter name cgroups. Cgroups allow administrator to allocate resources — such as CPU time, system memory, network bandwidth, or combinations of these resources — among user-defined groups of tasks (processes) running on a system.

A namespace wraps a global system resource in an abstraction that makes it appear to the processes within the namespace that they have their own isolated instance of the global resource.  Changes to the global resource are visible to other processes that are members of the namespace, but are invisible to other processes. One use of namespaces is to implement containers.
</details>

## Common Questions

- What is Docker and how does it work?
- When do I use Docker Compose vs Docker Swarm and K8s?
- What is a Dockerfile used for?
- Can you explain the basic components of a Dockerfile?
    - What is a FROM in a Dockerfile used for?
    - What is a COPY in a Dockerfile used for?
    - What is a ADD in a Dockerfile used for?
    - What is a CMD & ENTRTPOINT in a Dockerfile used for?
- How is a container different from a virtual machine?
- How can I run a container?
- How can I stop and remove a container?
- How can I attach a shell to a terminal of a running container?
- What is a dangling image?
- What is Docker compose and when is it used?

## Advanced

- What is the difference between COPY and ADD commands in a Dockerfile?
- What is the difference between CMD and RUN commands in a Dockerfile?
- What are some best practices to follow when running containers in production?
- Name some limitations of containers vs VMs
- Is it good practice to run stateful applications in containers?
- Is it possible to generate a Dockerfile from an image
  - `$ docker history --no-trunc <IMAGE_ID>`
- How does virtualisation work at a lower level?
- What is an orphant volume? And how can you remove it?
- When you limit the memory for a container, does it reserve that memory for the container?
- What is the difference between Docker RUN, CMD and ENTRYPOINT?
- What is the difference between "expose" and "publish" in Docker?
- How do containers work at a lower level?
