import { useState } from 'react'
import './App.css'
import '@mantine/core/styles.css';
import { MantineProvider, Center, Tabs } from '@mantine/core';
import Auth from '../Auth/Auth.jsx';
import Graph from '../Graph/Graph.jsx';
import Geometry from '../Geometry/Geometry.jsx';
import Algebra from '../Algebra/Algebra.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState();
  const [signedIn, setSignedIn] = useState(false);
 
  return (
    <>
      <MantineProvider>
        <div>
          <h1>MATHSTER</h1>
        </div>
        <div className='tab'>
          <Tabs value={activeTab} onChange={setActiveTab} allowTabDeactivation>
            <Tabs.List style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <div style={{ flex: 1 }} />
              <div style={{ display: 'flex', gap: '16px' }}>
                <Tabs.Tab value="graph" aria-label="Graphs">Graphs</Tabs.Tab>
                <Tabs.Tab value="geometry">Geometry</Tabs.Tab>
                <Tabs.Tab value="algebra">Algebra</Tabs.Tab>
              </div>
              <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                {!signedIn ? <Tabs.Tab value="Sign In">Sign In</Tabs.Tab> : <Tabs.Tab value="Sign Out" onClick={() => {setSignedIn(false)}}>Sign Out</Tabs.Tab>}
              </div>
            </Tabs.List>
          </Tabs>
        </div>
        <div>
          {activeTab === "graph" && <Graph />}
          {activeTab === "geometry" && <Geometry />}
          {activeTab === "algebra" && <Algebra />}
        </div>
        <Center>{activeTab === "Sign In" && !signedIn && <Auth setSignedIn={setSignedIn}/>}</Center>
        
      </MantineProvider>
    </>
  )
}
