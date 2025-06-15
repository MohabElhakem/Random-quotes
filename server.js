const http = require ("http");
// import all the build in http module
const fs = require ("fs");
// import the module to read the json file 


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
    
    // Get All Qoutes
    else if (method === "GET" && url === "/qoutes" ){
        fs.readFile("./qoutes.json","utf-8",(err,data)=>{
            if(err){
                res.writeHead(500, {"Content-Type" : "text/plain"});
                res.end("Error Reading Qouets.");
            }else{
                res.writeHead(200,{"Content-Type" : "application/json"});
                res.end(data);
            }
        });
    }

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