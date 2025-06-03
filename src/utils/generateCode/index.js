const slugify = require('slugify');

let lastIndex = {};

exports.generateCode = (phrase) => {
    const words = phrase.split(' ');
    let code = words.map(word => word[0].toUpperCase()).join('');
    code = code.length > 4 ? code.substring(0, 4) : code;

    if (!lastIndex[code]) {
        lastIndex[code] = 1;
    } else {
        lastIndex[code]++;
    }

    const paddedIndex = String(lastIndex[code]).padStart(2, '0');

    return `${code}_${paddedIndex}`;
};