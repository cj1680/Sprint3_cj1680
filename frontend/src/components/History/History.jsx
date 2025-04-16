import {Stack, Button} from '@mantine/core';
import {useState, useEffect} from 'react';
import React from 'react';

export default function History({branch, token, setIsNewChat, setImage, setResponse}){
    const [convos, setConvos] = useState([]);

    useEffect(() => {
        const getHistory = async () => {
            if (token){
                const response = await fetch(`${import.meta.env.VITE_API_URL}/history/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ branch, token })
                });
            
              const data = await response.json();
              setConvos(data.valid);
            //   console.log(data.valid);
            }
          };
          getHistory();
    }, [])

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
                <Button variant="filled" color="rgba(0, 0, 0, 1)" onClick={() => {openConvo(convo)}} key={index}>{convo[0]}</Button>
            ))}
        </Stack>
        </>
    );
}