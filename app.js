const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');


//Middleware 
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());

// Database Connection
// const uri = process.env.MONGO_DB_URI;
const uri = process.env.MONGO_DB_URL;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    err ? consolelog(err) : console.log('MongoDB is live!');
});

const db = client.db("hubLockerDB");// perform actions on the collection object


// Routes
// app.get('/api', (req, res) => {
//     db.collection('country').find().toArray((err, docs) => {
//         err ? console.log(err) : res.status(201).send({ status: 'Successful', docs });
//     })
// });

app.get('/api/search/:query', (req, res) => {
    let data = req.params.query;
    db.collection('country').find({ name: data }).toArray((err, result) => {
        console.log(result);
        err ? console.log(err) : res.status(201).send(result[0])
    })
    // res.status(201).send({ message: 'Received locker query', body: data });
})


//Listening Port
app.listen(process.env.PORT, () => {
    console.log(`App running on port ${process.env.PORT}`);
})