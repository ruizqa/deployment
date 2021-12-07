const {UserModel} = require( './../models/user' );
const bcrypt = require( 'bcrypt' );

const UserController = {
    createUser : function( request, response ){
        const email = request.body.email;
        const firstName = request.body.firstName;
        const lastName = request.body.lastName;
        const password = request.body.password;
    
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
                        response.redirect( '/home' );
                    })
                    .catch( err => {
                        request.flash( 'registration', 'That username is already in use!' );
                        response.redirect( '/' );
                    });
            });
    },
    loadLanding : function( request, response ){
        if( request.session.email === undefined ){
            response.redirect( '/' );
        }
        else{
            UserModel
                .getUsers()
                .then( data => {
                    console.log( data );
                    let currentUser = {
                        firstName : request.session.firstName, 
                        lastName : request.session.lastName,
                        userName : request.session.userName
                    }
                    response.render( 'index', { users : data, currentUser } );
                }); 
        }
    },
    userLogin : function( request, response ){
        let userName = request.body.loginUserName;
        let password = request.body.loginPassword;
    
        UserModel
            .getUserById( userName )
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
                        request.session.userName = result.userName;
    
                        response.redirect( '/users/landing' );
                    })
                    .catch( error => {
                        request.flash( 'login', error.message );
                        response.redirect( '/users/login' );
                    }); 
            })
            .catch( error => {
                request.flash( 'login', error.message );
                response.redirect( '/users/login' );
            });
    },
    userLogout : function( request, response ){
        request.session.destroy();
        response.redirect( '/users/login' ); 
    },
    getUserById : function( request, response ){
        let id = request.query.id;
        UserModel
            .getUserById( id )
            .then( result => {
                if( result === null ){
                    throw new Error( "That user doesn't exist" );
                }
                response.render( 'user', { found: true, user: result } );
            })
            .catch( error => {
                response.render( 'user', { found: false } );
            });
    },
    getUserByIdParam : function( request, response ){
        let id = request.params.identifier;
    
        UserModel
            .getUserById( id )
            .then( result => {
                if( result === null ){
                    throw new Error( "That user doesn't exist" );
                }
                response.render( 'user', { found: true, user: result } );
            })
            .catch( error => {
                response.render( 'user', { found: false } );
            });
    }
}


module.exports = { UserController };