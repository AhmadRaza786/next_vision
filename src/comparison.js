const sort = require('./sort');
const flat = require('flat');
const _ = require('lodash');
var objectPath = require("object-path")

isObject = (obj) => {
    return typeof obj === "object" && obj.length === undefined;
}
const premitiveTypes = ['number', 'string', 'date'];

const sortArrayOfObjects = (obj) => {
    if(!Array.isArray(obj)) return obj;
    if(obj.length > 1 && isObject(obj[0])){
        let keys = Object.keys(obj[0]);
        let selectedKey = keys.find(key => {
            return (obj[0][key] && premitiveTypes.indexOf(typeof obj[0][key] !== -1));
        })
        return sort(obj,typeof obj[0][selectedKey], [selectedKey]);
    }
    if(obj.length > 1 && premitiveTypes.indexOf(typeof obj[0]) !== -1){
        return sort(obj, typeof obj[0])
    }
};

const sortArraysInObject = (obj) => {
    let sorted = [];
    let flatten = flat(obj);
    for(let i in flatten){
        let repets = i.split('.1.');
        if(repets.length > 1){
            repets.forEach((r, index) => {
                if(repets[index+1] && sorted.indexOf(r) === -1){
                    let {result} = getObjectData(r, obj);
                    result = sortArrayOfObjects(result);
                    objectPath.set(obj, r, result);
                    sorted.push(r);
                }
            })
        }  
    }    
    return obj;
}

const getObjectData = (path, obj) => {
    let temp = obj;
    let splitted = path.split('.');
    splitted = _.compact(splitted);
    splitted.forEach(p =>{
        temp = temp[p];
    })
    
    return {result: temp};
}

const compare = (obj1, obj2) => {
    const _obj1 = sortArraysInObject(obj1);
    const _obj2 = sortArraysInObject(obj2);
    return _.isEqual(_obj1, _obj2);
}

module.exports = {
    compare,
    sortArraysInObject,
    sortArrayOfObjects
}