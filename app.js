import express  from 'express';
import bcrypt from 'bcrypt'

import {
    getUsersById,
    createUsers,
    getUsers,
    register,
    login,
    updatePassword,
    getProducts,
    getProductssById,
    AdminPostProducts

} from './database.js';

const app = express();
app.use(express.json());

app.get('/users', async(req, res) => {
    const users = await getUsers();
    res.send(users);
});

app.get('/users/:id', async (req, res) => {
    const id = req.params.id;
    const users = await getUsersById(id);
    res.send(users);
});

app.post('/users', async (req, res) => {
    //console.log(req.body)
    const {name,lastName,age } = req.body;
    const users = await createUsers(name,lastName,age);
    res.status(201).send(users);
});

app.post('/register', async (req, res) => {
    const { email, password, name, lastName, age } = req.body;
    var regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    var expressionReguliere = new RegExp(regex);

    const saltRounds = 10; 
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    if (!email.includes('@')) {
        return res.status(403).send("ERREUR : email doit contenaire un '@' ")
    } else {
        if (!expressionReguliere.test(password)) {
            return res.status(403).send("ERREUR : mot de passe faible")
        } else if (!Number.isInteger(age)) {
            return res.status(403).send("ERREUR : age est un entier")
        }
    }
    await register(email, hashedPassword,name,lastName,age)
    res.status(200).send("Bienvenue !")
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const log = await login(email)
    if (log.length == 0) {
        res.status(404).send('user not found')
    }else {
        console.log(log)
        if (!await bcrypt.compare(password,log[0].password)){
            res.status(401).send("incorrect password")
            return;
        } 
    }
    res.status(200).send("connexion reussite")

});

app.put('/update-password', async (req, res) => {
    const { email, password } = req.body;
    var regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    var expressionReguliere = new RegExp(regex);

     if (!expressionReguliere.test(req.body.password)) {
            return res.status(403).send("ERREUR : mot de passe faible")
     } else {
        const saltRounds = 10; 
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
        await updatePassword(email, hashedPassword);
        res.status(200).send("Mot de passe modifié avec succes");
    } 
  
    
    
});
app.get('/products', async(req, res) => {
    const products = await getProducts();
    //afficher les noms des produit 
    let names = [];
    for (let i = 0; i < products.length; i++){
        names.push(products[i].ProductName);
    };
    
    res.status(200).send(names);
});

app.get('/products/:id', async (req, res) => {
    const ProductID = req.params.id;
    const products = await getProductssById(ProductID);
    if (products != undefined) {
        res.status(200).send(products.ProductName);
    } else {
        res.status(404).send({ message: "product not found" });
    }
});

app.post('/admin/addproduct', async (req, res) => { 
    const { UserID,  ProductName , Description , Price , StockQuantity } = req.body;
    let productadded = await AdminPostProducts(UserID, ProductName, Description, Price, StockQuantity);
    
    if (productadded != undefined) {
        res.status(200).send('Produit ajoute');
    } else {
        res.status(401).send(' this user can not post a product');
    }
   
    
});

app.listen(4000, () => {
    console.log("listening on port 4000");
})