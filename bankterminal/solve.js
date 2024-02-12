const net = require("net");
const client = new net.Socket();
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
client.connect(1337, "localhost", function(a){
    console.log("connected");
});
client.on("data", (data)=>{
    console.log(data.toString("utf8"));
    readline.question(">", (input)=>{
        client.write(input+"\n");
    });
});
process.on("exit", ()=>{
    client.destroy();
});
