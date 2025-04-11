import { useState, useEffect } from 'react'
import './App.css'
import '@mantine/core/styles.css';
import { MantineProvider, Center, Tabs } from '@mantine/core';
import Auth from '../Auth/Auth.jsx';
import Graph from '../Graph/Graph.jsx';
import Geometry from '../Geometry/Geometry.jsx';
import Algebra from '../Algebra/Algebra.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState();
  const [token, setToken] = useState('');

  useEffect(() => {
    const checkToken = async () => {
      const savedToken = localStorage.getItem('mathsterToken');
      setToken(savedToken);
      if (savedToken){
        const response = await fetch(`${import.meta.env.VITE_API_URL}/login_token/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ token: savedToken })
        });
      
        const data = await response.json();
        if (!data.valid) {
          setToken('');
          localStorage.removeItem('mathsterToken');
        }
      }
    };
  
    checkToken();
  }, []);
  

  const signOut = () => {
    setToken('');
    localStorage.setItem('mathsterToken', '');
  }
 
  return (
    <>
      <MantineProvider>
        <div>
          <h1>Mathster</h1>
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
                {!token ? <Tabs.Tab value="Sign In">Sign In</Tabs.Tab> : <Tabs.Tab value="Sign Out" onClick={signOut}>Sign Out</Tabs.Tab>}
              </div>
            </Tabs.List>
          </Tabs>
        </div>
        <div>
          {activeTab === "graph" && <Graph token={token} />}
          {activeTab === "geometry" && <Geometry token={token} />}
          {activeTab === "algebra" && <Algebra token={token} />}
        </div>
        <Center>{activeTab === "Sign In" && !token && <Auth setToken={setToken}/>}</Center>
        
      </MantineProvider>
    </>
  )
}
