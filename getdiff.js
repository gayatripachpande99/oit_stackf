const { execSync } = require('child_process');
const fs = require('fs');
fs.writeFileSync('diff_clean.txt', execSync('git -C "d:\\\\Internship\\\\yohesa" show HEAD', { encoding: 'utf-8' }));
