const path = require("path");
const express = require("express");
const handlebars = require("handlebars");
const { unflatten } = require("flat");
const router = express.Router();
const app = express();
app.use(express.json());
app.use("/assets", express.static(__dirname+"/static"));
router.get("/", (req, res) => {
    res.sendFile(path.resolve("views/index.html"));
});
router.post("/", (req, res) => {
    const { techy } = unflatten(req.body);
    if (techy.name.includes("Albert") || techy.name.includes("Safi") || techy.name.includes("Thomas")) {
        return res.json({
            "response": handlebars.compile("Hello {{user}}, thanks for sharing that with us...")({ user: "guest" })
        });
    } else {
        return res.json({
            "response" : "Please give us your favorite AST techy..."
        });
    }
});

app.use(router);

const srv = app.listen(8888, ()=>{
    console.log("I am up!!!");
});