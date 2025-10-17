# CI/CD 🔄

## Table of Contents

- [Basic Concepts](#basic-concepts)

---

## Basic Concepts

<details>
<summary>What is meant by Continuous Integration?</summary>

Continuous Integration (CI) is the practice of automatically integrating code changes from multiple developers into a shared repository, followed by automated builds and tests. It helps catch integration issues early and ensures code quality.

</details>

<details>
<summary>Explain blue-green deployment</summary>

Blue-green deployment is a deployment strategy where you maintain two identical production environments (blue and green). One environment serves live traffic while the other is used for testing new releases. Once tested, traffic is switched to the new environment.

</details>

<details>
<summary>What is a CI/CD pipeline?</summary>

A CI/CD pipeline is an automated sequence of steps that code goes through from development to production, including building, testing, and deploying applications. It ensures consistent, reliable software delivery.

</details>

<details>
<summary>What is a canary deployment?</summary>

Canary deployment is a deployment strategy where new software is gradually rolled out to a small subset of users before being released to the entire user base. It allows for testing in production with minimal risk.

</details>

<details>
<summary>What is a rolling deployment?</summary>

Rolling deployment is a deployment strategy where new versions are gradually rolled out by replacing instances one by one. It ensures zero downtime and allows for quick rollback if issues are detected.

</details>
