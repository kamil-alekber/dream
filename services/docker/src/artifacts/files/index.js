const fs = require('fs');

fs.readdirSync(process.cwd()).forEach(file => {
  console.log(file);
});