const fs = require('fs');

const path = 'd:\\Internship\\yohesa\\frontend\\src\\modules\\partner\\dashboard\\PartnerDashboardComponent.jsx';
let content = fs.readFileSync(path, 'utf8');

// The marker for Quick Access
const quickAccessMarker = '{/* ──── QUICK ACCESS SECTION ──── */}';
const referBannerStart = '{/* ──── REFER & EARN BANNER ──── */}';
const quickActionsMarker = '{/* ──── QUICK ACTIONS PANEL ──── */}';
const styleMarker = '<style>{`';

const startIndex = content.indexOf(referBannerStart);
if (startIndex === -1) {
  console.error("Could not find refer banner start");
  process.exit(1);
}
// Find the exact line of startIndex spaces before it
let actualStart = content.lastIndexOf('\n', startIndex) + 1;

const endIndex = content.indexOf(quickActionsMarker, startIndex);
if (endIndex === -1) {
  console.error("Could not find quick actions marker");
  process.exit(1);
}
let actualEnd = content.lastIndexOf('\n', endIndex) + 1;

const bannerCode = content.substring(actualStart, actualEnd);

content = content.substring(0, actualStart) + content.substring(actualEnd);

const styleIndex = content.indexOf(styleMarker);
if (styleIndex === -1) {
  console.error("Could not find style marker");
  process.exit(1);
}

let actualStyleStart = content.lastIndexOf('\n', styleIndex) + 1;

content = content.substring(0, actualStyleStart) + bannerCode + content.substring(actualStyleStart);

fs.writeFileSync(path, content, 'utf8');
console.log("Banner moved successfully.");
