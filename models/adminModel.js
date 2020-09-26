const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
    email: {type: String, required: true, unique:true},
    password: {type: String, required: true, minlength: 5},
    displayName: { type: String , required:true},
});

module.exports = User = mongoose.model("admin",adminSchema);