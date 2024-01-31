const math = require("mathjs");
const express = require("express");
const path = require("path");
const flag = "${#N3V3R_7RU5T_L|B5_743Y_@R3_3V|7}";
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "static")));
app.post("/evaluate",(req,res)=>{
    if(!req.body.exp){
        res.status(400).json({"error":"You need to send the expression as the exp query parameter..."});
    }
    try{
        let result = math.eval(req.body.exp);
        res.status(200).json({"result": result});
    } catch(error){
        res.status(400).json({"error":error});
    }
});

app.listen(80, ()=>{
    console.log("Up!");
});