const model = require('../config/seqConfig')
const users = model.users
const sequelize = model.sequelize;
var fs = require('fs');

const dotenv = require('dotenv');
dotenv.config();

module.exports = {

bulkUploadUsers(req,res) {
    try{
        //Reading CSV file
        fs.readFile(process.env.FILE_PATH,"utf-8",async function(err,data){
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

            //Creating JSON Object as per document
            
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


            //Creating object to store in database
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
                 //Save records in Database
                await users.create(data).catch(err=>{
                    console.log(err.message)
                    res.status(200).send({"status":"Failed","message":"Something went wrong!","error":err.message})
                })
            })

            //Custom query to get Age Distribution
            const counts = await sequelize.query(`select 
                (undertwenty/total::float)*100 Under_20,
                (twentytoforty/total::float)*100 Twenty_to_Fourty,
                (fourtytosixty/total::float)*100 Fourty_to_sixty,
                (abovesixty/total::float)*100 Above_20
            from (
             SELECT count(*) total,
                     SUM(CASE WHEN age < 20 THEN 1 ELSE 0 END) AS undertwenty,
                    SUM(CASE WHEN age BETWEEN 20 AND 40 THEN 1 ELSE 0 END) AS twentytoforty,
                    SUM(CASE WHEN age BETWEEN 40 AND 60 THEN 1 ELSE 0 END) AS fourtytosixty,
                    SUM(CASE WHEN age >60 THEN 1 ELSE 0 END) AS abovesixty
             FROM users
             ) x;`)
            console.log(counts[0][0]) //TO print on console the Age distribution result
            res.status(200).send({"status":"Success","message":"Success!","data":counts[0][0]})
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