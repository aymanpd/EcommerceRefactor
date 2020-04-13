const checkRequiredFields = (data, requiredfields) => {
    var errors = [];
    requiredfields.forEach((field) => {
        const exists = Object.keys(data).includes(field);
        if (!exists) {
            errors.push(`${field} is required`);
        }
    })
    return errors.join('. ');
}

module.exports = checkRequiredFields;