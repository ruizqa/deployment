const {UserModel} = require( './../models/userModel' );

const CommentController = {
    addComment : function( request, response ){
        if( request.session.userName === undefined ){
            response.redirect( '/users/login' );
        }
        else{
            let title = request.body.title;
            let content = request.body.content;
            let userName = request.session.userName;
    
            UserModel
                .getUserById( userName )
                .then( userResult => {
                    let newComment = {
                        title,
                        content
                    };
                    UserModel
                        .updateUserComment( userResult._id, newComment )
                        .then( result => {
                            response.redirect( '/users/landing' );
                        });
                });
        }
    }
}

module.exports = { CommentController };