import './Branch_Layout.css';
import React, { useState, useEffect, useRef  } from 'react';
import { FileButton, Button } from '@mantine/core';
import { useSpeechSynthesis } from 'react-speech-kit';
import History from '../History/History.jsx';
import { Loader } from '@mantine/core';

export default function Branch_Layout({token, branch, muted, fileButtonRef}) {
  const [image, setImage] = useState();
  const [response, setResponse] = useState('');
  const [isNewChat, setIsNewChat] = useState(true);
  const [loading, setLoading] = useState(false);
  const [audioOutput, setAudioOutput] = useState("");
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

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key.toLowerCase() === 'r') {
        handleSpeak(response);
      }
      if (event.key.toLowerCase() === 'c') {
        window.speechSynthesis.cancel();
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [response]);

  const handleImageChange = async (file) => {
    if (file) {
      const objectURL = URL.createObjectURL(file);
      setImage(objectURL);

      const formData = new FormData();
      formData.append('image', file);
      formData.append('token', token);

      setLoading(true);
      setResponse('');
      setAudioOutput('Loading');
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/${branch.toLowerCase()}/`, {
          method: "POST",
          body: formData
        });
        const data = await response.json();

        if (data.response != '0') {
          setResponse(data.response);
        } else {
          setResponse('This is not a valid image')
        }
      } catch (error) {
        setResponse('Failure');
      } finally {
        setLoading(false);
      }

    } else {
      console.error('No file selected');
    }
  };

  useEffect(() => {
    handleSpeak(response);
  }, [response])

  useEffect(() => {
    handleSpeak(audioOutput);
  }, [audioOutput])

  const handleSpeak = (output) => {
    if (!muted){
      window.speechSynthesis.cancel();
      speak({ text: output });
    }
  }

  return (
    <>
        <h2>{branch}:</h2>
        {loading && (
          <div className="loader-container">
            <Loader color="black" size="xl" />
          </div>
        )}
        {isNewChat ? (
          <>
            <div className='butt'>
              <FileButton onChange={handleImageChange} accept="image/png,image/jpeg,image/jpg" style={{ backgroundColor: 'black', color: 'white' }} ref={fileButtonRef}>
                  {(props) => <Button {...props} tabIndex={1} ref={inputRef} onFocus={() => handleSpeak('upload an image')}>Upload image</Button>}
              </FileButton>
              {token && <Button onClick={() => setIsNewChat(false)} variant="filled" color="rgba(0, 0, 0, 1)" tabIndex={2} onFocus={() => handleSpeak('previous conversation history')}>History</Button>}
            </div>
            {image && (
              <div className="image-response-row">
                <img src={image} alt="uploaded" className="preview-image" />
                <p className="response-text">{response}</p>
              </div>
            )}
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', top: '70px' }}>
            <Button onClick={() => setIsNewChat(true)} variant="filled" color="rgba(0, 0, 0, 1)" onFocus={() => handleSpeak('start a new chat')}>New Chat</Button>
            <History branch={branch} token={token} setIsNewChat={setIsNewChat} setImage={setImage} setResponse={setResponse} muted={muted} />
          </div>
        )}
    </>
  );
}