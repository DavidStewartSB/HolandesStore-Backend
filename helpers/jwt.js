const expressJwt = require('express-jwt');

function authJwt(){
    const secret = process.env.SECRET;
    const api = process.env.API_URL;
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked,
    }).unless({
        path: [
            {url: `/\/public\/uploads(.*)/`, methods: ['GET', 'OPTIONS']},
            {url: `/\api/\v1/\products(.*)/`, methods: ['GET', 'OPTIONS']},
            {url: `/\api/\v1/\categories(.*)/`, methods: ['GET', 'OPTIONS']},
            {url: `/\api/\v1/\orders(.*)/`, methods: ['POST', 'OPTIONS']},
            '/api/v1/users/login',
            "/api/v1/users/register"
        ]
    })
}

async function isRevoked(req, payload, done){
    if(!payload.isAdmin){
        done(null, true)
    }
    await done();
}
module.exports = authJwt;