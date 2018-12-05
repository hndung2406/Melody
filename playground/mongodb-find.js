//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');
const url = 'mongodb://localhost:27017/TodoApp';
const dbName = 'TodoApp';

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if(err) {
        return console.log('Unable to connect to MongoDb server');
    }
    console.log('Connected to MongoDb server');
    const db = client.db(dbName);

    db.collection('Todos').find({}).count((err, result) => {
        if(err) {
            return console.log('Unable to find', err);
        }
        console.log('Todos count: ' + result);
    });

    // db.collection('Todos').find({}).toArray((err, result) => {
    //     if(err) {
    //         return console.log('Unable to find', err);
    //     }
    //     console.log('Todos')
    //     console.log(JSON.stringify(result, undefined, 2));
    // });

    client.close();


});
