import { useState, useEffect } from 'react'
import './App.css'
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { Card, Overlay, Text } from '@mantine/core';
import classes from './ImageActionBanner.module.css';

function App() {
  const [test, setTest] = useState(); // Contains response from backend

  useEffect(() => { // Runs when the site is loaded
    fetch('http://localhost:5000/test') // Tests backend communication
      .then(response => response.json())
      .then(data => setTest(data))
      .catch(error => setTest('Failure'));

  }, [])

  return (
    <MantineProvider>
      <h1>Backend Communication: {test}</h1>

      <Card radius="md" className={classes.card}>
      <Overlay className={classes.overlay} opacity={0.55} zIndex={0} />

      <div className={classes.content}>
        <Text size="lg" fw={700} className={classes.title}>
          This is a Mantine UI Component
        </Text>
      </div>
    </Card>
    </MantineProvider>
  )
}

export default App
