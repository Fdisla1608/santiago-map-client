import { StyleSheet, Text, View, Image, Button, TextInput } from "react-native";
import { useState, useEffect } from "react";

export default function ({ navigation }) {
  const [user, setUser] = useState(null);
  const pressHandle = async () => {
    
  };
  const showTarjetas = () => {
    return user.cards.map((item, index) => {
      return (
        <View key={index} style={styles.card}>
          <Text>COD: {item.cod}</Text>
          <Text>Balance: {item.balance}</Text>
        </View>
      );
    });
  };

  useEffect(() => {
    setUser(navigation.state.params);
  }, []);

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.label}>Nombre: {user && user.fullName}</Text>
        <Text style={styles.label}>Usuario: {user && user.userName}</Text>
        <Text style={styles.label}>
          Fecha de Nacimiento: {user && user.birthDate}
        </Text>
      </View>
      <View>{user && showTarjetas()}</View>
      <Button title="Log Out" style={styles.button} onPress={pressHandle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 12,
    borderWidth: 1,
  },
  label: {
    margin: 5,
    padding: 0,
  },
  card: {
    margin: 12,
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
  },
});
