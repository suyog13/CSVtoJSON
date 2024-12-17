const model = require('../config/seqConfig')
const users = model.users
const sequelize = require('sequelize');
var fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {

bulkUploadUsers(req,res) {
    try{
        //Reading CSV file
        fs.readFile(process.env.FILE_PATH,"utf-8",function(err,data){
            if(err){
                res.status(400).send({"status":"Failure","message":"Something went wrong!","error":err.message})
            }
            
            let csvData = data.split(/\r?\n/);
            let temp = csvData.splice(0,1);   // Removing 1st row as it contains column names
            //Creating Object as per columns mentioned
            let keyArray = [];
            temp.toString().split(",").forEach(element =>{
                keyArray.push(element.trim())
            })

            //Creating JSON Object
            
            let jsonArray = [];
            csvData.forEach(element=>{
                var object = {};
                element.toString().split(",").forEach((element1,index) =>{
                    if(keyArray[index].includes(".") === true){
                        let keys = keyArray[index].toString().split(".");
                        assign(object, keys, element1);
                    } else {
                        object[keyArray[index]] = keyArray[index] == "age"? Number(element1) :   element1.trim();
                    }
                })
                jsonArray.push(object);
            })
            
            jsonArray.forEach(async dataRow => {
                let additional_value = {};
                for(let key of Object.keys(dataRow)){
                    if(key == "name" || key == "age" || key == "address"){
                        continue
                    } else {
                        additional_value[key] = dataRow[key];
                    }
                }
                const data = {
                    "name":dataRow.name.firstName+ " "+dataRow.name.lastName,
                    "age":dataRow.age,
                    "address":dataRow.address,
                    "additional_info":additional_value
                }
                console.log(data)
                await users.create(data).catch(err=>{
                    console.log(err.message)
                    res.status(200).send({"status":"Failed","message":"Something went wrong!","error":err.message})
                })
            })
            res.status(200).send({"status":"Success","message":"Success!","data":jsonArray})
        })
        } catch (error) {
            res.status(200).send({"status":"Failed","message":"Something went wrong!","error":error.message})
        }
    }  
}

function assign(obj, keyPath, value) {
    lastKeyIndex = keyPath.length-1;
    for (var i = 0; i < lastKeyIndex; ++ i) {
      key = keyPath[i];
      if (!(key in obj)){
        obj[key] = {}
      }
      obj = obj[key];
    }
    obj[keyPath[lastKeyIndex]] = value;
 }