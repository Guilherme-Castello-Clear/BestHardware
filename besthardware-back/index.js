
var bodyParser = require('body-parser')
const express = require("express");
const app = express();
var fs = require('fs');

var data = fs.readFileSync('products.json');
var elements = JSON.parse(data);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

const cors = require('cors');
   
app.listen(8000, () => console.log("Server Start at the Port 8000"));   
app.use(express.static('public'));
app.use(cors());

app.get('/test', (req, res, next) => {
    let lastId = 0;
    lastId = lastIds();
    console.log(lastId)
    res.send(elements)
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
    let lastId = lastIds();
    let nextId = lastId + 1;
    elements[nextId] = newest
    save(elements, res)
})

app.delete('/elements/:index', (req, res, next) => {
    target = req.params.index
    delete elements[target]
    save(elements, res);
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

function getIds(){
    let idList = [];
    for(var key in elements){
        idList.push(key);
    }
    return idList;
}

function lastIds(){
    let ids = getIds();
    let lastId = ids[ids.length - 1];
    return parseInt(lastId);
}