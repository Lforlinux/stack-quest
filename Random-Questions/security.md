# Cyber Security & Info Security

## Table of Contents

- [Basic Concepts](#basic-concepts)
- [Encryption and Authentication](#encryption-and-authentication)
- [OWASP Top 10, Pentesting and/or Web Applications](#owasp-top-10-pentesting-andor-web-applications)
- [Compliance](#compliance)

---

## Basic Concepts

<details>
<summary>What is a firewall, and how does it work?</summary>
A firewall is a network security device that monitors and controls incoming and outgoing network traffic based on predetermined security rules. It can be hardware, software, or a combination of both, and it is designed to prevent unauthorized access to a network while allowing legitimate traffic to pass through. Firewalls typically work by analyzing packets of data and either allowing or blocking them based on rules established by the network administrator.
</details>

<details>
<summary>What is a vulnerability assessment, and how is it different from a penetration test?</summary>
A vulnerability assessment is a process of identifying and assessing potential vulnerabilities in a system or network. It is typically done using automated tools or manual testing techniques to identify vulnerabilities that could be exploited by an attacker. A penetration test, on the other hand, is a simulated attack on a system or network designed to test its security controls and identify potential weaknesses. While both vulnerability assessments and penetration tests are used to identify security vulnerabilities, the main difference is that vulnerability assessments are more focused on identifying potential vulnerabilities, while penetration tests are designed to actually test the effectiveness of security controls in place.
</details>

<details>
<summary>What is encryption, and how is it used in cybersecurity?</summary>
Encryption is the process of converting plain text into a coded format to protect it from unauthorized access. It is used in cybersecurity to protect sensitive information like passwords, credit card numbers, and other confidential data. Encryption works by using mathematical algorithms to convert the original data into a ciphertext that can only be read by someone who has the key to decrypt it back into plain text.
</details>

<details>
<summary>What is a Denial of Service (DoS) attack, and how does it work?</summary>
A Denial of Service (DoS) attack is an attack on a computer system or network that disrupts its normal functioning by overwhelming it with traffic or requests. The attacker typically sends a large number of requests or packets to the target system or network, making it difficult or impossible for legitimate traffic to get through. This can cause the system or network to crash or become unavailable to users.
</details>

<details>
<summary>What is phishing, and how can you identify and prevent it?</summary>
Phishing is a type of cyber attack where an attacker tries to trick a user into revealing sensitive information like passwords, credit card numbers, or other personal data. This is typically done by sending an email that appears to be from a legitimate source, such as a bank or other trusted organization, and asking the user to click on a link or provide their login credentials. To identify and prevent phishing attacks, users should be cautious when opening emails or clicking on links from unknown sources. They should also look for signs of a phishing email, such as poor grammar, misspellings, or requests for personal information.
</details>

<details>
<summary>What is a DDoS attack and how does it work?</summary>
A DDoS (Distributed Denial of Service) attack is a type of cyber attack that involves flooding a target system or network with traffic from multiple sources, in order to overload it and make it unavailable to legitimate users. DDoS attacks can be carried out using a variety of techniques, including botnets, amplification attacks, and SYN floods.
</details>

<details>
<summary>What is the CIA triad and why is it important in cyber security?</summary>
The CIA triad stands for Confidentiality, Integrity, and Availability. It is an essential concept in cybersecurity that refers to the three key objectives of securing sensitive information: maintaining its confidentiality, ensuring its integrity, and guaranteeing its availability to authorized users.
</details>

<details>
<summary>What is the difference between a virus and a worm?</summary>
A virus is a malicious software that replicates itself and spreads to other computers through infected files, while a worm is a self-replicating malicious software that spreads through computer networks and exploits security vulnerabilities in the system.
</details>

<details>
<summary>What is multi-factor authentication and why is it important?</summary>
Multi-factor authentication (MFA) is a security mechanism that requires users to provide two or more forms of authentication before they are granted access to a system or application. MFA helps to prevent unauthorized access by making it more difficult for attackers to gain access, even if they have stolen a user's password or other authentication credentials.
</details>

<details>
<summary>What is social engineering, and how can it be prevented?</summary>
Social engineering is a technique used by cybercriminals to manipulate people into divulging sensitive information or performing an action that can compromise their security. It can be prevented by educating employees about the risks of social engineering and implementing security policies and procedures that minimize the risk of social engineering attacks.
</details>

<details>
<summary>What is the difference between symmetric and asymmetric encryption?</summary>
Symmetric encryption uses the same key for both encryption and decryption, while asymmetric encryption uses different keys for encryption and decryption.
</details>

<details>
<summary>What is an intrusion detection system (IDS), and how does it work?</summary>
An intrusion detection system is a network security technology that monitors network traffic for signs of malicious activity or policy violations. It works by analyzing network traffic in real-time and comparing it against a set of predetermined rules or policies to detect potential security threats.
</details>

<details>
<summary>What is a security information and event management (SIEM) system, and how does it work?</summary>
A security information and event management system is a technology that provides real-time analysis of security alerts generated by network hardware and applications. It works by collecting and correlating security events from multiple sources to identify potential security threats.
</details>

<details>
<summary>What is a honeypot and how is it used in cybersecurity?</summary>
A honeypot is a decoy system designed to attract attackers and gather information about their methods and motivations. It can be used to detect new types of attacks, collect threat intelligence, and analyze attacker behavior.
</details>

<details>
<summary>What is a man-in-the-middle attack and how can it be prevented?</summary>
A man-in-the-middle (MITM) attack is a type of cyber attack where an attacker intercepts communication between two parties, often to steal sensitive information. To prevent MITM attacks, users should avoid using public Wi-Fi networks, use encrypted communications channels, and verify the identity of the party they are communicating with.
</details>

<details>
<summary>What is the difference between IDS and IPS?</summary>
IDS is Intrusion Detection System and it only detects intrusions and the administrator has to take care of preventing the intrusion. Whereas, in IPS i.e., Intrusion Prevention System, the system detects the intrusion and also takes actions to prevent the intrusion.
</details>

<details>
<summary>How is Encryption different from Hashing?</summary>
Both Encryption and Hashing are used to convert readable data into an unreadable format. The difference is that the encrypted data can be converted back to original data by the process of decryption but the hashed data cannot be converted back to original data.
</details>

<details>
<summary>What is a three-way handshake?</summary>
A three-way handshake is a method used in a TCP/IP network to create a connection between a host and a client. It's called a three-way handshake because it is a three-step method in which the client and server exchanges packets. The three steps are as follows: The client sends a SYN(Synchronize) packet to the server check if the server is up or has open ports. The server sends SYN-ACK packet to the client if it has open ports. The client acknowledges this and sends an ACK(Acknowledgment) packet back to the server
</details>

<details>
<summary>CWhat are the response codes that can be received from a Web Application?</summary>
1xx – Informational responses
2xx – Success
3xx – Redirection
4xx – Client-side error
5xx – Server-side error
</details>

<details>
<summary>Explain SSL Encryption?</summary>
SSL(Secure Sockets Layer) is the industry-standard security technology creating encrypted connections between Web Server and a Browser. This is used to maintain data privacy and to protect the information in online transactions. The steps for establishing an SSL connection is as follows:
A browser tries to connect to the webserver secured with SSL. The browser sends a copy of its SSL certificate to the browse. The browser checks if the SSL certificate is trustworthy or not. If it is trustworthy, then the browser sends a message to the web server requesting to establish an encrypted connection. The web server sends an acknowledgment to start an SSL encrypted connection. SSL encrypted communication takes place between the browser and the web server
</details>

<details>
<summary>Explain Data Leakage?</summary>
Data Leakage is an intentional or unintentional transmission of data from within the organization to an external unauthorized destination. It is the disclosure of confidential information to an unauthorized entity. Data Leakage can be divided into 3 categories based on how it happens:
Accidental Breach: An entity unintentionally send data to an unauthorized person due to a fault or a blunder. Intentional Breach: The authorized entity sends data to an unauthorized entity on purpos. System Hack: Hacking techniques are used to cause data leakage. Data Leakage can be prevented by using tools, software, and strategies known as DLP(Data Leakage Prevention) Tools.
</details>

<details>
<summary>What are some of the common Cyberattacks?</summary>
Port Scanning is the technique used to identify open ports and service available on a host. Hackers use port scanning to find information that can be helpful to exploit vulnerabilities. Administrators use Port Scanning to verify the security policies of the network. Some of the common Port Scanning Techniques are:
Ping Scan
TCP Half-Open
TCP Connect
UDP
Stealth Scanning
</details>

<details>
<summary>What are salted hashes?</summary>
Salt is a random data. When a properly protected password system receives a new password, it creates a hash value of that password, a random salt value, and then the combined value is stored in its database. This helps to defend against dictionary attacks and known hash attacks.
Example: If someone uses the same password on two different systems and they are being used using the same hashing algorithm, the hash value would be same, however, if even one of the system uses salt with the hashes, the value will be different.
</details>

<details>
<summary>What is Port Scanning?</summary>
Following are some common cyber attacks that could adversely affect your system.
Malware
Phishing
Password Attacks
DDoS
Man in the Middle
Drive-By Downloads
Malvertising
Rogue Software
</details>

## Encryption and Authentication

- What is a three-way handshake?
- How do cookies work?
- How do sessions work?
- Explain how OAuth works.
- What is a public key infrastructure flow and how would I diagram it?
- Describe the difference between synchronous and asynchronous encryption.
- Describe SSL handshake.
- How does HMAC work?
- Why HMAC is designed in that way?
- What is the difference between authentication vs authorization name spaces?
- What's the difference between Diffie-Hellman and RSA?
- How does Kerberos work?
- If you're going to compress and encrypt a file, which do you do first and why?
- How do I authenticate you and know you sent the message?
- Should you encrypt all data at rest?
- What is Perfect Forward Secrecy?

## OWASP Top 10, Pentesting and/or Web Applications

- Differentiate XSS from CSRF.
- What do you do if a user brings you a pc that is acting 'weird'? You suspect malware.
- What is the difference between tcp dump and FWmonitor?
- Do you know what XXE is?
- Explain man-in-the-middle attacks.
- What is a Server Side Request Forgery attack?
- Describe what are egghunters and their use in exploit development. 
- How is pad lock icon in browser generated?
- What is Same Origin Policy and CORS?

## Compliance

- Can you explain SOC 2?
  - What are the five trust criteria?
- How is ISO27001 different?
- Can you list examples of controls these frameworks require?
- What is the difference between Governance, Risk and Compliance?  
- What does Zero Trust mean?
- What is role-based access control (RBAC) and why is it covered by compliance frameworks?
- What is the NIST framework and why is it influential?
- What is the OSI model?
