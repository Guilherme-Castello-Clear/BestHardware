const { raw } = require('body-parser');
const { timeStamp } = require('console');
var fs = require('fs');
const path = require('path')

let backupsFolder = path.join(__dirname, '../backups')

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
  
fs.readdir(backupsFolder, (error, files) => {
    if (error) console.log(error)
    files.forEach( (file, i) => {
        let fileDate = getFileDate(file)
        console.log(`${i} | ${file} | ${fileDate}`)
    })

    readline.question('which backup should be restored? ', fileEntranceStr => {
        var fileEntrance = files[parseInt(fileEntranceStr)]
        var filePath = backupsFolder+'/'+fileEntrance
        var bruteFile = fs.readFileSync(filePath)
        var fileElement = JSON.parse(bruteFile)
        fs.writeFileSync(path.join(__dirname, '../products.json'), JSON.stringify(fileElement), (err, result) => {
            console.log(`${__dirname}/../products.json`)
            console.log(result)
        })
        readline.close();
    });
})


function getFileDate(file){
    let fileTimeStamp = file.split('p')[2].split('.json')[0]
    let rawFileDate = new Date(parseInt(fileTimeStamp))
    let formatedFileDate = (`${rawFileDate.getFullYear()}/${rawFileDate.getMonth()}/${rawFileDate.getDay()} | ${rawFileDate.getHours()}:${rawFileDate.getMinutes()}:${rawFileDate.getSeconds()}`)
    
    return formatedFileDate
}