const { execSync } = require('child_process');
const fs = require('fs');
fs.writeFileSync('log.txt', execSync('git -C "d:\\\\Internship\\\\yohesa" log -2 --stat', { encoding: 'utf-8' }));
