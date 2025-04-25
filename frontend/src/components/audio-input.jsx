//using react-speech-to-text, handle audio recording and UI navigation
//Unlike audio-input branch, recording, processing, and navigation are all handled in frontend through React

//TODO: add react-speech-to-text to requirements.txt
//TODO: add handleAudioRecording from old branch--scrapped, use recordAudio function. Check with old func for help
//TODO: add UI nav wrapper/UI navigation functionality
import './audio-input.css'
import React, { useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

//Now: records audio, recognized commands, returns recognition of command
//Change to: UI Navigation
const RecordAudio = ({ setActiveTab, fileButtonRef }) => {
    const [message, setMessage] = useState('');
    //const navigate=useNavigate();

    const commands = [
        {
            command: ['algebra', 'geometry', 'graph', 'sign in', 'log in', 'file upload', 'image upload', 'upload',
                      'upload image', 'upload file'],
            callback: (command) => {
                console.log('Voice command received:', command);
                let commandStr = command.command.toLowerCase();
                console.log('Formatted command:', commandStr);
                setMessage(`You said: ${commandStr}`);
                setMessage(`Navigating to: ${commandStr}`);
                if (commandStr === "algebra" || commandStr === "geometry" || commandStr === "graph") {
                    setActiveTab(commandStr);
                }
                if(commandStr === "sign in"||commandStr === "log in"){
                    setActiveTab("Sign In");
                }
                // Trigger file upload button click when the command is "file upload"
                if (commandStr === "file upload") {
                    if (fileButtonRef && fileButtonRef.current) {
                        fileButtonRef.current.click(); // Programmatically click the "Upload Image" button
                    }
                }
            }
        }
    ]
    const {
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition({ commands });

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    return (
        <div>
          {/* Microphone status display */}
            <p style={{ fontWeight: 'bold', marginTop: '10px' }}>
                Microphone is: {listening ? '🎤 ON' : '🔇 OFF'}
            </p>
          <button className="butt" onClick={SpeechRecognition.startListening}>Start</button>
          <button className="butt" onClick={SpeechRecognition.stopListening}>Stop</button>
          <button className="butt" onClick={resetTranscript}>Reset</button>
          <p>{message}</p>
        </div>
    );
};
export default RecordAudio; 
