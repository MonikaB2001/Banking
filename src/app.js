require("./db/mongoose");
const path = require("path");
const hbs = require("hbs");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const Account = require("./models/account");
const Customer = require("./models/customer");
const Transaction = require("./models/transaction");

// Define Path for express config
const publicDirPath = path.join(__dirname, '../public');
const viewPath = path.join(__dirname, '../templates/views');
const partialPath = path.join(__dirname, '../templates/partials');

// setup static directory to serve
app.use(express.static(publicDirPath));
app.set('view engine', 'hbs');
app.set('views', viewPath);

hbs.registerPartials(partialPath);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//hbs(handlebar)routes---
app.post('/api/account', async function (req, res) {
    try {
        req.body.customer_id = req.query.customer_id;
        var account = new Account(req.body);
        await account.save();
        res.status(200).send(account);
    } catch (e) {
        console.log(e);
        res.status(500).send("Account Not Saved");
    }
});

app.post('/api/customer', async function (req, res) {
    try {
        if (req.body.account_balance < 5000) {
            res.status(400).send("Minimum Balance Should be 5000");
            return;
        }

        var customer = new Customer(req.body);
        await customer.save();

        var accObj = {
            account_no: req.body.account_no,
            account_balance: req.body.account_balance,
            account_type: req.body.account_type,
            customer_id: customer._id
        }

        var account = new Account(accObj);
        await account.save();
        res.status(200).send({
            customer,
            account
        });
    } catch (e) {
        console.log(e);
        res.status(500).send("Customer not saved");
    }
})

app.put('/api/transfer', async function (req, res) {
    try {
        var fromAcc = await Account.findOne({
            account_no: req.body.from_acc
        });

        if (fromAcc.account_balance < req.body.amt) {
            res.status(400).send("Insufficient Funds");
            return;
        }

        var toAcc = await Account.findOne({
            account_no: req.body.to_acc
        })

        await Account.findOneAndUpdate({ _id: fromAcc._id }, { $inc: { 'account_balance': -(req.body.amt) } })

        await Account.findOneAndUpdate({ _id: toAcc._id }, { $inc: { 'account_balance': req.body.amt } })

        var transferObj = {
            from_acc: req.body.from_acc,
            to_acc: req.body.to_acc,
            amt: req.body.amt
        }

        var transaction = new Transaction(transferObj);
        await transaction.save();

        res.status(200).send("Amount Transfered Successfully");
    } catch (e) {
        res.status(500).send("Unable to transfer ammount");
    }

});

app.get('/api/balance', async function (req, res) {
    try {
        var account = await Account.findOne({
            account_no: req.query.account_no
        })
        res.status(200).send({
            balance: account.account_balance
        });
    } catch (e) {
        res.status(500).send("Unable to get account balance");
    }
});

app.listen(5000, function () {
    console.log('The project is running in port 5000');
});