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

    //deleteMany
    db.collection('Todos').deleteMany({text: "Walk the dog"}, (err, result) => {
        if(err) {
            return console.log('Unable to find', err);
        }
        console.log(result);
    });

    //client.close();


});
