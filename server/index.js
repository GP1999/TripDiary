const express = require('express');
const Connection = require('./DB.js');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const withAuth = require('./withAuthe.js');
const cors = require('cors');

const app = express();
let DBConnection;
Connection.connect(function () {
    DBConnection = Connection.get();
    app.listen(PORT);
});


app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

const mySecret = "gauravponkiya";
const PORT = 9000;

// Authenticate useres who is already loged in using JSONWeb token
app.get('/Authenticate', function (req, res, next) {
    const token = req.cookies.token;
    if (token) {
        console.log(token);

        jwt.verify(token, mySecret, function (err, decod) {
            if (err) 
                res.status(401).send("Please login");
             else {
                console.log("Authenticated");
                res.status(200).send("Welcome");
            }
            console.log(decod.email);
        });

    } else {
        console.log("Cookie not found");

        res.status(401).send("Please login");
    }
});

app.post('/login', function (req, res, next) {

    const {email, password} = req.body;
    DBConnection.collection('User').findOne({
        "email": email
    }, function (err, result) {
        if (result) {
            bcrypt.compare(password, result.password, function (err, same) {
                if (same) {
                    const payload = {
                        email
                    };
                    const token = jwt.sign(payload, mySecret, {expiresIn: '1h'});

                    res.cookie('token', token, {httpOnly: true});

                    res.status(200).send("Login Successfull");

                } else 
                    res.status(401).send("Incorrect password");
                
            })

        } else 
            res.status(401).send("Enter valid Email Address");
        
    })

});


// Register the users
app.post('/register', function (req, res, next) {

    const {email, password, name, Mobile_no} = req.body;
    if (!email || !password || !name || !Mobile_no) 
        res.status(401).send("Enter valid Details");
     else { // encrypt the password using algo HS256 in bcrypt
        const saltRound = 10;
        bcrypt.hash(password, saltRound, function (err, hashPass) {


            DBConnection.collection("User").insertOne({
                "email": email,
                "password": hashPass,
                "name": name,
                "Mobile_no": Mobile_no
            }, function (err, result) {
                if (err) 
                    res.status(401).send("User with Given Email is Registered!");
                 else { // Generate JSONWeb token for newly registered user
                    const payload = {
                        email
                    };
                    const token = jwt.sign(payload, mySecret, {expiresIn: '1h'});
                    res.cookie('token', token, {httpOnly: true});
                    res.status(200).send("Registered success fully");

                }
            })
        });

    }
});

app.post('/placeOrder', withAuth, function (req, res) {
    let {item, Address, Quantity, TotalPrice} = req.body;
    let token = req.cookies.token;
    jwt.verify(token, mySecret, function (err, decod) {
        let email = decod.email;

        DBConnection.collection("Orders").insertOne({
            "Item": item,
            "Useremail": email,
            "Address": Address,
            "Quantity": Quantity,
            "TotalPrice": TotalPrice,
            "status":"Pending"
        }, function (err, result) {
            if (err) {

                res.status(400).send("Order Not Placed");
            } else 
                res.status(200).send("Order  Placed");
            
        });
    });


});
app.get("/admin", function (req, res) {
    let token = req.cookies.token;
    if (token) {
        jwt.verify(token, mySecret, function (err, decod) {
            let email = decod.email;
            if (email === "admin@gmail.com") {
                DBConnection.collection("Orders").find({}).toArray(function (err, result) {
                    res.status = 200;
                    res.send(result);
                });
            } else {
                res.status = 400;
                res.send("You are not Admin");
            }
        });
    } else {
        res.status(400).send("Please login");
    }

});

app.get("/", function (req, res) {

    DBConnection.collection("Items").find({}).toArray(function (err, result) {
        res.status = 200;
        res.send(result);

    });
});
app.post('/reject', withAuth, function (req, res) {

    let token = req.cookies.token;
    let {email, ItemName} = req.body;
    if (token) {
        jwt.verify(token, mySecret, function (err, decod) {
            let adminemail = decod.email;
            if (adminemail === "admin@gmail.com") {
                DBConnection.collection("Orders").deleteOne({
                    Useremail: email,
                    Item: ItemName
                }, function (err, result) {
                    if (err) 
                        res.status(500).send("Internal Server Error");
                     else 
                       { res.status(200).send("Successfully rejected");
                       console.log("Deleted successfully");
                    }
                    

                });
            }});
            } else {
                res.status(400).send("Please login");
            }


        });
        app.post('/accept', withAuth, function (req, res) {

            let token = req.cookies.token;
            let {email, ItemName} = req.body;
            if (token) {
                jwt.verify(token, mySecret, function (err, decod) {
                    let adminemail = decod.email;
                    if (adminemail === "admin@gmail.com") {
                        DBConnection.collection("Orders").update({
                            Useremail: email,
                            Item: ItemName
                        },{$set:{"status":"Accepted"}}, function (err, result) {
                            if (err) 
                                res.status(500).send("Internal Server Error");
                             else 
                               { res.status(200).send("Successfully Accepted");
                               console.log("Accepted successfully");
                            }
                            
        
                        });
                    }});
                    } else {
                        res.status(400).send("Please login");
                    }
        
        
                });

        
    
