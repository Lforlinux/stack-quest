# Config Management 🔧

## Table of Contents

- [Basic Concepts](#basic-concepts)
- [Advanced](#advanced)

---

## Basic Concepts

<details>
<summary>What is Ansible?</summary>

Ansible is an open-source automation platform that simplifies configuration management, application deployment, and task automation. It uses a simple YAML-based language to describe automation jobs, making it easy to understand and use. Ansible works by connecting to your nodes and pushing out small programs called "Ansible modules" to them, then executing these modules over SSH by default.

</details>

<details>
<summary>How does Ansible work?</summary>

Ansible works in a push-based model where the control machine (where Ansible is installed) connects to managed nodes via SSH and executes tasks. It uses an inventory file to define the target hosts, playbooks to define the tasks, and modules to perform specific operations. Ansible is agentless, meaning no software needs to be installed on the managed nodes.

</details>

<details>
<summary>What is Ansible Galaxy?</summary>

Ansible Galaxy is a repository for sharing Ansible roles and collections. It's a community hub where users can find, download, and share reusable Ansible content. Galaxy provides a command-line tool to install roles and collections, making it easy to leverage community-contributed automation content.

</details>

<details>
<summary>What are Ansible handlers?</summary>

Ansible handlers are special tasks that run only when notified by other tasks. They are typically used to restart services or perform cleanup operations after configuration changes. Handlers run at the end of a playbook execution, even if multiple tasks notify the same handler, it will only run once.

</details>

<details>
<summary>What is Ansible Vault?</summary>

Ansible Vault is a feature that allows you to encrypt sensitive data such as passwords, API keys, and other secrets used in Ansible playbooks. It provides a way to store encrypted variables and files that can be decrypted at runtime using a password or key file.

</details>

<details>
<summary>What are Ansible collections?</summary>

Ansible collections are a distribution format for Ansible content that can include playbooks, roles, modules, and plugins. They provide a way to package and distribute related automation content as a single unit, making it easier to manage dependencies and versioning.

</details>

<details>
<summary>How do you get a list of Ansible predefined variables?</summary>

You can get a list of Ansible predefined variables using the `ansible-doc` command with the `-l` flag, or by using the `debug` module in a playbook to display all available variables. You can also use `ansible <host> -m setup` to see all facts for a specific host.

</details>

<details>
<summary>How is Ansible playbook different from ad-hoc commands?</summary>

Ansible playbooks are YAML files that define a set of tasks to be executed on managed hosts, providing a way to create repeatable, complex automation workflows. Ad-hoc commands are one-time commands executed directly from the command line for quick tasks. Playbooks are better for complex, multi-step automation, while ad-hoc commands are useful for quick, simple tasks.

</details>

<details>
<summary>What is the recommended way for securing secret information used within Ansible playbooks?</summary>

The recommended way to secure secret information in Ansible playbooks is to use Ansible Vault. This allows you to encrypt sensitive data such as passwords, API keys, and other secrets. You can encrypt individual variables, entire files, or use external secret management systems like HashiCorp Vault.

</details>

<details>
<summary>What templating language is directly supported within Ansible for creating dynamic playbooks?</summary>

Ansible uses Jinja2 as its templating language. Jinja2 allows you to create dynamic content in playbooks, templates, and variable files using variables, loops, conditionals, and filters. It's integrated throughout Ansible and is used in templates, variable substitution, and conditional statements.

</details>

<details>
<summary>What protocol does Ansible use for communicating with client systems?</summary>

Ansible primarily uses SSH (Secure Shell) protocol for communicating with client systems. It connects to managed nodes over SSH and executes tasks remotely. For Windows systems, Ansible can also use WinRM (Windows Remote Management) protocol.

</details>

<details>
<summary>What is an inventory file?</summary>

An inventory file is a configuration file that defines the hosts and groups of hosts that Ansible will manage. It can be in INI or YAML format and contains information about target systems, including hostnames, IP addresses, connection parameters, and group memberships.

</details>

## Advanced

<details>
<summary>Can you name some Ansible best practices?</summary>

Some Ansible best practices include:
- Use version control for playbooks and roles
- Organize playbooks in a logical directory structure
- Use roles to create reusable automation components
- Use variables and templates for flexibility
- Implement proper error handling and idempotency
- Use Ansible Vault for sensitive data
- Test playbooks before deploying to production
- Use tags to control which tasks run
- Keep playbooks simple and readable
- Use handlers for service restarts and cleanup

</details>

<details>
<summary>How do you handle errors in Ansible?</summary>

Ansible provides several ways to handle errors:
- Use `ignore_errors: yes` to continue execution even if a task fails
- Use `failed_when` to define custom failure conditions
- Use `changed_when` to control when a task is marked as changed
- Use `rescue` blocks in blocks to handle errors
- Use `any_errors_fatal: yes` to stop execution on any error
- Use `max_fail_percentage` to control failure thresholds

</details>

<details>
<summary>How do you test your Ansible roles and tasks?</summary>

You can test Ansible roles and tasks using several methods:
- Use `ansible-playbook --check` for dry-run testing
- Use `ansible-playbook --diff` to see what changes would be made
- Use Molecule for comprehensive testing of roles
- Use Testinfra for infrastructure testing
- Use Vagrant for testing in virtual environments
- Use Docker containers for lightweight testing
- Write unit tests for custom modules and plugins

</details>

<details>
<summary>What is Molecule and how does it work?</summary>

Molecule is a testing framework for Ansible roles that provides a way to test roles across multiple platforms and scenarios. It creates temporary environments, runs playbooks, and validates the results. Molecule supports multiple drivers (Docker, Vagrant, etc.) and provides a comprehensive testing workflow including syntax checking, linting, and integration testing.

</details>
