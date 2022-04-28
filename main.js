import fetch, { Headers } from "node-fetch";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const url = "http://localhost:54235/razer/chromasdk";

await fetch(url, {method: "DELETE"});


const data = JSON.stringify(
    {
        "title": "Razer Chroma SDK RESTful Test Application",
        "description": "This is a REST interface test application",
        "author": {
            "name": "Chroma Developer",
            "contact": "www.razerzone.com"
        },
        "device_supported": [
            "headset"
        ],
        "category": "application"
    }
);

console.log(data)
const response = await fetch(
    url,
    {
        method:"POST",
        body: data,
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
    }
);
const json = await response.json();
console.log(json);

const apiUrl = json.uri;

console.log(apiUrl);

await delay(1500);

const response2 = await fetch(
    apiUrl + "/headset",
    {
        method:"POST",
        body: JSON.stringify(
            {
                "effect": "CHROMA_STATIC",
                "param": {
                    "color": 120
                },
            }
        ),
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
    }
);
const json2 = await response2.json();
console.log(json2);

await delay(1000);
await fetch(url, {method: "DELETE"});
