const express = require('express');
const { randomUUID } = require('crypto');
const fs = require('fs');

const app = express();

app.use(express.json());

let products = [];

fs.readFile('products.json', 'utf-8', (err, data) => {
    if(err) {
        console.log(err);
    } else {
        products = JSON.parse(data);
    };
});

/*
--> POST - Inserir um dado 
--> GET - Buscar um/mais dados 
--> PUT - Alterar um dado
--> DELETE - Remover um dado
*/

/*
--> Body - Sempre que eu quiser enviar dados para a minha aplicação
--> Params - /products/1723123731
--> Query - /products?id=923492943&value=943593858345
*/

app.post('/products', (req, res) => {
    // Nome e Preço => mane e price

    const { name, price } = req.body;

    const product = {
        name,
        price,
        id: randomUUID(),
    };
    
    products.push(product);

    productFile();

    return res.json(product);
});

app.get('/products', (req, res) => {
    return res.json(products)
});

app.get('/products/:id', (req, res) => {
    const { id } = req.params;
    const product = products.find((product) => product.id === id);
    return res.json(product);
});

app.put('/products/:id', (req, res) => {
    const { id } = req.params;  
    const { name, price } = req.body;
    const productIndex = products.findIndex(product => product.id === id); 
    products[productIndex] = {
        ...products[productIndex],
        name,
        price,
    };
    productFile();

    return res.json({message: 'Produto alterado com sucesso!'});
});

app.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    const productIndex = products.findIndex(product => product.id === id); 
    products.splice(productIndex, 1);
    productFile();
    return res.json({message: 'Produto removido com sucesso!'})
});

function productFile() {
    fs.writeFile('products.json', JSON.stringify(products), (err) => {
        if(err) {
            console.log(err)
        } else {
            console.log('Produto inserido')
        }
    });   
}

app.listen(4002, () => console.log('O servidor está rodando na porta 4002'));