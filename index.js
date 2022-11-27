const http = require("http");
const fs = require("fs");
var requests = require("requests");
// here basically we need to extract the complete file from the html file to the node js for using the routers and then to display the same file from the node js
const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
  return temperature;
};

const server = http.createServer((req, res) => {
  // we have used streams topic here
  if (req.url == "/") {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=Hyderabad&appid=1014d3e8cfa0e2a917f99d589819129e"
    )
      .on("data", (chunk) => {
        const objData = JSON.parse(chunk);
        const arrData = [objData];
        //converting the data to obj and then to array
        //console.log(arrData[0].main.temp);
        //we are replacing the read data from the file with the original data
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        //join is used to convert the data to string format
        res.write(realTimeData);
        console.log(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to error", err);
        res.end();
      });
  } else {
    res.end("File not found");
  }
});

server.listen(8000, "127.0.0.1");
