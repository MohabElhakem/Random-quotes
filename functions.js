const fs = require ('fs').promises;

async function ReadData(FilePath){
    try {
        const data = await fs.readFile (FilePath, "utf-8");
        return JSON.parse(data)
    }catch (err) {
        return []
    }
};

async function AddData(FilePath,data,arr){

    arr.push({id : arr.length+1 , text : data})
    try{
        await fs.writeFile(FilePath, JSON.stringify(arr,null,2),"utf-8");
        console.log("Data Have Been Added ")
        return true
    }catch(err){
        console.log("Error writing file:", err);
        return false
    }

};

//#region My Comment 
//function ReadData (FilePath) {
//   return new Promise((resolve, reject) => {
//        fs.readFile(FilePath,"utf-8")
//        .then (data =>{
//            try {
//                const parsed = JSON.parse(data);
//                resolve(parsed)
//            }
//            catch (parsedErr){
//                resolve([])
//            }
//        })
//        .catch(  err=>{ resolve([]); }  );
//    });
// }
//the same function but with manually adding the promise 
//#endregion

module.exports = {ReadData,AddData}