const fileType = require('file-type');




const validateImage = (base64) => {
    const type = fileType(Buffer.from(base64, 'base64'), fileType.minimumBytes);
    return type && type.mime === 'image/jpeg';
}

module.exports = validateImage;