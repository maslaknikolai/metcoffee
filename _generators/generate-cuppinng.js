const fs = require('fs');
const path = require('path');

const scriptDir = path.dirname(__filename);

const items = JSON.parse(fs.readFileSync(path.resolve(scriptDir, './cupping.json'), 'utf8'));

const template = fs.readFileSync(path.resolve(scriptDir, 'cupping.template.html'), 'utf8');

function populateTemplate(data) {
  return template.replace(/{{(.*?)}}/g, (match, key) => data[key.trim()] || '');
}

items.forEach(item => {
  const populatedTemplate = populateTemplate(item);
  const fileName = path.resolve(scriptDir, `../cupping/${item.name}.html`);
  fs.writeFileSync(fileName, populatedTemplate, 'utf8');
  console.log(`Generated ${fileName}`);
});
