# Literature Review: Cybersecurity Intelligence, Threat Sharing & Forensic Readiness

**Prepared for Mid-Semester Presentation: H3M4 Platform**

This paper summarizes five critical research studies related to threat intelligence sharing, enterprise cyber-defense, and digital forensic readiness. These papers formed the foundation for the limitations and problems addressed by the H3M4 platform.

---

### 1. Paper: "Challenges and Future Directions in Cyber Threat Intelligence Sharing"
*Authors:* T. D. Wagner, K. Mahbub, E. Palomar, & A. E. Abdallah (2019)  
*Journal:* Computers & Security

**Findings:**
- Organizations are often hesitant to share Cyber Threat Intelligence (CTI) due to privacy concerns and the lack of standardized trust models.
- Automated ingestion of CTI (like STIX/TAXII) significantly reduces the time-to-mitigate for emerging zero-day vulnerabilities.

**Limitations Identified in the Study:**
- Existing models lack a cryptographic assurance mechanism that directly links the threat reporter to an actionable, non-repudiable legal entity. This gap leads to slow attribution.
- *H3M4 Application:* Inspired H3M4’s "Vault" cryptographic ledger to enforce zero-trust sharing.

---

### 2. Paper: "Integrating Digital Forensics into Incident Response: A Proposed Methodology"
*Authors:* M. K. Rogers & K. Seigfried (2004 / continually cited in modern contexts)  
*Journal:* Journal of Digital Forensic Practice

**Findings:**
- Traditional incident response focuses heavily on "containment and recovery," actively destroying volatile digital evidence required by Law Enforcement.
- "Forensic Readiness" must be built into the system by default, hashing state changes in real-time.

**Limitations Identified in the Study:**
- Most enterprise SOCs prioritize uptime over evidence preservation. The process of translating technical logs to court-ready documents is intensely manual and prone to chain-of-custody breaks.
- *H3M4 Application:* Led to the creation of the automatic Byte-to-Record (B2R) engine, ensuring logs are hashed to ISO 27037 standards immediately.

---

### 3. Paper: "The Economics of Vulnerability Disclosure and Bug Bounties"
*Authors:* R. Böhme (2006) / M. Zhao, et al. (2015)  
*Journal:* Workshop on Economics of Information Security (WEIS)

**Findings:**
- Crowdsourced security testing (Bug Bounties) provides a higher magnitude of critical findings compared to localized penetration testing.
- Financial incentives directly correlate with faster vulnerability patching and disclosure.

**Limitations Identified in the Study:**
- The disjointed nature of bug bounty platforms insulates the wider industry from learning about the vulnerability. While one company gets patched, the wider sector remains ignorant.
- *H3M4 Application:* Motivated the "Sector Alert" mechanism in H3M4 where validated intelligence is securely translated to sector-wide firewall rules simultaneously.

---

### 4. Paper: "Blockchain for Enterprise Security: A Survey of Architectures and Applications"
*Authors:* A. Dorri, S. S. Kanhere, & R. Jurdak (2020)  
*Journal:* IEEE Communications Surveys & Tutorials

**Findings:**
- Immutable distributed ledgers offer a breakthrough for non-repudiable access control and audit trailing in zero-trust architectures.
- Smart contracts can automate the execution of threat mitigation actions securely across trust boundaries.

**Limitations Identified in the Study:**
- Performance bottlenecks and the over-exposure of sensitive threat data. Standard blockchains are too transparent for highly classified vulnerability data.
- *H3M4 Application:* Inspired H3M4's use of "Sharded Storage" and private ledger hashing, keeping the evidence verified but the exploit payload encrypted.

---

### 5. Paper: "Automated Evidence Collection for Cloud Forensics"
*Authors:* K. R. Choo, et al. (2016)  
*Journal:* IEEE Cloud Computing

**Findings:**
- Law enforcement faces insurmountable friction acquiring logs from decentralized, global cloud service providers.
- Proactive evidence collection (collecting forensic data *before* an investigation is requested) is the only scalable model.

**Limitations Identified in the Study:**
- Legal frameworks (like GDPR) clash with bulk proactive forensic collection. It is difficult to balance enterprise privacy with forensic necessity.
- *H3M4 Application:* Addressed by the "Quad-Node Handshake", ensuring only mathematically validated intelligence generates an active Law Enforcement evidence packet.
