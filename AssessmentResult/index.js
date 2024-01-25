const express = require("express");
const net = require("net");
const cors = require("cors");
const WebSocket = require("ws");

const app = express();

app.use(cors());

const server = new WebSocket.Server({ port: 3000 });

function parseFloat(first, second, third, fourth) {
  // Örnek bellek adresleri
  const memory = [first, second, third, fourth];
  // Buffer kullanarak 4 bayttan oluşan bellek adresini float'a dönüştür
  const buffer = Buffer.from(memory);
  const floatValue = buffer.readFloatBE(0); //Big Endian
  return floatValue;
}

// TCP istemcisini oluştur
const client = net.createConnection({ host: "localhost", port: 4000 }, (e) => {
  console.log(`Connected to TCP server at localhost:4000`);
});
// Bağlantı sonlandığında
client.on("end", () => {
  console.log("Disconnected from TCP server");
});

// Hata durumunda
client.on("error", (err) => {
  console.error("TCP connection error:", err);
});

// Uygulama kapatıldığında bağlantıyı sonlandır
process.on("SIGINT", () => {
  client.end();
  process.exit();
});

// TCP sunucusundan gelen veriyi dinle
client.on("data", (data) => {
  server.on("connection", (socket) => {
    console.log("Client connected");
    var id;
    var altitude;
    var package_start_byte = data[0];
    var package_number = data[11];
    var package_size = data[12];

    // Rocket Id
    for (var i = 1; i <= 10; i++) {
      let buf = Buffer.from(data[i].toString(16), "hex");
      if (id) {
        id = id + buf.toString("utf8");
      } else {
        id = buf.toString("utf8");
      }
    }

    // Altitude
    for (var i = 1; i <= 10; i++) {
      let bufAltitude = Buffer.from(data[i].toString(16), "hex");
      if (id) {
        altitude = altitude + bufAltitude.toString("utf8");
      } else {
        altitude = bufAltitude.toString("utf8");
      }
    }

    var data1 = data[13];
    var data2 = data[14];
    var data3 = data[15];
    var data4 = data[16];
    var altitude = parseFloat(data1, data2, data3, data4);

    var data1 = data[17];
    var data2 = data[18];
    var data3 = data[19];
    var data4 = data[20];
    var speed = parseFloat(data1, data2, data3, data4);

    var data1 = data[21];
    var data2 = data[22];
    var data3 = data[23];
    var data4 = data[24];
    var acceleration = parseFloat(data1, data2, data3, data4);

    var data1 = data[25];
    var data2 = data[26];
    var data3 = data[27];
    var data4 = data[28];
    var thrust = parseFloat(data1, data2, data3, data4);

    var data1 = data[29];
    var data2 = data[30];
    var data3 = data[31];
    var data4 = data[32];
    var temperature = parseFloat(data1, data2, data3, data4);

    var crc = data[33];
    var delimiter = data[12];

    var rocket_telemetry = {
      package_start: package_start_byte,
      rocket_id: id,
      package_number: package_number,
      package_size: package_size,
      altitude: altitude,
      speed: speed,
      acceleration: acceleration,
      thrust: thrust,
      temperature: temperature,
      crc: crc,
      delimiter: delimiter,
    };
    console.log(rocket_telemetry);
    socket.write('Server received your message: ' + rocket_telemetry);
  });
});

app.listen(8000, () => {
  console.log(`Server is running at http://localhost:6000`);
});
