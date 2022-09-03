const {Product} = require("../models/product");
const express = require('express');
const { Category } = require("../models/category");
const router = express.Router();
const multer = require('multer')
const mongoose = require('mongoose')

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
    'image/webp': 'webp'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype]
        let uploadError = new Error('formato de imagem invalido')
        if(isValid){
            uploadError = null
        }
      cb(uploadError, 'public/upload')
    },
    filename: function (req, file, cb) {
      const fileName = file.originalname.replace(' ', '-')
      const extension = FILE_TYPE_MAP[file.mimetype]
      cb(null, `${Date.now()}-${fileName}`)
    }
  })
  
  const uploadOptions = multer({ storage: storage })

//HTTP GET
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
//HTTP POST
router.post(`/`,uploadOptions.single('image') ,async (req, res)=> {
    //Loop de vinculo para categoria
    const category = await Category.findById(req.body.category)
    if(!category) return res.status(400).send('Categoria invalida')

    //post de imagens via backend com multer
    const file = req.file
    if(!file) return res.status(400).send('Arquivo de imagem não encontrada')
    const fileName = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/upload`

    const product = new Product({
        name: req.body.name,
        description : req.body.description,
        richDescription : req.body.richDescription,
        image : `${basePath}${fileName}`, //http://localhost:3000/public/upload/img
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
    res.send({success:true, message: 'Seu produto foi postado com sucesso', product})
})
//HTTP PUT
router.put(`/:id`, uploadOptions.single('image'), async(req, res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send(`Produto com id ínvalido`)
    }
    const category = await Category.findById(req.body.category)
    if(!category) return res.status(400).send(`Produto com id: ${id} ínvalido`)

    const product = await Product.findById(req.params.id);
    if(!product) return res.status(400).send({success:false, message: "Produto inválido"})

    const file = req.file
    let imagepath

    if(file) {
        const fileName = file.filename
        const basePath = `${req.protocol}://${req.get('host')}/public/upload`
        imagepath = `${basePath}${fileName}`
    } else {
        imagepath =  product.image;
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id,{
        name: req.body.name,
        description : req.body.description,
        richDescription : req.body.richDescription,
        image : imagepath,
        brand : req.body.brand,
        price : req.body.price,
        category : req.body.category,
        countInStock : req.body.countInStock,
        rating : req.body.rating,
        numReviews : req.body.numReviews,
        ifFeatured : req.body.ifFeatured,
    }, {new: true}
    )
    if(!updatedProduct) return res.status(500).send('Erro ao criar produto')
    res.send(updatedProduct)
})
router.put(`/gallery-images/:id`,uploadOptions.array('images', 10), async (req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send({success: false, message: 'Invalid Product ID'})
    }
    const files = req.files
    let imagesPath = []
    const basePath = `${req.protocol}://${req.get('host')}/public/upload`
    if(files) {
        files.map(file => {
            imagesPath.push(`${basePath}${file.fileName}`)
        })
    }
    const product = await Product.findByIdAndUpdate(req.params.id,
        {
            images: imagesPath,
        },{new: true}
    )
    if(!product) return res.status(500).send('Erro ao editar produto')
        res.send({success: true, message: "Produto atualizado com sucesso", product})
})
//HTTP DELETE
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

module.exports = router;