import path from "path";
import os from "os";
import fs from "fs";

const credentialsFile = path.join(process.cwd(), 'cred.json');

export async function getCredentials() {
    try {
        const data = fs.readFileSync(credentialsFile);
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading credentials file:", error);
        return null;
    }
}

export async function setCredentials(username, password) {
    try {
        const data = JSON.stringify({ username, password });
        fs.writeFileSync(credentialsFile, data);
    } catch (error) {
        console.error("Error writing credentials file:", error);
    }
}
