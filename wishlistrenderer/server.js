const express = require("express");
const app = express();
const path = require('path');
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
const {exec} = require("child_process");
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, "static")));

//app.get("/",(req, res)=>res.send("Hello!"));
app.post("/wishlist", (req, res)=>{
    var src = req.body.wishlist;
    var tempname = `${uuidv4()}.md`;
    var temphtml = `${uuidv4()}.html`;
    fs.writeFileSync(tempname, src);
    var cmd = `multimarkdown -o ${temphtml} ./${tempname}`;
    exec(cmd, (err, stdout, stderr)=>{
        if(err){
            console.log(err);
        }
        if(stderr){
            console.log(stderr);
        }
        console.log(stdout);
        var html = fs.readFileSync(temphtml);
        fs.unlinkSync(tempname);
        fs.unlinkSync(temphtml);
        res.send(html.toString());
    });
});
app.listen(8888,"0.0.0.0", ()=>{
    console.log("Listening on port 8888");
});