export const BASE_URL = "http://localhost:54235/razer/chromasdk";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export class Chroma {
    constructor() {
        this.appInfo = {
            "title": "Foo",
            "description": "Bar",
            "author": {
                "name": "Chroma Developer",
                "contact": "www.razerzone.com"
            },
            "device_supported": [
                "keyboard",
                "mouse",
                "headset",
                "mousepad",
                "keypad",
                "chromalink"
            ],
            "category": "application"
        };
    }

    async init() {
        const response = await fetch(
            BASE_URL,
            {
                method:"POST",
                body: JSON.stringify(this.appInfo),
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
            }
        );
        const json = await response.json();

        await delay(1500);

        this.url = json.uri;
        this.heartBeatInterval = setInterval(() => {
            fetch(this.url + '/heartbeat', {method: 'PUT'});
        }, 1000);
    }

    async deinit() {
        await fetch(BASE_URL, {method: "DELETE"});
        clearInterval(this.heartBeatInterval);
    }

    async static(red, green, blue) {
        let color = red;
        color = (color << 8) + green;
        color = (color << 8) + blue;

        const response = await fetch(
            this.url + "/chromalink",
            {
                method:"PUT",
                body: JSON.stringify({
                    effect: "CHROMA_STATIC",
                    param: {
                        color,
                    }
                }),
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
            }
        );
        const responseJson = await response.json();
        console.log(responseJson)
        return responseJson;
    }

    async off() {
        const response = await fetch(
            this.url + "/chromalink",
            {
                method:"PUT",
                body: JSON.stringify({
                    effect: "CHROMA_NONE",
                }),
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
            }
        );
        const responseJson = await response.json();
        console.log(responseJson)
        return responseJson;
    }
}
