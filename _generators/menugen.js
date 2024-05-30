// ex
// {
//     "g": "Напитки",
//     "Vegan": "-",
//     "name": "Штатный кофе",
//     "d": "",
//     "ЦенаСПб": "",
//     "": "",
//     "2 Cов. и РК": "",
//     "В.О. и МР": "",
//     "ЦЕНЫ нальчик": ""
//   },

const fs = require('fs');
const path = require('path');

const table = require('./table.json');

let res = [];

let shouldCreateNewItem = true
table.forEach((row) => {
    if (!row.name) {
        shouldCreateNewItem = true;
        return
    }

    const lastGroup = res[res.length - 1];
    const sameGroup = lastGroup && lastGroup.name === row.g;

    let group = null

    if (sameGroup) {
        group = lastGroup;
    } else {
        group = {
            name: row.g,
            items: []
        }
        res.push(group);
    }

    let item = null;

    if (shouldCreateNewItem) {
        item = clear({
            name: row.name,
            priceSPb: row['ЦенаСПб'],
            priceN: row['ЦЕНЫ нальчик'],
            vegan: row.Vegan.includes('v'),
            noSPb: String(row['ЦенаСПб']).includes('no'),
            noSov: String(row['2 Cов. и РК']).includes('no'),
            noVO: String(row['В.О. и МР']).includes('no'),
            noN: String(row['ЦЕНЫ нальчик']).includes('no'),
            items: []
        })
        group.items.push(item);
        shouldCreateNewItem = false;
        return
    }

    const lastGroupItem = group.items[group.items.length - 1];
    lastGroupItem.items.push(clear({
        name: row.name,
        priceSPb: row['ЦенаСПб'],
        priceN: row['ЦЕНЫ нальчик'],
        vegan: row.Vegan.includes('v'),
        noSPb: String(row['ЦенаСПб']).includes('no'),
        noSov: String(row['2 Cов. и РК']).includes('no'),
        noVO: String(row['В.О. и МР']).includes('no'),
        noN: String(row['ЦЕНЫ нальчик']).includes('no'),
    }));
})

const resPath = path.join(__dirname, 'menu.json');
fs.writeFileSync(resPath, JSON.stringify(res, null, 2));

function clear(obj) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        if (value && value!=='no') {
            acc[key] = value;
        }
        return acc;
    }, {});
}