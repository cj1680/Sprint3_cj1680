import { Stack, Button } from '@mantine/core';
import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { useSpeechSynthesis } from 'react-speech-kit';
import { BsFillTrash2Fill } from "react-icons/bs";
import './History.css';

export default function History({ branch, token, setIsNewChat, setImage, setResponse }) {
  const [convos, setConvos] = useState([]);
  const [convosLen, setConvosLen] = useState(0);
  const ref = useRef(null);

  const { speak } = useSpeechSynthesis();

  useEffect(() => {
    const getHistory = async () => {
      if (token) {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/history/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ branch: branch.toLowerCase(), token }),
        });

        const data = await response.json();
        const result = data.valid;
        
        setConvosLen(result.length)
        setConvos(result);
      }
    };
    getHistory();
  }, [branch, token]);

  useEffect(() => {

    if (convos.length > 0 && ref.current) {
      ref.current.focus();
      if (convos.length >= convosLen)
      {
        handleSpeak(
          `${convos.length} conversation${convos.length === 1 ? '' : 's'} retrieved`
        );
        speak({text: `${convos[0][0]}`});
      }
      setConvosLen(convos.length)
    }
  }, [convos]);

  const handleSpeak = (button) => {
    window.speechSynthesis.cancel();
    speak({ text: button });
  };

  const openConvo = (convo) => {
    setIsNewChat(true);
    setImage(convo[2]);
    setResponse(convo[3]);
  };

  const deleteConvo = (c_id) => {
    const response = fetch(`${import.meta.env.VITE_API_URL}/deleteConvo/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ c_id: c_id }),
    });
    setConvos(prev => prev.filter(convo => convo[4] !== c_id));
  }

  return (
    <Stack align="stretch" justify="center" gap="lg">
      {convos.map((convo, index) => (
        <div className="container" key={index}>
          <div className="group">
            <Button
              variant="filled"
              color="rgba(0, 0, 0, 1)"
              onClick={() => openConvo(convo)}
              ref={index === 0 ? ref : null}
              onFocus={() => handleSpeak(`${convo[0]}`)}
            >
              {convo[0]}
            </Button>
      
            <BsFillTrash2Fill 
              onClick={() => {
                deleteConvo(convo[4]);
              }} 
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.stopPropagation();
                  e.preventDefault();
                  deleteConvo(convo[4]);
                }
              }}
              onFocus={() => handleSpeak(`Delete ${convo[0]}`)}
              tabIndex={0}
              className="right"
            />
          </div>
        </div>      
      ))}
    </Stack>
  );
}
