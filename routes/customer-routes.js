const { getAllCustomers, getAddCustomerView, addCustomer, getUpdateCustomerView, updateCustomer, getDeleteCustomerView, deleteCustomer, searchCustomer } = require('../controllers/customerController')
const express = require('express')


const router = express.Router();
// router.get('/layout', getAllCustomers); 
router.get('/addCustomer', getAddCustomerView)
router.post('/addCustomer', addCustomer)
router.get('/updateCustomer/:id', getUpdateCustomerView)
router.post('/updateCustomer/:id', updateCustomer)
router.get('/deleteCustomer/:id', getDeleteCustomerView)
router.post('/deleteCustomer/:id', deleteCustomer)
router.post('/search/:id', searchCustomer)
router.get('/search', searchCustomer)



module.exports = {
    routes: router
}