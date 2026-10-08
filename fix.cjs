const fs = require('fs');

const pCtx = 'src/contexts/PhaseContext.jsx';
let content = fs.readFileSync(pCtx, 'utf8');
content = content.replace(/setFeed\(await feedService\.getPhaseFeed\(team\.id, viewedPhase\)\);/g, '');
fs.writeFileSync(pCtx, content);

const plan = 'src/pages/Plan/Plan.jsx';
let planContent = fs.readFileSync(plan, 'utf8');
planContent = planContent.replace(/toast\.error/g, 'toast.push').replace(/toast\.success/g, 'toast.push');
fs.writeFileSync(plan, planContent);
