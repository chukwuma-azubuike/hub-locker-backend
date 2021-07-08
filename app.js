const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const validator = require('./validation/validation.js');

//Middleware 
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

app.get('/api/search/:query', (req, res) => {
    let data = req.params.query;
    db.collection('city').findOne({ name: data }, (err, result) => {

        err && res.send(401).json({ message: 'No Lockers' });

        if (result == null) {
            res.status(201).send({ message: 'No Lockers' });
        } else if (result) {
            db.collection('lockers').find({ tags: result._id }, (err, found) => {
                err ? console.log(err) : found.toArray((err, found) => {
                    err ? console.log(err) : res.status(201).json({ cityId: result._id, data: found });
                })
            })
        }
    })

    // .toArray((err, result) => {
    //     err ? console.log(err) : res.status(201).send(result[0].stateId);
    // })
    // res.status(201).send({ message: 'Received locker query', body: data });
})


//Listening Port
app.listen(process.env.PORT, () => {
    console.log(`App running on port ${process.env.PORT}`);
})