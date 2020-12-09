var router = require('express').Router();
const Product = require('../models/productModel');
const multer = require('multer');

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./productImages/');
    },
    filename: function(req,file,cb){
        cb(null,Date.now()+file.originalname);
    }
});

const fileFilter = (req,file,cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null,true);
    }else{
        cb(null,false);
    }
}

const upload = multer({
    storage,
    limits:{
        fileSize:1024*1024*5
    },
    fileFilter:fileFilter
});

router.route("/add").post(upload.single('imageData'),(req,res,next)=>{
    try{
        
        const {productName,productDescription,productPrice,productQuantity} = req.body;
        const imageName=req.body.imageName;
        const imageData = req.file.path;
        if(!productName || !productDescription || !productPrice || !productQuantity || !imageName || !imageData){
            return res.status(400).json({msg: "Enter all Fields "});
        }
        if(productPrice<0){
            return res.status(400).json({msg:"Price cant be less than 0"});
        }
        if(productQuantity<0){
            return res.status(400).json({msg:"Quantity cant be less than 0"});
        }
        const newProduct = new Product({
            productName,
            productDescription,
            productPrice,
            productQuantity,
            productImageName: imageName,
            productImageData: imageData
        });
        const savedproduct =  newProduct.save();
        
        res.json(savedproduct);

        

    }catch(err){
        res.status(500).json({error:err.message});
    }
});


module.exports = router;