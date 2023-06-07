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