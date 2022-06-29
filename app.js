const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose')
const app = express();
require('dotenv/config')

const api = process.env.API_URL;

//Middleware
app.use(express.json()) //antes era app.use(bodyParser.json());
app.use(morgan('tiny')) //log das request no terminal

//Models (SCHEMA)
const productShema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: {
        type: Number,
        required: true
    }
})

const Product = mongoose.model("Product", productShema);

// http://localhost:3000/api/v1/products
app.get(`${api}/products`,async (req, res) => {
    const productList = await Product.find();
    if(!productList){
        res.status(500).json({success: false})
    }
    res.send(productList)
})

app.post(`${api}/products`, (req, res) =>{
    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock
    })
    product.save().then((createdProduct=> {
        res.status(201).json(createdProduct)
    })).catch((err)=>{
        res.status(500).json({
            error: err,
            success: false
        })
    });
})

mongoose.connect(process.env.CONNECTION_STRING).then(() => {
    console.log('Database running')
}).catch((err) => {
    console.log(err)
})
app.listen(3000, () => {
    console.log('server is running http://localhost:3000')
})