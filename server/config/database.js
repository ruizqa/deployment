const mongoose = require( 'mongoose' );

mongoose.connect('mongodb://localhost/bicyclemarket', {useNewUrlParser: true});

mongoose.connection.on('error', err => {
    console.error(`Mongoose default connection error: ${ err }`);
    process.exit(0);
});
  
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection disconnected');
});