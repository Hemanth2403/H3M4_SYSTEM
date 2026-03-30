import fs from "fs";

export function log(message: string, source = "express") {
    const formattedTime = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });

    const logLine = `${formattedTime} [${source}] ${message}`;
    console.log(logLine);
    try {
        fs.appendFileSync("debug.log", logLine + "\n");
    } catch (e) {
        // ignore
    }
}
