const { Customer } = require('../models/customer')


const getAllCustomers = async (req, res, next) => {
    const list = await Customer.find().exec()
    res.render('customerlist', {
    customers: list
})


}

const getAddCustomerView = (req, res, next) => { 
    res.render('addCustomer')

}

const addCustomer = async (req, res, next) => {
    
    const data = req.body
    let customer = await new Customer({
        name: data.name,
        origin: data.origin,
        destination: data.destination,
        Date:data.date,
        
    
        current: data.current,
       
        
        description: data.description,
        
        
    })
    customer = await customer.save();
    res.redirect('/layout')

}


const getUpdateCustomerView = async (req, res, next) => {
    try {
      const id = req.params.id;
      const onecustomer = await Customer.findById(id).exec();
      res.render('updateCustomer', {
        customer: onecustomer
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  };
  

const updateCustomer = async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;

  let customer = await Customer.findByIdAndUpdate(id, {
    name: data.name,
        origin: data.origin,
        destination: data.destination,
        Date:data.date,
        
    
        current: data.current,
       
        
        description: data.description,

    
  }, { new: true });
  if (!customer) return res.status(404).send('Customer with given id not found')
  
  res.redirect('/layout')
}


const getDeleteCustomerView = async (req, res, next) => {
  try {
    const id = req.params.id
    const onecustomer = await Customer.findById(id).exec();
    res.render('deleteCustomer', {
      customer: onecustomer
    });

    
  } catch (error) {
    res.status(400).send(error.message);

  }
}


const deleteCustomer = async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;

  let customer = await Customer.findByIdAndRemove(id, {


    name: data.name,
    origin: data.origin,
    destination: data.destination,
    Date: data.date,
    

    current: data.current,
   
    
    description: data.description,

  }, { new: true });
  if (!customer) return res.status(404).send('Customer with given id not found')
  
  res.redirect('/layout')
}



const searchCustomer = async (req, res, next) => {
  try {
    const searchTerm = req.query.searchTerm;
    if (!searchTerm) {
      return res.render("index");
    }
    const customer = await Customer.findById(searchTerm);
    if (!customer) {
      return res.status(404).send("User not found");
    }
    res.render("search", {
      customer: customer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("ID does not exist. enter a valid id");

  }
};


module.exports = {
    getAllCustomers,
    getAddCustomerView,
    addCustomer,
  getUpdateCustomerView,
  updateCustomer,
  getDeleteCustomerView,
  deleteCustomer,
    searchCustomer
}