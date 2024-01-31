document.getElementById("sender").addEventListener("submit", e => {
	e.preventDefault();
    fetch("/", {
        method: "POST",
        body: JSON.stringify({
            "techy.name" : document.querySelector("input[type=text").value
        }),
        headers: {"Content-Type": "application/json"}
    }).then(resp=>{
        return resp.json();
    }).then(data=>{
        document.getElementById("response").innerHTML = data.response;
    });
});