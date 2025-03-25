import { useState } from 'react'
import './App.css'
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { Tabs } from '@mantine/core';
import Graph from '../Graph/Graph.jsx';
import Geometry from '../Geometry/Geometry.jsx';
import Algebra from '../Algebra/Algebra.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState();
 
  return (
    <>
      <MantineProvider>
      <div>
          <h1>MATHSTER</h1>
        </div>
      <div className='tab'>
        <Tabs value={activeTab} onChange={setActiveTab} allowTabDeactivation >
          <Tabs.List justify="center">
            <Tabs.Tab value="graph">Graphs</Tabs.Tab>
            <Tabs.Tab value="geometry">Geometry</Tabs.Tab>
            <Tabs.Tab value="algebra">Algebra</Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </div>
        <div>
          {activeTab === "graph" && <Graph />}
          {activeTab === "geometry" && <Geometry />}
          {activeTab === "algebra" && <Algebra />}
        </div>
      </MantineProvider>
    </>
  )
}
