const mongoose = require( 'mongoose' );
const { basicURLParse } = require('whatwg-url');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const BicycleSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        maxlength:200,
        required : true
    },
    location : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        min:1,
        required : true
    },
    owner_id:{
        required:true,
        type:String
    },

    filename:{
        required:true,
        type:String
    }
});

BicycleSchema.plugin(AutoIncrement, {inc_field: 'id'});
const Bicycle = mongoose.model( 'bicycles', BicycleSchema );

const BicycleModel = {
    addBike : function( newBike ){
        return Bicycle.create( newBike );
    },
    getBikes : function(){
        return Bicycle.find();
    },
    getMyBikes:function(email){
        return Bicycle.find({owner_id:email});
    },
    findOne : function(id){
        return Bicycle.findOne({id:id})
    },

    delete: function(bikedata){
        return Bicycle.remove(bikedata, {single:true});
    },

    update:function(id, newBike){
        return Bicycle.findOneAndUpdate( {id:id}, {$set : newBike }, {new : true} )
    }
}

module.exports = {
    BicycleSchema,
    BicycleModel
};