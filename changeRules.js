const fs = require('fs');
let rules = fs.readFileSync('firestore.rules', 'utf8');
if (process.argv[2] === 'false') {
    rules = rules.replace(/allow write: if signedIn\(\) && request\.resource\.data\.uid == request\.auth\.uid;/g, 'allow write: if false;');
} else {
    rules = rules.replace(/allow write: if false;/g, 'allow write: if signedIn() && request.resource.data.uid == request.auth.uid;');
}
fs.writeFileSync('firestore.rules', rules);
