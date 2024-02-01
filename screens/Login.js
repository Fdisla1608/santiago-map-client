import { StyleSheet, Text, View, Button, TextInput, Alert } from "react-native";
import { useState } from "react";
import axios from "axios";

export default function Login({ navigation }) {
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const pressHandle = async () => {
    axios
      .post(`http://maptest.ddns.net:3001/api/user/login`, {
        userName: userName,
        userPassword: userPassword,
      })
      .then(async (res) => {
        if (res.data.statusCode == 200) {
          await navigation.navigate("Profile", res.data.data);
        } else {
          Alert.alert("Invalid Username/Password");
        }
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Usuario</Text>
      <TextInput
        style={styles.input}
        onChangeText={setUserName}
        placeholder="Usuario"
      />
      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        onChangeText={setUserPassword}
        placeholder="password"
        textContentType="password"
        secureTextEntry={true}
      />
      <Button title="Login" style={styles.button} onPress={pressHandle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  label: {
    textAlign: "center",
    fontSize: 18,
  },
  input: {
    height: 40,
    width: "75%",
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    backgroundColor: "#0B7DEE",
    color: "#FFFFFF",
    width: "40%",
  },
});
