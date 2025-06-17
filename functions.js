const { readFile } = require('fs');

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
    let maxId = arr.reduce((max,idnow)=> {
       return idnow.id > max ? idnow.id : max ;
    },0);
    arr.push({id : maxId+1 , text : data})
    try{
        await fs.writeFile(FilePath, JSON.stringify(arr,null,2),"utf-8");
        console.log("Data Have Been Added ")
        return true
    }catch(err){
        console.log("Error Saving The Data:", err);
        return false
    }

};
//#region AddData
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
//
//the reduce in the first couple of line is for fixing the bug of creating ->
//-> a new object with the same id 
//#endregion

async function UpdateData(FilePath,arr){
    try {
        await fs.writeFile(FilePath,JSON.stringify(arr,null,2),"utf-8");
        console.log("Data Have Been Updated");
        return true;
    }catch(err){
        console.log("Error Updating The Data....");
        return false;
    }
}
//#region UpdateData
//the function is for updating the data at this point so i dont need to write the same code
// mostly for the use with delte 
// it may have other uses in the future
//it is async to wait for the file to finish writing and can catch the error
//doesn't block the main thread
//#endregion

async function RandomQuote(Used_Id_FilePath,arr){
  try{ let used = await ReadData(Used_Id_FilePath);
        if ( used.length === arr.length ){ used = [] };
        let random;
        let HasId = false;
        do{
         random = arr[Math.floor( Math.random()* arr.length )];
         //HasId = used.some(num => num === random.id);
         HasId = used.includes(random.id);
         //use include since its a quick check of primitiv value (string,numbers,boolen)
        }while (HasId);
         //makw sure to push the id not the whole object
        used.push(random.id);
        await UpdateData(Used_Id_FilePath,used);
        console.log("The id have been moved to used_id ");
        return random ;
    }catch(err){
        console.log("Couldn't git the quote");
        return false;
    }
    
}
//#region RandomQuote
// the function for getting a rando quote from a json file
// it check for all condetions and empty the used file if all the ->
// -> quotes have been used before
//you can devlop it by making it takes two file pathes and process both of them -> 
// -> so there will be no need to do it inside the server
//random is the actual object not the index 
// the function can gives you a an object if right 
// and a faulse if not
//#endregion

module.exports = {ReadData,AddData,UpdateData,RandomQuote}