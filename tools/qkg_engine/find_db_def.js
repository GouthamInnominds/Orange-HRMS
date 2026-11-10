const fs = require('fs');
const path = require('path');
const file = path.resolve('tools/db_web_ui/adminer-core.php');
const content = fs.readFileSync(file, 'utf8');

const snippet = content.substring(362000, 362500);
console.log('Snippet around define DB:\n', snippet);
