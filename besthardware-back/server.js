var bodyParser = require('body-parser')
const express = require("express");
const app = express();
var fs = require('fs');

const crypto = require('node:crypto');
var data = fs.readFileSync('products.json');
var elements = JSON.parse(data);

var userData = fs.readFileSync('users.json');
var users = JSON.parse(userData);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

const cors = require('cors');
   
app.listen(8000, () => console.log("Server Start at the Port 8000"));   
app.use(express.static('public'));
app.use(cors());

app.post('/test', (req, res, next) => {
    console.log(findUser(req.body.email))
    res.status(200).send('ok')
})

app.get('/elements', (req, res) => {
    res.send(elements)
});

app.get('/elements/:element/', (req, res) => {
    var word = req.params.element;
    if(elements[word]) {
        var reply = elements[word];
    }
    else {
        var reply = {
            status:"Not Found"
        }
    }
    
    res.send(reply);
});

app.put('/elements/:index', function (req, res) {
    var target = req.params.index
    elements[target] = req.body[target]
    save(elements, res)
});

app.patch('/elements/:index', function (req, res) {
    var target = req.params.index
    let keys = Object.keys(req.body)
    console.log(keys)
    keys.map(key => {
        elements[target][key] = req.body[key];
    })
    
    console.log(elements)
    save(elements, res)
});

app.post('/elements/', (req, res, next) => {
    let newest = req.body
    let lastId = lastIds(elements);
    let nextId = lastId + 1;
    elements[nextId] = newest
    save(elements, res)
})

app.delete('/elements/:index', (req, res, next) => {
    target = req.params.index
    delete elements[target]
    save(elements, res);
})

//START USERS ROUTES


app.post('/user/login', (req, res, next) => {
    let receivedPSW = md5(req.body.password)
    let receivedEmail = req.body.email
    let receivedId = findUser(receivedEmail)
    if (receivedPSW == users[receivedId].password && receivedEmail == users[receivedId].email){
        res.status(200).json(users[receivedId])
    }
    else{
        console.log('Não logado!')
        res.status(401).json({message: "User data not found!"})
    }
})

app.post('/user/cadastration', (req, res, next) => {
    
    let receivedPSW = req.body.password
    let receivedRePSW = req.body.repassword
    let receivedEmail = req.body.email
    let receivedAge = req.body.age
    let receivedName = req.body.name
    let receivedAdmin = req.body.isAdmin

    let emailExist = getEmail(receivedEmail)
    if (emailExist == false && receivedPSW == receivedRePSW && receivedAge && receivedName && receivedAdmin != undefined){
        console.log("Cadastrado com sucesso!")

        var nextId = lastIds(users) + 1
        delete req.body.repassword
        req.body.password = md5(req.body.password)
        req.body.id = nextId
        users[nextId] = req.body 
        fs.writeFileSync('users.json', JSON.stringify(users), (err, result) => {
            if(err){
                console.log("Something got wrong! :( "+ err)
                res.status(400).json({message: "Algo deu errado!"})
            }
        })
        res.status(200).json({message: "Accont created"})
    }
    else{
        console.log("Invalid data!")
        res.status(400).json({message: "Invalid data"})   
    }
    res.status(200)
})

function save(elements, res, filename = 'products.json'){
    fs.writeFile(filename, JSON.stringify(elements), (err, results) => {
        if (err){ 
            console.log('Error: ', err)
            res.status(500).json({message: "Error! :( ", err});
        }
        else{
            res.status(200).json({message: "Success! Be happy!"});
        }
    });
}

function getIds(json){
    let idList = [];
    for(var key in json){
        idList.push(key);
    }
    return idList;
}

function lastIds(json){
    let ids = getIds(json);
    let lastId = ids[ids.length - 1];
    return parseInt(lastId);
}

function getEmail(receivedEmail){
    for(var user in users){
        if (users[user].email == receivedEmail){
            console.log(users[user])
            return receivedEmail
        }
    }
    return false
}

function findUser(email){
    for(var user in users){
        if(users[user].email == email){
            return user
        }
    }
}


function md5(content) {  
    return crypto.createHash('md5').update(content).digest('hex')
}