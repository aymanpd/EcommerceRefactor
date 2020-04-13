const checkAllowedFields = (data, allowedFields) => {
    var check = [];
    Object.keys(data).forEach((data) => {
        const allowed = allowedFields.includes(data);
        if (!allowed) {
            check.push = `${data} is not a property`;
        }
    })
    return check;
}

module.exports = checkAllowedFields;