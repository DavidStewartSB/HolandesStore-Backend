const {Product} = require("../models/product");
const express = require('express')
const router = express.Router();

router.get(`/`, async (req, res)=> {
    const productList = await Product.find();

    if (!productList){
        res.status(500).json({sucess: false})
    }
    res.send(productList);
})

router.post(`/`, (req, res)=> {
    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock
    })

    product.save().then((createdproduct=>{
        res.status(201).json(createdproduct)
    })).catch((err)=>{
        res.status(500).json({
            error: err,
            success: false
        })
    })
})

module.exports = router;