import { spawn } from 'child_process';
import fs from 'fs';

const child = spawn('npx', ['-y', 'cloudflared', 'tunnel', '--url', 'http://localhost:5000'], { shell: true });

child.stderr.on('data', (data) => {
    const output = data.toString();
    const match = output.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
    if (match) {
        const url = match[0];
        console.log('PUBLIC_URL:' + url);
        fs.writeFileSync('public_url.txt', url);
    }
});
