const fs = require('fs');
const path = require('path');

const scriptDir = path.dirname(__filename);

const groups = JSON.parse(fs.readFileSync(path.resolve(scriptDir, './menu.json'), 'utf8'));

const template = fs.readFileSync(path.resolve(scriptDir, 'menu.template.html'), 'utf8');

function populateTemplate(gen) {
  return template.replace(/{{menu}}/g, gen);
}

const items = groups.reduce((acc, group) => {
  return `
    ${acc}
    <div class="w-layout-grid gridstandard-menu">
        <div class="blockmenu">
          <div class="menu-list-wrapper" style="grid-area: Title;">
            <h2 class="heading-4">
            ${group.name}
            </h2>
          </div>
          <div class="menu-list-wrapper" style="grid-area: Menu;">
            ${createMenuItems(group.items)}
          </div>
        </div>
      </div>
  `

  function createMenuItems(items) {
    return items.reduce((acc, item) => {
      if (item.noSPb) return acc

      return `
        ${acc}
        <div class="menu-item">
          <h3 class="menu-item-title"
            ${!item.items.length ? 'style="border: none"' : ''}
          >
            ${item.name}
            ${item.priceSPb || ''}
            </h3>
          ${createMenuOptions(item)}
        </div>`
      }, '')
  }

  function createMenuOptions(item) {
    return item.items.reduce((acc, option) => {
      if (option.noSPb) return acc

      return `
        ${acc}
        <div class="menu-item-text">
          <div class="menuposcontainer coffee-house">
            <div class="menupos ${option.noSov ? 'hide' : ''}"></div>
            <div class="menupos ${option.noVO ? 'hide' : ''}"></div>
            <div class="menupos ${option.noSov ? 'hide' : ''}"></div>
            <div class="menupos ${option.noVO ? 'hide' : ''}"></div>
          </div>
          <div class="menuitemdescription">
            ${option.vegan ? '<div class="icons"><img src="images/icon__vegan.svg" loading="lazy" alt="" class="image"></div>' : ''}
            <h3 class="menuhtext">${option.name}</h3>
            <div class="menuprice">${option.priceSPb || item.priceSPb || ''}</div>
          </div>
        </div>
      `
    }, '')
  }
}, '')

fs.writeFileSync(path.resolve(scriptDir, '../menu.html'), populateTemplate(items));
