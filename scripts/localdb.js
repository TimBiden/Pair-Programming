// getting-started.js
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('we\re connected!');
});

var kittySchema = mongoose.Schema({
    name: String
});

var Kitten = mongoose.model('Kitten', kittySchema);
