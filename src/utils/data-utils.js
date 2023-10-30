const { whitelist } = require('../enums/filter-enums');

module.exports = class EncodeUtils {
  static getDiff(dataNew, dataOld, array = []) {
    for (const itemNew of dataNew) {
      const itemOld = dataOld.find((old) => old.id === itemNew.id);
      if (!itemOld) {
        array.push(itemNew);
      } else {
        EncodeUtils.getDiff(itemNew.children, itemOld.children, array);
      }
    }
    return array;
  }

  static getOnlyFiles(diff, array = []) {
    for (const item of diff) {
      if (item.children.length > 0) {
        EncodeUtils.getOnlyFiles(item.children, array);
      } else if (
        whitelist.includes(item.name.split('.').slice(-1)[0].toLowerCase())
      ) {
        array.push(item);
      }
    }
    return array;
  }
};
