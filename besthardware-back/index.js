
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

    elements.push({
        "test": {
            "brand": "Corsair",
            "capacity": "8gb",
            "imgPath": "NoImg",
            "categories": ["memram", "8gb", "corsair"]
        }
    })
    console.log(elements)
    fs.writeFile("products.json", JSON.stringify(elements), function (err, result){
        if(err) console.log('erro', err)
    })

    //elements.push({"name": "Tony", "age": "99"})

    res.send('tested')
})

app.post('/elements/', (req, res, next) => {
    elements.push(req.body)
    fs.writeFile("products.json", JSON.stringify(elements), (err, result) => {
        if (err) console.log('Error: ', err)
        console.log(err)
    })
    res.status(201).json({message: "Created! :D"})
})