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
//#region
//the function is for updating the data at this point so i dont need to write the same code
// mostly for the use with delte 
// it may have other uses in the future
//it is async to wait for the file to finish writing and can catch the error
//doesn't block the main thread
//#endregion

module.exports = {ReadData,AddData,UpdateData}