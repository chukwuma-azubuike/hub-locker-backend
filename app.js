const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');


//Middleware 
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Database Connection
// const uri = process.env.MONGO_DB_URI;
const uri = process.env.MONGO_DB_URL;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    err ? consolelog(err) : console.log('MongoDB is live!');
});

const db = client.db("hubLockerDB");// perform actions on the collection object


// Routes
app.get('/api', (req, res) => {
    db.collection('country').find().toArray(function (err, docs) {
        err ? console.log(err) : res.status(201).send({ status: 'Successful', docs });
    })
});

app.post('/api/search', (req, res) => {
    let data = req.body;
    res.status(201).send({ message: 'Received locker query', body: data });
})


//Listening Port
app.listen(process.env.PORT, () => {
    console.log(`App running on port ${process.env.PORT}`);
})