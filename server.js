const express = require( 'express' );
const session = require( 'express-session' );
const flash = require( 'express-flash' );
const cors = require('cors');
const path = require( 'path' );
const {APIRouter} = require( './server/routes/apiRouter' );
//const formData = require('express-form-data');
require( './server/config/database' );
require( './server/config/filestorage' );
require( 'dotenv' ).config();
const app = express();

app.use( express.static(path.join(__dirname, "/public/images")) );
app.use(express.static(path.join(__dirname, "/public/dist/public")));
app.use( express.urlencoded({extended:true}) );
app.use( express.json() );
app.use(cors());

app.use( flash() );

app.use(session({
    secret: process.env.SESSION_TOKEN,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 * 20 }
}));


app.use( '/api', APIRouter );

app.all( '*', function( request, response ){
    response.sendFile( path.resolve( './public/dist/public/index.html' ) );
});

app.listen( process.env.PORT, function(){
    console.log( "The users server is running in port 8181." );
});