const express = require('express');
const Customer = require('../models/customer');
const Admin = require('../models/admin');
const checkRequiredFields = require('../utils/checkRequiredFields');
const checkAllowedFields = require('../utils/checkAllowedFields');
const customerValidator = require('../utils/customerValidator');
const authinticate_customer = require('../middleware/authinticate_customer');
const customerRoute = new express.Router;

/*////////////////////////////////
Create A customer Endpoint
//////////////////////////////////*/

customerRoute.post('/create', async (req, res) => {
    try {
        const customerData = req.body;

        const requiredFields = ['email', 'firstName', 'lastName', 'username', 'password'];
        const missingFields = checkRequiredFields(customerData, requiredFields);
        if (missingFields.length !== 0) {
            res.status(400).send(missingFields);
            return;
        }

        const validCustomer = customerValidator(customerData);
        if (validCustomer.length !== 0) {
            res.status(400).send(validCustomer);
            return;
        };

        const customer = await new Customer(customerData).save();
        res.status(201).send(customer);
    } catch (e) {
        console.log(e); // duplicate email entry 
        res.status(500).send();
    }

});

/*////////////////////////////////
Login An Admin Endpoint
//////////////////////////////////*/

customerRoute.post('/admin', async (req, res) => {
    try {
        const adminCredentials = req.body;

        const missingFields = checkRequiredFields(adminCredentials, ['email', 'password']);
        if (missingFields.length !== 0) {
            res.status(400).send(missingFields);
            return;
        }

        const adminToken = await Admin.login(adminCredentials);
        if (!adminToken) {
            res.status(401).send('Wrong email or password');
            return;
        }

        res.status(200).send(adminToken);
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }

});



/*////////////////////////////////
Login A customer Endpoint
//////////////////////////////////*/

customerRoute.post('/login', async (req, res) => {
    try {
        const customerCreadentials = req.body;

        const missingFields = checkRequiredFields(customerCreadentials, ['email', 'password']);
        if (missingFields.length !== 0) {
            res.status(400).send(missingFields);
            return;
        }

        const customerWithToken = await Customer.login(customerCreadentials);
        if (!customerWithToken) {
            res.status(401).send('Wrong email or password');
            return;
        }

        res.status(200).send(customerWithToken);
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }

});



/*////////////////////////////////
Retrive A customer Endpoint With Token
//////////////////////////////////*/

customerRoute.get('/', authinticate_customer, (req, res) => {
    res.send(req.customer);
})
/*////////////////////////////////
Update A customer Endpoint
//////////////////////////////////*/

customerRoute.patch('/:id/update', async (req, res) => {
    try {
        const customerData = req.body;

        const allowedFields = ['firstName', 'lastName', 'username', 'password'];
        const verifyFields = checkAllowedFields(customerData, allowedFields);
        if (!verifyFields) {
            res.status(401).send('Wrong properties');
            return;
        }

        const validCustomer = customerValidator(customerData);
        if (validCustomer.length !== 0) {
            res.status(400).send(validCustomer);
            return;
        };

        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body);
        if (!customer) {
            res.status(404).send('Customer Was nowhere to be found');
            return;
        }

        res.status(200).send(`customer with id ${customer.id} updated successfully`);
    } catch (e) {
        console.log(e); // duplicate email entry 
        res.status(500).send();
    }

});


/*/////////////////////////
Delete A customer Endpoint
/////////////////////////*/

customerRoute.delete('/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            res.status(404).send('customer wasn\'t found');
            return;
        }
        await customer.delete();
        res.status(200).send('customer Deleted');
    } catch (e) {
        console.log(e);
        res.status('500').send();
    }

})

/*////////////////////////////////
Retrive A customer With Id Endpoint
//////////////////////////////////*/

customerRoute.get('/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            res.status(404).send('customer wasn\'t found');
            return;
        }

        res.status(200).send(customer);
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
});

module.exports = customerRoute;