const mongoose = require( 'mongoose' );
const {BicycleSchema, BicycleModel} = require( './bicycle' );
const UserSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minlength : 3,
        maxlength : 20
    },
    lastName : {
        type : String,
        required : true,
        minlength : 3,
        maxlength : 20
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
        minlength : 6,
    },
    bicycles : [ BicycleSchema ]
});


const User = mongoose.model( 'users', UserSchema );

const UserModel = {
    createUser : function( newUser ){
        return User.create( newUser );
    },
    getUsers : function(){
        return User.find();
    },
    getOneUser : function( email ){
        return User.findOne({ email:email });
    },
    deleteUserById : function( email ){
        return User.remove( {email:email} );
    },
    updateUser : function( email, userToUpdate ){
        return User.findOneAndUpdate( {email:email}, {$set : userToUpdate }, {new : true} )
    },

    // deleteBike: function(id){
    //     return BicycleModel.delete( Number(id));
        
    // },

    deleteBikefromUser:function(email,bikedata){     
        return User.updateOne({'email':email}, {$pull:{'bicycles':bikedata}})
       
    },

    addBiketoUser:function(email,bike){
        return User.updateOne({email:email}, {$push:{bicycles:bike}})
           
    },

    updateBiketoUser:function(email,bike,id){
        return User.updateOne({'email':email, 'bikes.id':id}, {$set: {
           bike
        }})
           
    },

};

module.exports = {UserModel};