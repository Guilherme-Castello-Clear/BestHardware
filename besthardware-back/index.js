
var bodyParser = require('body-parser')
var fs = require('fs');
// json file with the data
var data = fs.readFileSync('products.json');

var elements = JSON.parse(data);
const express = require("express");
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()) 
// To solve the cors issue
const cors = require('cors');
   
app.listen(8000, () => console.log("Server Start at the Port 8000"));
   
app.use(express.static('public'));
app.use(cors());

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

app.patch('/elements/:index', function (req, res) {
    var target = req.params.index
    elements[target] = req.body.editContent
    save(elements, res)
});

app.post('/elements/:id', (req, res, next) => {
    let newest = req.body
    elements[req.params.id] = newest
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
            res.status(500).json({message: "Error! :( ", err})
        }
        else{

            res.status(200).json({message: "Success! Be happy!"});
        }
    })
}