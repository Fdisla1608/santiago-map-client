import MapView, { Marker, Callout, Polyline } from "react-native-maps";
import { StyleSheet, Text, View, Image, Alert } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import * as Location from "expo-location";
import { Client, Message } from "react-native-paho-mqtt";

export default function Map({ route, navigation }) {
  const [errorMsg, setErrorMsg] = useState(null);
  const [rutas, setRutas] = useState([]);
  const [trucks, setTrucks] = useState([]);

  const [myPosition, setMyPosition] = useState({
    latitude: 19.446253746017018,
    longitude: -70.68483054420817,
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
  client.on("messageReceived", (message) => {
    console.log(message.payloadString);
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

  const showTrucks = () => {
    return trucks.map((item, index) => {
      return (
        <Marker key={index} title={item.ficha} coordinate={item.position}>
          <Image
            source={require("../bus.png")}
            className="marker-img"
            style={{ height: 100, width: 110 }}
          />
          <Callout style={{ width: 200, height: 100 }}>
            <Text>Ficha: {item.ficha}</Text>
            <Text>Placa: {item.placa}</Text>
            <Text>Chofer: {item.chofer}</Text>
            <Text>Asientos Disponibles: {item.asientos_disponibles}</Text>
            <Text>Ruta: {item.ruta}</Text>
          </Callout>
        </Marker>
      );
    });
  };

  useEffect(() => {
    axios
      .get("http://maptest.ddns.net/api/clients")
      .then((response) => {
        // Handle the successful response
        const clients = response.data;
        console.log("List of clients:", clients);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error fetching clients:", error);
      });

    axios.get(`http://10.0.0.73:3001/api/maps/rutas`).then((res) => {
      setRutas(res.data);
    });

    axios.get(`http://10.0.0.73:3001/api/vehicle/list`).then((res) => {
      setTrucks(res.data);
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

    client
      .connect()
      .then(() => {
        // Once a connection has been made, make a subscription and send a message.
        console.log("onConnect");
        return client.subscribe("World");
      })
      .then(() => {
        const message = new Message("Hello");
        message.destinationName = "World";
        client.send(message);
      })
      .catch((responseObject) => {
        if (responseObject.errorCode !== 0) {
          console.log(responseObject);
        }
      });
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
        {rutas && showStopsLocations()}
        {rutas && showRoutes()}
        {trucks && showTrucks()}

        <Marker title="My Position" coordinate={myPosition} pinColor="#1982EC">
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
