function errorHandler(err, req, req, next){
    if(err.name === "UnauthorizedError"){
        // hwt authentication error
        res.status(500).json({message: 'Usuário não autorizado'})
    }
    if(err.name === "ValidationError"){
        //validation error
       return res.status(401).json({message: "Usuário não validado"})
    }
    // default to 500 server error
    return res.status(500).json({message: "Erro no servidor"})
}

module.exports = errorHandler;