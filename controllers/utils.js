const uuid = require('uuid');
const Jimp = require("jimp");

const createImageId = (buffer) => {
    return { imageId: uuid.v4(), buffer }
}

const base64ToJimpInstance = (base64) => {
    const imageBuffer = new Buffer.from(base64.replace("data:image/jpeg;base64,", ""), 'base64');
    return Jimp.read(imageBuffer)
}

const uploadImagesToDisk = (images, folder) => {
    return Promise.all(
        images.map(({ buffer, imageId }) => (base64ToJimpInstance(buffer).then((instance) => ({ instance, imageId }))))
    ).then((jimpInstances) => {
        jimpInstances.forEach(({ instance, imageId }) => instance.writeAsync(`images/${folder}/${imageId}.jpeg`))
    })
}

module.exports = {
    base64ToJimpInstance,
    createImageId,
    uploadImagesToDisk
}