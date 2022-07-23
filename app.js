//Packages & Imports
const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./helpers/jwt');

require('dotenv/config')

app.use(cors());
app.options('*', cors());
//Middlewares
app.use(express.json()) //antes era app.use(bodyParser.json());
app.use(morgan('tiny')) //log das request no terminal
app.use(authJwt())

//Routes
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');

const api = process.env.API_URL;

app.use(`${api}/categories`,categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

//Connect Database
mongoose.connect(process.env.CONNECTION_STRING).then(() => {
    console.log('Conexão com banco: Completa!')
}).catch((err) => {
    console.log(err)
})
//Server
app.listen(3000, () => {
    console.log('server na porta http://localhost:3000')
})