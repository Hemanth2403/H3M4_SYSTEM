import { log } from "./utils";
import { storage } from "./storage";

/**
 * H3M4 OSINT Engine
 * Integrates real public intelligence sources for real-time investigation enrichment.
 * Sources: 
 * - IP-API (Geolocation)
 * - AbuseIPDB (Simulated/Public feed check)
 */
export class OsintEngine {
    private readonly GEOLOCATION_API = "http://ip-api.com/json/";

    /**
     * Enrich an IP address with real-time geolocation and reputation data.
     * Uses public open-access APIs.
     */
    async enrichIp(ip: string) {
        try {
            log(`[OSINT] Enriching artifact: ${ip}`, "osint");

            // 1. Fetch Geolocation Data (With Timeout)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const geoRes = await fetch(`${this.GEOLOCATION_API}${ip}?fields=status,message,country,regionName,city,zip,lat,lon,isp,org,as`, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            const geoData = await geoRes.json();

            if (geoData.status !== "success") {
                log(`[OSINT] Failed to fetch geo data for ${ip}: ${geoData.message}`, "osint");
                return null;
            }

            // 2. Simulated Abuse Check (In a real scenario, use AbuseIPDB API Key)
            // We simulate the reputation score based on ISP/Location patterns common in cybercrime
            const isProxy = geoData.isp.toLowerCase().includes("hosting") || geoData.isp.toLowerCase().includes("vpn");
            const reputationScore = isProxy ? 85 : Math.floor(Math.random() * 20);

            return {
                ip,
                location: `${geoData.city}, ${geoData.regionName}, ${geoData.country}`,
                isp: geoData.isp,
                org: geoData.org,
                asn: geoData.as,
                riskScore: reputationScore,
                threatType: isProxy ? "VPN/Proxy Detection" : "Clean/Residential",
                lastSeen: new Date().toISOString(),
                witnessedBy: "IP-API / H3M4 Node",
                lat: geoData.lat,
                lon: geoData.lon
            };
        } catch (error: any) {
            log(`[OSINT] Enrichment error for ${ip}: ${error.message}`, "osint");
            return null;
        }
    }

    /**
     * Simulated Crypto Wallet Tracing (Blockchain Analytics)
     */
    async traceCryptoWallet(wallet: string) {
        log(`[FORENSICS] Tracing Crypto Asset: ${wallet}`, "osint");

        // Mock Blockchain Intelligence Data
        const entities = [
            { name: "Binance Hot Wallet 6", type: "Exchange", risk: 10 },
            { name: "DarkMarket Deposit", type: "Dark Web", risk: 95 },
            { name: "Wasabi Mixer Pool", type: "Mixer/Launderer", risk: 90 },
            { name: "Private Wallet (Unidentified)", type: "Individual", risk: 50 }
        ];

        // Deterministic selection based on wallet last char
        const lastChar = wallet.slice(-1).charCodeAt(0);
        const entity = entities[lastChar % entities.length];

        const traceResult = {
            type: "CRYPTO_WALLET",
            value: wallet,
            network: wallet.startsWith("bc1") || wallet.startsWith("1") || wallet.startsWith("3") ? "Bitcoin" : "Ethereum",
            identifiedEntity: entity.name,
            walletType: entity.type,
            balance: (Math.random() * 5).toFixed(4) + " BTC",
            totalVolume: (Math.random() * 100).toFixed(2) + " BTC",
            riskScore: entity.risk,
            threatType: entity.risk > 80 ? "Money Laundering / Illicit Finance" : "Exchange Wallet",
            witnessedBy: "H3M4 Blockchain Node"
        };

        // AUTO-EVIDENCE COLLECTION: If high risk, preserve snapshot immediately
        if (entity.risk > 50) {
            log(`[EVIDENCE] High-Risk Wallet Detected. Auto-preserving to ledger.`, "osint");
            // We use a safe persistent ID or mock usage since we don't have request context here often
            await storage.createEvidence({
                caseId: "case-1-fir-0234", // Auto-attach to active case for demo flow, or null if generic
                evidenceType: "BLOCKCHAIN_SNAPSHOT",
                description: `High-Risk Crypto Asset Detected: ${entity.type} (${entity.name})`,
                sourceUrl: `https://blockchain.info/address/${wallet}`,
                technicalData: JSON.stringify(traceResult),
                collectedBy: "system-automaton"
            });
        }

        return traceResult;
    }

    /**
     * Scans text for IOCs and enriches them in parallel.
     */
    async enrichCaseIocs(text: string) {
        try {
            const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g;
            const phoneRegex = /(?:\+91|0)?[6-9]\d{9}\b/g;
            const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
            // Basic Regex for BTC (legacy/segwit) and ETH
            const cryptoRegex = /\b(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}\b|\b0x[a-fA-F0-9]{40}\b/g;

            const ips = Array.from(new Set(text.match(ipRegex) || []));
            const phones = Array.from(new Set(text.match(phoneRegex) || []));
            const emails = Array.from(new Set(text.match(emailRegex) || []));
            const wallets = Array.from(new Set(text.match(cryptoRegex) || []));

            log(`[OSINT] Found ${ips.length} IPs, ${phones.length} Phones, ${emails.length} Emails, ${wallets.length} Crypto Wallets.`, "osint");

            const enrichments = await Promise.all([
                ...ips.slice(0, 3).map(ip => this.enrichIp(ip)),
                ...phones.slice(0, 2).map(p => this.enrichPhone(p)),
                ...emails.slice(0, 2).map(e => this.enrichEmail(e)),
                ...wallets.slice(0, 2).map(w => this.traceCryptoWallet(w))
            ]);

            return enrichments.filter(e => e !== null);
        } catch (error: any) {
            log(`[OSINT_ERROR] Global enrichment failure: ${error.message}`, "osint");
            return [];
        }
    }

    /**
     * Simulated Phone Number Enrichment (HLR/Operator Lookup)
     */
    async enrichPhone(phone: string) {
        log(`[OSINT] Tracing Phone: ${phone}`, "osint");
        const providers = ["Jio", "Airtel", "Vi", "BSNL"];
        const circles = ["Maharashtra", "Delhi", "Karnataka", "West Bengal", "Gujarat"];

        // Deterministic mock based on number
        const hash = phone.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

        return {
            type: "PHONE",
            value: phone,
            operator: providers[hash % providers.length],
            circle: circles[hash % circles.length],
            status: "active",
            riskScore: Math.floor(Math.random() * 40),
            threatType: "Subscriber Identity Identified",
            lastSeen: new Date().toISOString(),
            witnessedBy: "Telecom HLR Gateway"
        };
    }

    /**
     * Simulated Email Breach Check
     */
    async enrichEmail(email: string) {
        log(`[OSINT] Checking Breach: ${email}`, "osint");
        const breaches = ["Canva Leak", "LinkedIn 2016", "Adobe Data Breach", "Internal Phishing Feed"];

        const hash = email.length;
        const hasBreach = hash % 2 === 0;

        return {
            type: "EMAIL",
            value: email,
            breached: hasBreach,
            breachCount: hasBreach ? (hash % 5) + 1 : 0,
            lastBreach: hasBreach ? breaches[hash % breaches.length] : "None",
            riskScore: hasBreach ? 75 : 10,
            threatType: hasBreach ? "Compromised Credentials" : "Clean",
            witnessedBy: "H3M4 Breach Crawler"
        };
    }

    /**
     * Simulated Static Malware Analysis for APKs
     */
    async analyzeApk(filename: string) {
        log(`[FORENSICS] Analyzing APK: ${filename}`, "osint");
        const packageNames = ["com.whatsapp.clone", "org.android.security.update", "com.banking.verify.upi"];
        const permissions = ["READ_SMS", "RECEIVE_SMS", "READ_CONTACTS", "ACCESS_FINE_LOCATION", "RECORD_AUDIO"];

        const risk = Math.floor(Math.random() * 60) + 40; // High risk for demo

        return {
            type: "MALWARE_APK",
            value: filename,
            packageName: packageNames[Math.floor(Math.random() * packageNames.length)],
            maliciousPermissions: permissions.slice(0, 3),
            riskScore: risk,
            threatType: "RAT / SMS Stealer",
            signature: "0x" + Math.random().toString(16).substring(2, 10),
            witnessedBy: "H3M4 Sandbox Engine"
        };
    }

    /**
     * Simulated Bank Account / Transaction Trace
     */
    async traceBank(accountInfo: string) {
        log(`[FORENSICS] Tracing Financial Flow: ${accountInfo}`, "osint");
        const banks = ["ICICI Bank", "HDFC Bank", "State Bank of India", "Axis Bank"];

        return {
            type: "FINANCIAL",
            value: accountInfo,
            bankName: banks[Math.floor(Math.random() * banks.length)],
            kycStatus: "Partial / Fake Identity",
            muleProbability: "85%",
            riskScore: 90,
            threatType: "Money Laundering / Mule Account",
            witnessedBy: "NPCI / Banking Intelligence Node"
        };
    }
}

export const osintEngine = new OsintEngine();

