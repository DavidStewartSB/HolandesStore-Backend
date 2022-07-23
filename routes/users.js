const {User} = require('../models/user')
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()

// http://localhost:3000/api/v1/users

router.get(`/`, async (req, res) =>{
    const userList = await User.find().select('-passwordHash');

    if(!userList){
        res.status(500).json({success: false, message:"Falha ao consultar lista de usuários"})
    }
    res.status(200).send(userList);
})
router.get(`/:id`, async (req, res)=>{
    const user = await User.findById(req.params.id).select('-passwordHash');
    if(!user){
        res.status(500).json({success: false, message: "Falha ao consultar usuário"})
    }
    res.send(user)
})//--GetById
router.post(`/`, async (req,res) =>{
    let user = new User({
        name : req.body.name,
        email: req.body.email,
        color: req.body.color,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    user = await user.save();
    if(!user){
        return res.status(400).send('Erro ao efetuar cadastro!')
    } res.send(user)
})
router.post(`/login`, async (req, res)=>{
    const secret = process.env.SECRET
    const user = await User.findOne({email: req.body.email})
    if(!user){
        return res.status(400).send('Usuário não encontrado')
    }
    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const token = jwt.sign(
            {userId: user.id},
            secret,
            {expiresIn: '1d'})
        res.status(200).send({user: user.email, token: token})
    } else {
        return res.status(400).send("Senha incorreta!")
    }
    
})
router.put(`/:id`, async (req, res) => {
    const userExist = await User.findById(req.params.id);
    let newPassword;
    if(req.body.password){
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else {
        newPassword = userExist.passwordHash;
    }
    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
        name : req.body.name,
        email: req.body.email,
        color: req.body.color,
        passwordHash: newPassword,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
        }, {new: true}
    )
    if(!user) return res.status(400).send({success: false, message: 'Erro ao atualizar usuário'})
    res.send(user)
})
router.delete(`/:id`, async (req, res) =>{
    await User.findByIdAndDelete(req.params.id).then(user => {
            if(user){
                return res.status(200).json({success: true, message: "Sucesso ao deletar usuário", user})
            }  else {
                return res.status(404).json({success: false, message: "Erro ao encontrar usuário"})
            }
    }).catch(err=> {
        return res.status(400).json({success: false, error: err})
    })
})

module.exports = router;