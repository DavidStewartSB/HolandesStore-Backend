const {Category} = require('../models/category')
const express = require('express');
const router = express.Router();
// http://localhost:3000/api/v1/categories
// Metodos HTTP da "Controller"
router.get(`/`, async (req, res)=> {
    const categoryList = await Category.find();

    if(!categoryList) {
        res.status(500).json({success: false})
    }
    res.status(200).send(categoryList);
})
router.get(`/:id`, async (req, res)=>{
    const category = await Category.findById(req.params.id);

    if(!category){
        return res.status(500).json({message: "A categoria com esse ID não foi encontrada!"})
    }
    res.status(200).send(category);
})
router.post(`/`, async (req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })
    category = await category.save(); //mongoose saved

    if(!category){
        return res.status(404).send('A Categoria não pode ser criada!')
    }
    res.send(category);
})
router.put(`/:id`, async(req, res)=> {
    const category = await Category.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    }, {new: true});
    if(!category)
        return res.status(400).send('Erro ao encontrar a categoria')
    res.send(category)
})
router.delete(`/:id`, async(req, res)=> {
    Category.findByIdAndRemove(req.params.id).then(category => {
        if(category){
            return res.status(200).json({seccess: true, message: 'Sucesso ao deletar Categoria!', category})
        } else {
            return res.status(404).json({success: false, message: "Erro ao deletar Categoria!"})
        }
    }).catch(err=>{
        return res.status(400).json({success: false, error: err}) //Callback de erro para o frontend
    })
    
})

module.exports= router;

