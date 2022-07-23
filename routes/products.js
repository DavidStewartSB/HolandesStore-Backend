const {Product} = require("../models/product");
const express = require('express');
const { Category } = require("../models/category");
const router = express.Router();
const mongoose = require('mongoose')

router.get(`/`, async (req, res)=> {
    let filter = {}
    if(req.query.categories){
        filter = {category: req.query.categories.split(',')}
    }
    const productList = await Product.find(filter).populate('category');
    if (!productList){
        res.status(400).json({success: false})
    }
    res.send(productList);
})
router.get(`/:id`, async (req, res)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        res.status(500).json({success: false, message: 'Erro ao tentar efetuar consulta'})
    }
    res.send(product)
})
router.post(`/`, async (req, res)=> {
    const category = await Category.findById(req.body.category)
    if(!category) return res.status(400).send('Categoria invalida')

    const product = new Product({
        name: req.body.name,
        description : req.body.description,
        richDescription : req.body.richDescription,
        image : req.body.image,
        brand : req.body.brand,
        price : req.body.price,
        category : req.body.category,
        countInStock : req.body.countInStock,
        rating : req.body.rating,
        numReviews : req.body.numReviews,
        ifFeatured : req.body.ifFeatured,
    })
    this.product = await product.save();
    if(!product) 
    return res.status(500).send('Erro ao criar um produto')
    res.send(product)
})
router.put(`/:id`, async(req, res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send(`Produto com id ínvalido`)
    }
    const category = await Category.findById(req.body.category)
    if(!category) return res.status(400).send(`Produto com id: ${id} ínvalido`)

    const product = await Product.findByIdAndUpdate(req.params.id,{
        name: req.body.name,
        description : req.body.description,
        richDescription : req.body.richDescription,
        image : req.body.image,
        brand : req.body.brand,
        price : req.body.price,
        category : req.body.category,
        countInStock : req.body.countInStock,
        rating : req.body.rating,
        numReviews : req.body.numReviews,
        ifFeatured : req.body.ifFeatured,
    }, {new: true}
    )
    if(!product) return res.status(500).send('Erro ao criar produto')
    res.send(product)
})
router.delete(`/:id`, async(req,res)=>{
    Product.findByIdAndRemove(req.params.id).then(product =>{
        if(product){
            return res.status(200).json({success: true, message: 'Produto removido com sucesso!', product})
        } else {
            return res.status(404).json({sucess: false, message: 'Erro ao tentar encontrar o produto'})
        }
    }).catch(err=>{
        return res.status(500).json({success: false, error: err})
    })
})
router.get(`/get/count`, async(req, res)=>{
    Product.countDocuments().then(count => {
        if(count){
            return res.status(200).json({productCount: count});
        } else {
            return res.status(500).json({success: false});
        }
    }).catch(err=> {
        return res.status(400).json({
            success: false,
            error: err
        })
    })
})
router.get(`/get/featured/:count`, async(req, res)=> {
    const count = req.params.count ? req.params.count : 0
    const products = await Product.find({isFeatured: true}).limit(+count)
    if(!products){
        res.status(500).json({success: false, mensage: 'Erro ao efetuar consulta'})
    } 
    res.send(products)
})

module.exports = router;