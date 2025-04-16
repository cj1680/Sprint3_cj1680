import './Geometry.css';
import React, { useState } from 'react';
import { FileButton, Button } from '@mantine/core';
import History from '../History/History.jsx';

export default function Geometry({token}) {
  const [image, setImage] = useState();
  const [response, setResponse] = useState();
  const [isNewChat, setIsNewChat] = useState(true);


  const handleImageChange = async (file) => {
    if (file) {
      const objectURL = URL.createObjectURL(file);
      setImage(objectURL);

      const formData = new FormData();
      formData.append('image', file);
      formData.append('token', token);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/geometry/`, {
          method: "POST",
          body: formData
        });
        const data = await response.json();
        setResponse(data.response);
      } catch (error) {
        setResponse('Failure');
      }

    } else {
      console.error('No file selected');
    }
  };

  return (
    <>
      <h2>Geometry:</h2>
      {isNewChat ? (
        <>
          <div className='butt'>
          {token && <Button onClick={() => setIsNewChat(false)} variant="filled" color="rgba(0, 0, 0, 1)">History</Button>}
            <FileButton onChange={handleImageChange} accept="image/png,image/jpeg,image/jpg" style={{ backgroundColor: 'black', color: 'white' }}>
                {(props) => <Button {...props}>Upload image</Button>}
            </FileButton>
          </div>
          <img src={image} style={{ marginTop: '75px' }}></img>
          <p>{response}</p>
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', top: '70px' }}>
          <Button onClick={() => setIsNewChat(true)} variant="filled" color="rgba(0, 0, 0, 1)">New Chat</Button>
          <History branch={'geometry'} token={token} setIsNewChat={setIsNewChat} setImage={setImage} setResponse={setResponse}/>
        </div>
      )}
    </>
  );
}
