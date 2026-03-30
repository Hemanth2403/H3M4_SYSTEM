
import fetch from "node-fetch";

async function test() {
    try {
        const res = await fetch("http://localhost:5000/api/police/cases", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                firNumber: "TEST-" + Date.now(),
                caseTitle: "Test Connection",
                caseType: "fraud",
                priority: "medium",
                assignedOfficer: "officer-1",
                victimDetails: "Test Victim",
                suspectDetails: "1.1.1.1"
            })
        });
        console.log("Status:", res.status);
        const data = await res.json();
        console.log("Data:", data);
    } catch (err) {
        console.error("Error connecting:", err.message);
    }
}

test();
