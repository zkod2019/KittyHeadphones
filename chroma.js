export const BASE_URL = "http://localhost:54235/razer/chromasdk";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const intervalWorker = new Worker("/worker.js");

export class Chroma {
  constructor() {
    this.appInfo = {
      title: "Foo",
      description: "Bar",
      author: {
        name: "Chroma Developer",
        contact: "www.razerzone.com",
      },
      device_supported: [
        "keyboard",
        "mouse",
        "headset",
        "mousepad",
        "keypad",
        "chromalink",
      ],
      category: "application",
    };
  }

  async init() {
    const response = await fetch(BASE_URL, {
      method: "POST",
      body: JSON.stringify(this.appInfo),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });
    const json = await response.json();

    await delay(2000);
    console.log(json);

    this.url = json.uri;
    intervalWorker.onmessage = () => {
      console.log("heatbeat");
      fetch(this.url + "/heartbeat", { method: "PUT" });
    };
  }

  async deinit() {
    await fetch(BASE_URL, { method: "DELETE" });
    intervalWorker.onmessage = null;
  }

  async static(blue, green, red) {
    let color = blue;
    color = (color << 8) + green;
    color = (color << 8) + red;

    const response = await fetch(this.url + "/chromalink", {
      method: "PUT",
      body: JSON.stringify({
        effect: "CHROMA_STATIC",
        param: {
          color,
        },
      }),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });
    const responseJson = await response.json();
    console.log(responseJson);
    return responseJson;
  }

  async off() {
    const response = await fetch(this.url + "/chromalink", {
      method: "PUT",
      body: JSON.stringify({
        effect: "CHROMA_NONE",
      }),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });
    const responseJson = await response.json();
    console.log(responseJson);
    return responseJson;
  }
}
