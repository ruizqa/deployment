const {UserModel} = require( './../models/user' );
const {BicycleModel} = require('./../models/bicycle')
const bcrypt = require( 'bcrypt' );
const multer  = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, callBack) {
        callBack(null, 'public/src/assets/images/');
    },
    filename: function (req, file, callBack) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      callBack(null, uniqueSuffix + '-' + file.originalname );
    }
  });
  
const upload = multer({
    storage : storage,
    fileFilter: function (req, file, callback) {
        let fileSplit = file.originalname.split('.');
        let ext = `.${fileSplit[1]}`;
        console.log("this is ext" + ext);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            req.body.append('filename', file.filename)
            return callback(new Error('Only images are allowed'));
        }
        callback(null, true);
    },
});



const APIController = {

    getAllBikes : function( request, response ){
        BicycleModel.getBikes()
            .then( bikes => {
                response.status( 200 ).json( bikes );
                
            });
    },
    getMyBikes : function( request, response ){
        let email = request.body.email;
        BicycleModel.getMyBikes(email)
            .then( bikes => {
                response.status( 200 ).json( bikes );
                
            })
            .catch(error => {
                response.status(400).end()
            })
    },
    getAllUsers : function( request, response ){
        UserModel.getUsers()
            .then( users => {
                let users_info = users.map((user)=>{
                    return {email:user.email, firstName:user.firstName, lastName:user.lastName}
                })
                response.status( 200 ).json( users_info );
                
            });
    },
    deleteBike : function( request, response ){
        let bike_id = Number(request.params.id);
        let email = request.session.email;
        BicycleModel
            .findOne(bike_id)
            .then(bike=>
                {console.log(bike)
                    BicycleModel
                        .delete(bike)
                        .then(data => console.log(data))
                    UserModel
                        .deleteBikefromUser(email,bike)
                        .then(response.status( 201 ).json(bike));
                    })
            .catch( error => {
                response.statusMessage = error.message;
                response.status( 406 ).end();
            })

    },
    addNewUser : function( request, response ){
        let { firstName, lastName, email, password } = request.body;
        if( firstName && lastName && email && password ){

            bcrypt.hash( password, 10 )
            .then( encryptedPassword => {
                const newUser = {
                    firstName,
                    lastName,
                    email,
                    password : encryptedPassword
                };
                console.log( newUser );
                UserModel
                    .createUser( newUser )
                    .then( result => {
                        request.session.firstName = result.firstName;
                        request.session.lastName = result.lastName;
                        request.session.email = result.email;
                        response.status( 201 ).json( result );
                    })
                    .catch( err => {
                        console.log(err);
                        response.statusMessage = 'That username is already in use!' 
                        response.status( 406 ).end();
                    });
            });

        }
        else{
            response.statusMessage = "You are missing a field to create a new user ('firstName', 'lastName', 'email', 'password')";
            response.status( 406 ).end();
        }      
    },

    createBike:[upload.single('image'), function(request,response,next){
        let { title, description, location, price, owner_id} = request.body
        let image = request.file
        if( title && description && price && location && owner_id && image ){

        let newBike = {title, description, price, location, owner_id, filename:image.filename}
        console.log(image, newBike)
            BicycleModel
            .addBike(newBike)
            .then((Bike)=>{
                UserModel.addBiketoUser(owner_id, Bike)
                .then(data => console.log(data))
                response.status( 201 ).json( Bike );
            })
            .catch( error => {
                    response.statusMessage = error.message;
                    response.status( 404 ).end();
                })
        }
        else{
            response.statusMessage = "You are missing a field to create a new user ('title', 'description', 'price', 'location', 'image')";
            response.status( 406 ).end();
        }

    }],

    updateBike :[ upload.single('image'),function(request, response ){
        console.log('Request file', request.file);
        let id = request.params.id;
        let { title, description, price, location, owner_id} = request.body;
        let image = request.file
        let updBike = {title, description, price, location, owner_id, filename:image.filename}
        console.log(updBike, id)
            BicycleModel
            .update(id, updBike)
            .then(data => {
                UserModel.updateBiketoUser(owner_id, updBike, id)
                .then(data => console.log(data))
                response.status( 201 ).json( updBike );
            })
            .catch( error => {
                    response.statusMessage = error.message;
                    response.status( 404 ).end();
                })

        
    }],
    userLogin : function( request, response ){
        let email = request.body.email;
        let password = request.body.password;
    
        UserModel
            .getOneUser( email )
            .then( result => {
                if( result === null ){
                    throw new Error( "That user doesn't exist!" );
                }
    
                bcrypt.compare( password, result.password )
                    .then( flag => {
                        if( !flag ){
                            throw new Error( "Wrong credentials!" );
                        }
                        request.session.firstName = result.firstName;
                        request.session.lastName = result.lastName;
                        request.session.email = result.email;
                        console.log(request.session.firstName, request.session.lastName, request.session.email)
                        let currentUser = {
                            firstName : result.firstName,
                            lastName : result.lastName,
                            email : result.email
                        }
                        response.status(200).json( currentUser );
                    })
                    .catch( error => {
                        response.statusMessage = error.message;
                        response.status(406).end()
                    }); 
            })
            .catch( error => {
                response.statusMessage = error.message;
                response.status(404).end();
            });
    },
    validateUser : function( request, response ){
        if( request.session.email &&
            request.session.firstName &&
            request.session.lastName ){
                let currentUser = {
                    email: request.session.email,
                    lastName: request.session.lastName,
                    firstName: request.session.firstName
                }
                response.status( 200 ).json( currentUser ); 
        }
        else{
            response.statusMessage = "You need to login to be here!";
            response.status( 401 ).end();
        }
    },
    userLogout : function( request, response ){
        request.session.destroy();
        response.status(200).json({message: "Successfully destroyed session"}); 
    }
}

module.exports = { APIController };


