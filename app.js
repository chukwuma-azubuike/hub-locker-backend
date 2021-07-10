const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const validator = require('./validation/validation.js');
const { json } = require('body-parser');

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

    db.collection('state').findOne({ name: data }, (err, result) => {
        result == null ?
            db.collection('city').findOne({ name: data }, (err, result) => {
                result == null ? res.json(err) :
                    db.collection('lockers').find({ tags: result._id }, (err, found) => {
                        err ? res.json(err) :
                            found.toArray((err, found) => {
                                err ? res.json(err) :
                                    res.status(201).json({ cityId: result._id, data: found })
                            })
                    })
            })
            : db.collection('lockers').find({ tags: result._id }, (err, lockersFound) => {
                err ? res.json(err) :
                    lockersFound.toArray((err, lockersRendered) => {
                        err ? res.json(err) :
                            res.status(201).json({ stateId: result._id, data: lockersRendered })
                    })
            })
    })
})

app.get('/api/state/:stateId', (req, res) => {
    let stateId = req.params.stateId;

    db.collection('city').find({ stateId: stateId }, (err, foundCities) => {
        err ? res.json(err) :
            foundCities.toArray((err, renderCities) => {
                err ? res.json(err) :
                    res.status(201).json(renderCities)
            })
    })
})


//Listening Port
app.listen(process.env.PORT, () => {
    console.log(`App running on port ${process.env.PORT}`);
})