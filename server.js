const http = require ("http");
// import all the build in http module
const fs = require ("fs");
// import the module to read the json file 
const use = require('./functions') 


//all the endpoints ans server requests ans responses will be in the (req,res) function
const server = http.createServer((req,res)=>{
    const method = req.method;
    const url = req.url;
    // to type a less few word everytime nothing more

    // Home page
    if (method === "GET" && url === "/"){
        res.writeHead(200,{"Content-Type": "text/plain"});
        res.end("This is the Homepage, HELLO....");
    }
    
    // Get All Quotes
    else if (method === "GET" && url === "/quotes") {
    (async () => {
     try {
       const data = await use.ReadData('./quotes.json');
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
        } catch (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error Reading Quotes.");
        }
    })();
    }
    
//#region
           /* fs.readFile("./quotes.json","utf-8",(err,data)=>{
            if(err){
                res.writeHead(500, {"Content-Type" : "text/plain"});
                res.end("Error Reading Qouets.");
            }else{
                res.writeHead(200,{"Content-Type" : "application/json"});
                res.end(data);
            }
        });
    }*/
//#endregion
    // Show a Quote
    else if (method==="GET" && url === "/R_quote"){
        (async ()=>{
            let arr = await use.ReadData("./quotes.json");
            let R_Q = await use.RandomQuote("./used_id.json",arr);
            if (R_Q === false) {
                res.writeHead(500,{"content-type": "text/plain"});
                return res.end("Error fetching your quote");
            }
            res.writeHead(200,{"content-type": "text/plain"});
            return res.end(R_Q.text);

        })();
    }

    // Add a Quote
    else if (method === "POST" && url === "/add_quote"){
        let body = "";
        req.on("data",chunck => {body += chunck});
        req.on("end",async ()=> {
            try {
                let arr = await use.ReadData('./quotes.json');
                const result = await use.AddData('./quotes.json',body,arr);
                if (result){
                    res.writeHead( 201 , {"Content-Type" : "text/plain"});
                    res.end("Check For Your Quote in The Qoutes");
                }else{
                    res.writeHead(500,{"content-type": "text/plain"});
                    res.end("Could Not Write Data")
                }

            }catch {
                res.writeHead(400,{"Content-Type" : "text/plain"});
                res.end("Invalid Data Format.....")
            }
        });
    }
//#region
//the let body is because the data will be transimited one by one
//you make an event to start taking the data
//and another to process in it you can write what you will do with it in req.on("end",.....)
//you used promises so the server won't block the clints untill the procces ends
// the user need to but the qoute without "......."
//#endregion

    // Delete Route
    else if (method === "DELETE" && url.startsWith("/deleteQ")){
        const idToDelete = parseInt(url.split("Q")[1]);
        //check for a bad or invalid id
        if(isNaN(idToDelete)){
            res.writeHead(400,{"content-type": "text/plain"});
            return res.end("Ivalid id");
        }

       ( async ()=> {
            let arr = await use.ReadData("./quotes.json");
            let HasId = arr.some(obj => obj.id === idToDelete) ;
            if (!HasId){
                res.writeHead(404,{"content-type": "text/plain"})
                return res.end("Quote not found.")
            }
            let newData = arr.filter( q => q.id !== idToDelete);
            let NewQuotes = await use.UpdateData("./quotes.json",newData);
            if (NewQuotes){
                res.writeHead(200,{"content-type": "text/plain"});
                return res.end ("Quote Have Been Deleted..");
            }else{
                 res.writeHead(500,{"content-type": "text/plain"});
                return res.end ("There was an Error While Deleting the Quote");
            }
        })();
    // ading the deletion of the id in the used_id file
       ( async ()=>{

        let arr = await use.ReadData("./used_id.json");
        // use condetion to check if the quote is not used
        let condition = arr.includes(idToDelete);
        if (!condition){
            return console.log("not in the used file ...");
        }
        //use a condetion to make sure that the new used data is saved shows  in the terminal
        let NEW_used = arr.filter(num => num !== idToDelete);
        let Update_NEW_used = await use.UpdateData("./used_id.json",NEW_used);
        if (Update_NEW_used){ return console.log("New used id have been updated");}
        else {
             res.writeHead(500,{"content-type": "text/plain"});
            return res.end ("There was an Error While Deleting the Quote id from The Used Id data");
        }
            
        }) ();
        
    }
//#region
// filter to delete the object
//use arr.some to check if the object with that id is available
//HasId is eather true or false
//the function updateData turns back true or false and the data saving is side effect
//the (async ()=>{......}) (); is called IIFE and you made it because the need of using await
//if(isNaN(value)) checks if the value is number or not 
//#endregion

    // Unkowen route
    else{
        res.writeHead(404,{"Content-Type": "text/plain"});
        res.end("Route Not Found.");
    }
});
//tell the server to start and listen for requests on port 3000
server.listen(3000,()=>{
    console.log("listen on http://localhost:3000")
});