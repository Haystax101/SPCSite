const fs = require('fs');

const cssHtml = fs.readFileSync('site.html', 'utf8')
  .replace(/transition-opacity duration-300 /g, '')
  .replace(/transition-opacity duration-300/g, '')
  .replace(/transition-transform /g, '')
  .replace(/transition-opacity /g, '')
  .replace(/transition: opacity 0\.3s ease-out;/g, '');

fs.writeFileSync('site.html', cssHtml);
