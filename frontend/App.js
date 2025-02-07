import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';

export default function App() {
  const [test, setTest] = useState(); // Contains response from backend

  useEffect(() => { // Runs when the site is loaded
    fetch('http://localhost:5000/test') // Tests backend communication
      .then(response => response.json())
      .then(data => setTest(data))
      .catch(error => setTest('Failure'));

  }, [])

  return (
    <View style={styles.container}>
      <Text>Backend Communication: {test}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
