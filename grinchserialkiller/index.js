const express = require("express");
const ser = require("node-serialize");
const cp = require("cookie-parser");
const app = express();
const fs = require("fs");
const path = require("path");
const datastr = fs.readFileSync(path.join(__dirname, "data.json")).toString();
const data = ser.unserialize(datastr);
let username = "Nobody";

const cluster = require("cluster");
const totalCPUs = require("os").cpus().length;
if (cluster.isMaster) {
    console.log(`Number of CPUs is ${totalCPUs}`);
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < totalCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        console.log("Let's fork another worker!");
        cluster.fork();
    });
} else {
    app.use(cp());
    app.use((req, res, next) => {
        console.log(req);
        next();
    });
    app.use("/img", express.static(path.join(__dirname, "img")));
    app.set("views", "./views");
    app.set("view engine", "pug");
    app.get("/", (req, res) => {
        let user = username;
        if (req.cookies.package) {
            try {
                var str = new Buffer(req.cookies.package, "base64").toString();
                var obj = ser.unserialize(str);
                if (obj.username) {
                    user = obj.username;
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            res.cookie("package", "eyJ1c2VybmFtZSI6InNhbnRhIiwiY291bnRyeSI6Im5vcnRocG9sZSIsImNpdHkiOiJlbGZ2aWxsZSJ9", {
                maxAge: 90000,
                httpOnly: true
            });
        }
        res.render("index", {
            suspects: data,
            username: user
        });
    });

    app.listen(7331, () => {
        console.log("Up on 7331!");
    });
}