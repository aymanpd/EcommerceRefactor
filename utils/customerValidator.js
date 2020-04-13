const validator = require('validator');

const customerValidator = (customer) => {
    customerProps = Object.keys(customer);
    var errors = [];
    customerProps.forEach((prop) => {
        switch (prop) {
            case 'email':
                validator.isEmail(customer['email']) || errors.push('Unvalid Email');
                break;
            case 'firstName':
            case 'lastName':
            case 'password': {
                !validator.isEmpty(customer[prop]) || errors.push(`${prop} can't be empty `);
            }
        }
    })
    return errors;
};

module.exports = customerValidator;

