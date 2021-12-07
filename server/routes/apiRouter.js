const express = require( 'express' );
const {APIController} = require( './../controllers/apiController' );
const APIRouter = express.Router();


const multer = require('multer')
const path = require('path');
 
const storage = multer.diskStorage({

        // Setting directory on disk to save uploaded files
        destination: function(req,file,callback){
            callback(null,'public/src/assets/images');},
    
        // Setting name of file saved
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + '.' + path.extname(file.originalname))
        }
    })
    
    
const upload = multer({
    storage: storage,
    fileFilter: function(req,file,cb){
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
    if(mimetype && extname){
        return cb(null,true)
    }
    else{
        cb('Error:Images only')
    }

    }
})



APIRouter
    .post( '/users/login', APIController.userLogin );

APIRouter
    .get( '/users/logout', APIController.userLogout );


APIRouter
    .get( '/users/validate', APIController.validateUser );

APIRouter
    .post( '/myBikes', APIController.getMyBikes );

APIRouter
    .route( '/bikes' )
    .get( APIController.getAllBikes)
    .post(APIController.createBike)


APIRouter
    .route( '/users' )
    .post( APIController.addNewUser )
    .get(APIController.getAllUsers);



APIRouter
    .delete( '/bikes/delete/:id', APIController.deleteBike );

APIRouter
    .put( '/bikes/:id', APIController.updateBike );

module.exports = { APIRouter };