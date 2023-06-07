var fs = require('fs');
var data = fs.readFileSync('products.json');
var date = new Date().getTime()

createBackup();

function createBackup(){
    fs.writeFile('backups/products-backup'+date+'.json', data, (err, result) => {
        console.log("Backup criado com sucesso!")        
    })
}