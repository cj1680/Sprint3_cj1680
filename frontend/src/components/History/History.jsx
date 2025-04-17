import {Stack, Button} from '@mantine/core';
import {useState, useEffect, useRef} from 'react';
import React from 'react';
import { useSpeechSynthesis } from 'react-speech-kit';

export default function History({branch, token, setIsNewChat, setImage, setResponse}){
    const [convos, setConvos] = useState([]);
    const ref = useRef(null);

    const { speak } = useSpeechSynthesis();

    useEffect(() => {
        const getHistory = async () => {
            if (token){
              const response = await fetch(`${import.meta.env.VITE_API_URL}/history/`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({ branch: branch.toLowerCase(), token })
              });
            
              const data = await response.json();
              const result = data.valid;
          
              setConvos(result);
            }
          };
          getHistory();
    }, [])

    useEffect(() => {
        handleSpeak(`${convos.length} conversation${convos.length === 1 ? '' : 's'} retrieved`);

        if (ref.current) {
            ref.current.focus();
            speak({text: convos[0][0]});
        }
    }, [convos]);

    const handleSpeak = (button) => {
        window.speechSynthesis.cancel();
        speak({ text: button });
    }

    const openConvo = (convo) => {
        setIsNewChat(true);
        setImage(convo[2]);
        setResponse(convo[3]);
    }
    return(
        <>
        <Stack
            align="stretch"
            justify="center"
            gap="lg"
        >
            {convos.map((convo, index) => (
                <Button 
                variant="filled" 
                color="rgba(0, 0, 0, 1)" 
                onClick={() => {openConvo(convo)}} 
                key={index} 
                ref={ref} 
                onFocus={() => handleSpeak(`Conversation with filename ${convo[0]}`)}>
                    {convo[0]}
                </Button>
            ))}
        </Stack>
        </>
    );
}