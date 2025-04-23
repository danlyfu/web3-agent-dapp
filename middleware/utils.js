
//function used to read json file 
const fs = require("fs");
const path = require("path");

const readJSON = (file) => {
    try {
        const raw = fs.readFileSync(path.join(__dirname,file));
        return JSON.parse(raw);
    } catch{
        return {};
    }
};

const writeJSON = (file,data) => {
    fs.writeFileSync(path.join(__dirname,file), JSON.stringify(data, null, 2));
};


module.exports = { readJSON, writeJSON };