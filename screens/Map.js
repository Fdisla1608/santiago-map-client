import MapView, { Marker, Callout, Polyline } from "react-native-maps";
import { StyleSheet, Text, View, Image, Alert } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import * as Location from "expo-location";
import { Client, Message } from "react-native-paho-mqtt";
import { Magnetometer } from "expo-sensors";

export default function Map({ route, navigation }) {
  let mytrucks = [];
  const [errorMsg, setErrorMsg] = useState(null);
  const [rutas, setRutas] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [vehiculos, setVehiculos] = useState({});
  const [angle, setAngle] = useState(0);
  const [subscription, setSubscription] = useState(null);

  const [myPosition, setMyPosition] = useState({
    latitude: 19.446253746017018,
    longitude: -70.68483054420817,
    angle: 90,
  });

  const [truckPosition, setTruckPosition] = useState({
    latitude: 19.446253746017018,
    longitude: -70.68483054420817,
  });

  const myStorage = {
    setItem: (key, item) => {
      myStorage[key] = item;
    },
    getItem: (key) => myStorage[key],
    removeItem: (key) => {
      delete myStorage[key];
    },
  };

  const _subscribe = () => {
    setSubscription(
      Magnetometer.addListener((result) => {
        const radianes = Math.atan2(result.y, result.x);
        let grados = radianes * (180 / Math.PI);
        if (grados < 0) {
          grados += 360;
        }
        setAngle(grados);
      })
    );
  };

  const auth = {
    username: "c7011cf0a33cccaf",
    password: "gzn2WEK5Tj9C2J9AWrlFh22Px6arW71zl66FoecM9AeqFL",
  };

  const client = new Client({
    uri: "ws://maptest.ddns.net:8083/mqtt",
    clientId: "user-" + Math.random().toString(16).substr(2, 8),
    storage: myStorage,
  });

  client.on("connectionLost", (responseObject) => {
    if (responseObject.errorCode !== 0) {
      console.log(responseObject.errorMessage);
    }
  });

  const showStopsLocations = () => {
    return rutas.map((item) => {
      return item.paradas.map((stop, index) => {
        return (
          <Marker
            key={index}
            coordinate={stop.location}
            title={stop.title}
            pinColor={item.colorParadas}
          />
        );
      });
    });
  };

  const showRoutes = () => {
    return rutas.map((item, index) => {
      return (
        <Polyline
          key={index}
          coordinates={item.coordinates}
          strokeColor={item.colorRutas}
          strokeWidth={6}
        />
      );
    });
  };

  useEffect(() => {
    Magnetometer.setUpdateInterval(100);
    client
      .connect()
      .then(() => {
        console.log("onConnect");
        return client.subscribe("mqtt/map");
      })
      .then(() => {
        console.log("client connected");
      })
      .catch((responseObject) => {
        if (responseObject.errorCode !== 0) {
          console.log(responseObject);
        }
      });

    client.on("messageReceived", (message) => {
      const data = JSON.parse(message.payloadString);
      setVehiculos((prevVehiculos) => ({
        ...prevVehiculos,
        [data.ficha]: data,
      }));
    });

    axios
      .get(`http://maptest.ddns.net:18083/api/v5/clients`, {
        auth,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        response.data.data.map((item) => {
        });
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(`http://maptest.ddns.net:3001/api/maps/rutas`)
      .then((res) => {
        setRutas(res.data);
      })
      .catch((error) => {
        console.log(error);
      });

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setMyPosition({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();

    _subscribe();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 19.445930611248922,
          latitudeDelta: 0.01913668226632481,
          longitude: -70.68449295332107,
          longitudeDelta: 0.010869161181560116,
        }}
      >
        {rutas && showRoutes()}
        {rutas && showStopsLocations()}

        {Object.entries(vehiculos).map(([ficha, item]) => (
          <Marker
            key={ficha}
            title={`F-${item.ficha}`}
            coordinate={item.position}
          >
            <Image
              source={require("../bus.png")}
              className="marker-img"
              style={{
                height: 100,
                width: 110,
                transform: [{ rotate: `${item.position.angle}deg` }],
              }}
            />
            <Callout style={{ width: 200, height: 100 }}>
              <Text>Ficha: {item.ficha}</Text>
              <Text>Placa: {item.placa}</Text>
              <Text>Chofer: {item.chofer}</Text>
              <Text>Asientos Disponibles: {item.asientos_disponibles}</Text>
              <Text>Ruta: {item.ruta}</Text>
            </Callout>
          </Marker>
        ))}

        <Marker title="My Position" coordinate={myPosition}>
          <Image
            source={require("../position.png")}
            className="marker-img"
            style={{
              height: 50,
              width: 50,
              transform: [{ rotate: `${angle + 75}deg` }],
            }}
          />
          <Callout style={{ width: 200, height: 100 }}>
            <Text>My Position</Text>
            <Text>lat:</Text>
            <Text>lgn:</Text>
          </Callout>
        </Marker>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
