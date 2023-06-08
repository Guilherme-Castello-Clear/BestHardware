const crypto = require('node:crypto');
var fs = require('fs');

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


function getEmail(receivedEmail, users){
    for(var user in users){
        if (users[user].email == receivedEmail){
            console.log(users[user])
            return receivedEmail
        }
    }
    return false
}

function findUser(email, users){
    for(var user in users){
        if(users[user].email == email){
            return user
        }
    }
}

function md5(content) {  
    return crypto.createHash('md5').update(content).digest('hex')
}

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

module.exports = {getIds, lastIds, getEmail, findUser, md5, save}