

# H3M4 Ecosystem: Master Project Documentation & Step-by-Step System Guide

**Project Name:** H3M4 (Hyper-Local Cyber Intelligence & Evidence Ecosystem)
**Core Concept:** A decentralized platform unifying **Law Enforcement**, **Financial Enterprises**, and **Ethical Researchers** to combat cybercrime.

---

## 1. Project High-Level Overview

H3M4 solves the "Silo Problem" in cyber security.
*   **Police** (Enforcers) lack real-time data.
*   **Enterprises** (Defenders) lack a safe way to report breaches without PR disasters.
*   **Researchers** (Finders) lack a reputation-based system to report vulnerabilities.

**The Solution:** A shared, role-based ecosystem where:
1.  **Researchers** find threats -> Submit to H3M4.
2.  **Enterprises** see these threats -> Patch their systems.
3.  **Police** see these threats -> Correlate them with active criminal cases.

---

## 2. Detailed Step-by-Step User Journey

### **Step 1: The Entry Point (Landing Page)**
*   **Location:** `client/src/pages/landing.tsx`
*   **User Action:** A user visits the website.
*   **Component Breakdown:**
    *   **Hero Section:** Welcomes the user with a cinematic "Initialize Protocol" button.
    *   **Live Intel Feed:** A scrolling ticker (marquee) showing simulate live threat data (e.g., "Ransomware detected in Sector 7").
    *   **Business Model Grid:** Three cards explaining the value for Police, Banks, and Hackers.
    *   **Trust & Ethics Module:** Required "Code of Conduct" agreement before proceeding.

### **Step 2: Authentication (The Gatekeeper)**
*   **Location:** `server/auth.ts`
*   **User Action:** User clicks "Initialize Protocol" and logs in.
*   **Logic:**
    *   The system checks the **Role** of the user in the database.
    *   **Police User** -> Redirects to `/police/dashboard`.
    *   **Enterprise User** -> Redirects to `/enterprise/dashboard`.
    *   **Researcher User** -> Redirects to `/researcher/dashboard`.
    *   **Security:** Uses `Passport.js` sessions to ensure no cross-access (e.g., a Hacker cannot access Police files).

---

## 3. Component-by-Component Deep Dive

### **A. The Police Command Center (Enforcer Node)**
*   **Location:** `client/src/pages/police/dashboard.tsx`
*   **Purpose:** Investigation & Evidence Gathering.
*   **Key Components:**
    1.  **Quick Actions Panel**:
        *   **"Breach Bot Details" Card**: 
            *   *Function:* Opens a search dialog.
            *   *Logic:* Takes a phone number -> Simulates a query to Telegram/Dark Web dumps -> Returns PII (Name, Address, Aadhar).
            *   *Use Case:* Identifying a suspect from a burner phone number.
        *   **"IOC Lookup" Card**:
            *   *Function:* Checks if an IP or File Hash is known to be malicious.
            *   *Logic:* Queries the central H3M4 threat database.
        *   **"Evidence Vault" Card**:
            *   *Function:* Accesses the immutable ledger of past case files.
    2.  **Active Investigations Table**:
        *   Lists all open FIRs (First Information Reports).
        *   Columns: Case ID, Status (Open/Closed), Severity (High/Critical).
    3.  **Visual Threat Graph**:
        *   A node-link diagram showing connections between Suspects, Malware Types, and Victims.

### **B. The Enterprise Portal (Defender Node)**
*   **Location:** `client/src/pages/enterprise/dashboard.tsx`
*   **Purpose:** Defense & Risk Management.
*   **Key Components:**
    1.  **Threat Map**: A geographic or meaningful visualization of where attacks are happening.
    2.  **"Sovereign Report" Button**:
        *   *Function:* Allows a bank CISO to anonymously report "We are under attack."
        *   *Logic:* Uses Zero-Knowledge Proofs (conceptually) to alert the network without revealing the bank's identity.
    3.  **Vulnerability Feed**: A personalized list of bugs relevant to the bank's specific software stack.

### **C. The Researcher Hub (Finder Node)**
*   **Location:** `client/src/pages/researcher/dashboard.tsx`
*   **Purpose:** Reporting & Reputation Building.
*   **Key Components:**
    1.  **Submission Form**: A structured input for reporting a new vulnerability (CVE).
    2.  **Reputation Wallet**:
        *   *Function:* Shows "Intel Credits" earned.
        *   *Logic:* Credits are awarded based on the *quality* and *impact* of the submission, not just quantity.

---

## 4. Backend & Core Logic Explanation

### **4.1 The "Breach Bot" Simulation Engine**
*   **Concept**: Simulates access to "Leak Databases" (often found on Telegram).
*   **Implementation**:
    *   It accepts a query (Telephone Number).
    *   It returns a JSON object with:
        *   `telephones`: Linked numbers.
        *   `addresses`: Physical locations.
        *   `documentNumber`: Masked ID (e.g., Aadhar).
        *   `fatherName`: Family linkage.
    *   **Why?**: This functionality mimics real-world OSINT (Open Source Intelligence) tools used by investigators.

### **4.2 The Automated Investigation Bridge**
*   **Concept**: To automatically link crimes to known threats.
*   **Logic**:
    *   If a Researcher submits a report about "Malware X".
    *   And a Police Officer opens a case involving "Malware X".
    *   The system automatically notifies the officer: *"Intelligence Found: Researcher Jane Doe has already analyzed this malware."*

### **4.3 Immutable Logging (Audit Trail)**
*   **Concept**: To prevent abuse.
*   **Logic**:
    *   Every time a Police Officer searches for a person, that search is logged.
    *   These logs cannot be deleted.
    *   This ensures accountability and prevents authorized users from misusing the tool for personal reasons.

---

## 5. Technology Stack Summary (For Viva/Presentation)
*   **Frontend**: React.js, TypeScript, Tailwind CSS (Glassmorphism UI).
*   **Backend**: Node.js, Express.
*   **Database**: PostgreSQL (with Drizzle ORM).
*   **State Management**: React Query (TanStack Query).
*   **Visualization**: Framer Motion, Recharts.
