const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    productName: {type: String, required: true, unique:true},
    productDescription: {type: String, required: true, minlength: 5},
    productPrice: { type:Number , required:true},
    productQuantity: { type:Number , required:true},
    productImageName:{type:String,default:"none",required:true},
    productImageData: {type:String,required:true},
});

module.exports = Product = mongoose.model("product",productSchema);