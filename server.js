const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const db = require('./db/server');

//handlebars middleware
app.engine('handlebars', exphbs({deaultLayout:'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.get('/', (req,res)=>{
    res.render('landing');
});

app.get('/customerLogin', (req,res)=>{
    res.render('customerLogin');
});

let doCustomerLogin = async(username, password, res) => {
    let customer;
    if(username!=null && password!=null){
        try{
            customer = await db.customerLogin(username,password);
            // console.log("\nCustomer is:");
            // console.log(customer);
            if(customer.length == 1){
                return customer[0];
            }
        } catch(e){
            console.log(e);
        }
    }   
    res.render('customerLoginFail');
}

app.get('/customerLogin/customerHome', async(req, res, next) => {
    let username = req.query.user;
    let password = req.query.pass;
    let customer = await doCustomerLogin(username, password, res);
    if (!customer)
        return;
    res.render('customerHome',{customer:customer});
});

app.get('/employeeLogin', (req,res)=>{
    res.render('employeeLogin');
});

let doEmployeeLogin = async(username, password, res) => {
    let employee;
    if(username!=null && password!=null){
        try{
            employee = await db.employeeLogin(username,password);
            console.log(employee);
            if(employee.length == 1){
                return employee[0];
            }
        } catch(e){
            console.log(e);
        }
    }   
    res.render('employeeLoginFail');
}

app.get('/employeeLogin/employeeHome', async(req, res, next) => {
    let username = req.query.user;
    let password = req.query.pass;
    let employee = await doEmployeeLogin(username, password, res);
    if (!employee)
        return;
    // console.log(employee);
    // console.log(employee['Role']);
    if(employee['Role'] == "Manager"){
        res.render('managerHome');
    } else if(employee['Role'] == "CustRep"){
        res.render('custRepHome', {employee:employee});
    } else {
        res.render('employeeLoginFail');
    }
});

// Express app on port 8080
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {console.log(`Server started on port ${PORT}`)});