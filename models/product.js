const mongoose = require('mongoose');

//Models (SCHEMA)
const productSchema = mongoose.Schema({
    name: {  //Nome
        type: String,
        required: true,
    },
    description: { //Descrição
        type: String,
        required: true
    },
    richDescription: { //Descrilão em detalhes ( Devo setar um numero maximo de caracteres)
        type: String,
        default: '',
    },
    image: { //imagem URL
        type: String,
        default: ''
    },
    images: [{ //Array de imagens do carrossel
        type: String
    }],
    brand: { //Marca
        type: String,
        default: ''
    },
    price: { //Preço
        type: Number,
        default: 0
    },
    category: { //chave para model category
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    countInStock: { //estoque
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    rating: { //Avaliações
        type: Number,
        default: 0
    },
    numReviews: { //Numero de avaliações
        type: Number,
        default: 0
    },
    ifFeatured: { //se tiver estoque
        type: Boolean,
        default: false
    },
    dateCreated: { //Data de postagem
        type: Date,
        default: Date.now
    }
})

productSchema.virtual('id').get(function() {
    return this._id.toHexString();
});
productSchema.set('toJson', {
    virtuals: true
})

exports.Product = mongoose.model("Product", productSchema);
