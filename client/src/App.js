import React, { useState, useEffect } from 'react';

function App() {
  const [rocketTelemetry, setRocketTelemetry] = useState(null);
  const [data, setData] = useState([]);
  const [weather, setWeather] = useState([]);
  
  useEffect(() => {
    if(false){
    // TCP sunucusuna veriyi gönder
    const client = new window.net.Socket();
    client.connect(3000, 'localhost', () => {
      console.log('Connected to TCP server');
    });

    // TCP sunucusundan gelen veriyi dinle
    client.on('data', (data) => {
      console.log('Received from server:', data.toString());
      setRocketTelemetry(data);
      client.end(); // Bağlantıyı kapat
    });
    }else{
      // Backend servisinin URL'i
      var myHeaders = new Headers();
      myHeaders.append("X-API-Key", "API_KEY_1");
      
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch("http://localhost:5000/rockets", requestOptions)
        .then(response => response.json())
        .then(result => {
          setData(result)
        })
        .catch(error => console.log('error', error));

      fetch("http://localhost:5000/weather", requestOptions)
        .then(response => response.json())
        .then(result => {
          setWeather(result)
        })
        .catch(error => console.log('error', error));
      
    }
  }, []); // useEffect sadece bir kere çalışacak şekilde ayarlandı

  if(rocketTelemetry){
    return (
      <div>
        <h1>Roket İzleme</h1>
  
        <h2>Tüm Roketler</h2>
        <table border="1">
          <thead>
            <tr>
              <th>Package Start</th>
              <th>Rocket ID</th>
              <th>package_number</th>
              <th>package_size</th>
              <th>altitude</th>
              <th>speed</th>
              <th>acceleration</th>
              <th>thrust</th>
              <th>temperature</th>
              <th>crc</th>
              <th>delimiter</th>
            </tr>
          </thead>
          <tbody>
            {rocketTelemetry && (
              <tr>
                <td>{rocketTelemetry.package_start}</td>
                <td>{rocketTelemetry.rocket_id}</td>
                <td>{rocketTelemetry.package_number}</td>
                <td>{rocketTelemetry.package_size}</td>
                <td>{rocketTelemetry.altitude}</td>
                <td>{rocketTelemetry.speed}</td>
                <td>{rocketTelemetry.acceleration}</td>
                <td>{rocketTelemetry.thrust}</td>
                <td>{rocketTelemetry.temperature}</td>
                <td>{rocketTelemetry.crc}</td>
                <td>{rocketTelemetry.delimiter}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }else{
    return (
      <div>
        <h1>Roket İzleme</h1>
  
        <h2>Tüm Roketler</h2>
        <table border="1">
          <thead>
            <tr>
              <th>Rocket Name</th>
              <th>Rocket Model</th>
              <th>payload</th>
              <th>payload weight</th>
              <th>altitude</th>
              <th>speed</th>
              <th>acceleration</th>
              <th>thrust</th>
              <th>temperature</th>
              <th>crc</th>
              <th>delimiter</th>
            </tr>
          </thead>
          <tbody>
            {data.map((rocket) =>
              <tr>
                <td>{rocket.id}</td>
                <td>{rocket.model}</td>
                <td>{rocket.payload.description}</td>
                <td>{rocket.payload.weight}</td>weight
                <td>{rocket.status}</td>
                <td>{rocket.altitude}</td>
                <td>{rocket.speed}</td>
                <td>{rocket.acceleration}</td>
                <td>{rocket.thrust}</td>
                <td>{rocket.temperature}</td>
              </tr>
          )}
          </tbody>
        </table>

        <h2>Hava Durumu</h2>
        <table border="1">
          <thead>
            <tr>
              <th>Temperature</th>
              <th>Humidity</th>
              <th>Pressure</th>
            </tr>
          </thead>
          <tbody>
            {
              <tr>
                <td>{weather.temperature}</td>
                <td>{weather.humidity}</td>
                <td>{weather.pressure}</td>
              </tr>
          }
          </tbody>
        </table>
      </div>
    );
  }
  
}

export default App;
