var fs = require('fs');
// json file with the data
var data = fs.readFileSync('products.json');
  
var elements = JSON.parse(data);
const express = require("express");
const app = express();
  
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
  