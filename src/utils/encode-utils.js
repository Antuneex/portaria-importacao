const character = require('../enums/character-enums');

module.exports = class EncodeUtils {
  static fromAllChar(string) {
    let encode = '';
    for (const char of string) {
      const find = character.find((item) => item.character === char);
      if (find) {
        encode += find.encode;
      } else {
        encode += char;
      }
    }
    return encode;
  }
};
