
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

app.get('/test', (req, res, next) => {
    const fileName = './products.json';
    const file = require(fileName)
    console.log(file["mem"])


    //elements.push({"name": "Tony", "age": "99"})

    res.send("tested")
})


app.patch('/elements/:index', function (req, res) {
    console.log(elements)
    console.log("----------------------------------------")
    var target = req.params.index
    elements[target] = req.body.editContent
    console.log(elements)
    fs.writeFile("products.json", JSON.stringify(elements), (err, result) => {
        if (err){ 
            console.log('Error: ', err)
            res.status(500).json({message: "Error! :( ", err})
        }
        else{

            res.status(200).json({message: "Success! Be happy!"});
        }
    })
});

app.post('/elements/', (req, res, next) => {
    elements.push(req.body)
    fs.writeFile("products.json", JSON.stringify(elements), (err, result) => {
        if (err) console.log('Error: ', err)
        console.log(err)
    })
    res.status(201).json({message: "Created! :D"})
})