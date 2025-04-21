import './Branch_Layout.css';
import React, { useState, useEffect, useRef  } from 'react';
import { FileButton, Button } from '@mantine/core';
import { useSpeechSynthesis } from 'react-speech-kit';
import History from '../History/History.jsx';
import { Loader } from '@mantine/core';

export default function Branch_Layout({token, branch}) {
  const [image, setImage] = useState();
  const [response, setResponse] = useState();
  const [isNewChat, setIsNewChat] = useState(true);
  const inputRef = useRef(null);

  const { speak } = useSpeechSynthesis();


  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const handleImageChange = async (file) => {
    if (file) {
      const objectURL = URL.createObjectURL(file);
      setImage(objectURL);

      const formData = new FormData();
      formData.append('image', file);
      formData.append('token', token);

      setResponse('');

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/${branch.toLowerCase()}/`, {
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

  useEffect(() => {
    handleFocus(response);
  }, [response])

  const handleFocus = (button) => {
    window.speechSynthesis.cancel();
    speak({ text: button });
  }

  return (
    <>
      <h2>{branch}:</h2>
      {isNewChat ? (
        <>
          <div className='butt'>
            <FileButton onChange={handleImageChange} accept="image/png,image/jpeg,image/jpg" style={{ backgroundColor: 'black', color: 'white' }}>
                {(props) => <Button {...props} tabIndex={1} ref={inputRef} onFocus={() => handleFocus('upload an image')}>Upload image</Button>}
            </FileButton>
            {token && <Button onClick={() => setIsNewChat(false)} variant="filled" color="rgba(0, 0, 0, 1)" tabIndex={2} onFocus={() => handleFocus('previous conversation history')}>History</Button>}
          </div>
          {loading && <Loader color="dark" size="sm" style={{ marginTop: '30px' }} />}
          <img src={image} style={{ marginTop: '75px' }}></img>
          <p>{response}</p>
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', top: '70px' }}>
          <Button onClick={() => setIsNewChat(true)} variant="filled" color="rgba(0, 0, 0, 1)" onFocus={() => handleFocus('start a new chat')}>New Chat</Button>
          <History branch={branch} token={token} setIsNewChat={setIsNewChat} setImage={setImage} setResponse={setResponse}/>
        </div>
      )}
    </>
  );
}