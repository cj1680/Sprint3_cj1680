import { useState, useEffect } from 'react'
import './App.css'
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { Tabs } from '@mantine/core';
import Graph from '../Graph/Graph.jsx';
import Geometry from '../Geometry/Geometry.jsx';
import Algebra from '../Algebra/Algebra.jsx';

export default function App() {
  const [test, setTest] = useState(); // Contains response from backend
  const [activeTab, setActiveTab] = useState(); // Gives state changes for menu

  useEffect(() => { // Runs when the site is loaded
    fetch('http://localhost:5000/test/') // Tests backend communication
      .then(response => response.json())
      .then(data => setTest(data))
      .catch(error => setTest('Failure'));

  }, [])

  return (
    <MantineProvider>
      <h1>Backend Communication: {test}</h1>
      <Tabs value={activeTab} onChange={setActiveTab}>
      <Tabs.List>
        <Tabs.Tab value="graph">Graphs</Tabs.Tab>
        <Tabs.Tab value="geometry">Geometry</Tabs.Tab>
        <Tabs.Tab value="algebra">Algebra</Tabs.Tab>
      </Tabs.List>
    </Tabs>

      {activeTab === "graph" && <Graph />}
      {activeTab === "geometry" && <Geometry />}
      {activeTab === "algebra" && <Algebra />}
    </MantineProvider>
  )
}