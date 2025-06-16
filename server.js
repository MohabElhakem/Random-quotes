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

    // Add a qoute
    else if (method === "POST" && url === "/add_qoute"){
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