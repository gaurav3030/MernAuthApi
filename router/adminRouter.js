const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/authAdmin");
const Admin = require("../models/adminModel");

router.post("/register",async (req,res)=>{

    try{
        const {email , password , passwordCheck, displayName} = req.body;

    //validate
        if(!email || !password || !passwordCheck || !displayName){
            return res.status(400).json({msg: "Not all fields are entered"});
        }
        if(password.length< 5){
            return res.status(400).json({msg: "Password need to be at least 5 characters long"});
        }
        if(password != passwordCheck){
            return res.status(400).json({msg: "Password and confirm Password needs to be same"});
        }
        const existingAdmin = await Admin.findOne({email: email});
        if(existingAdmin){
            return res.status(400).json({msg: "Email already exists"});
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password,salt);
        const newAdmin = new Admin({
            email,
            password: passwordHash,
            displayName
        });
        const savedAdmin = await newAdmin.save();
        res.json(savedAdmin);
    }
    catch (err){
        res.status(500).json({error: err.message});
    }
    
});

router.post("/login", async (req ,res)=>{
    try{
        const {email , password } = req.body;
        if(!email || !password){
            return res.status(400).json({msg: "Not all fields are entered"});
        }
        const admin = await Admin.findOne({email: email});
        if(!admin){
            return res.status(400).json({msg: "No account with this email is registered"});
        }
        const isMatch = await bcrypt.compare(password,admin.password);
        if(!isMatch){
            return res.status(400).json({msg: "Invalid Login Credentials"});
        }
        
        const token = jwt.sign({id: admin._id}, process.env.JWT_TOKEN);
        res.json({
            token,
            admin: {
                id : admin._id,
                displayName: admin.displayName,
                
            },
        })

    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.delete("/delete", auth ,async (req , res) =>{
    try{
        const deletedAdmin =await Admin.findByIdAndDelete(req.admin);
        res.json(deletedAdmin);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.post("/tokenIsValid", async (req, res)=>{
    try{
        const token = req.header("x-auth-admin-token");
        if(!token) return res.json(false);
        const verified = jwt.verify(token,process.env.JWT_TOKEN);
        if(!verified) return res.json(false);

        const admin = await Admin.findById(verified.id);
        if(!admin) return res.json(false);

        return res.json(true);

    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});
router.get("/",auth , async (req,res)=>{
    const admin = await Admin.findById(req.admin);
    res.json({
        displayName: admin.displayName,
        id: admin._id,
    });
});
router.use('/products', require('./productRouter'));

module.exports = router;