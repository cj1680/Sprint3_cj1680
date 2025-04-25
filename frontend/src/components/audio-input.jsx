//using react-speech-to-text, handle audio recording and UI navigation
//Unlike audio-input branch, recording, processing, and navigation are all handled in frontend through React

import './audio-input.css'
import React, { useState } from 'react';
import { FaMicrophone, FaMicrophoneAltSlash } from 'react-icons/fa'; // Mic icons from react-icons
//import { useNavigate } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const RecordAudio = ({ setActiveTab, fileButtonRef, signInButtonRef, activeTab, muted, setMuted }) => {
    //const [message, setMessage] = useState('');
    //const navigate=useNavigate();
    // Web Audio API setup to generate tones
    const playTone = (frequency, delay = 0) => {
        if(muted)
        {   
            //if user has muted, don't play tone
            return;
        }
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine'; // Create sin wave oscillator
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + delay / 1000);
        oscillator.connect(audioContext.destination); // Connect the oscillator to the output (speakers)

        oscillator.start(audioContext.currentTime + delay / 1000);
        oscillator.stop(audioContext.currentTime + (delay + 200) / 1000); // 200ms duration
        //}, 200); // Stop the tone after 200ms
    };

    const commands = [
        {
            command: ['algebra', 'geometry', 'graph', 'sign in', 'log in', 'file upload', 'image upload', 'upload',
                      'upload image', 'upload file', 'mute', 'unmute', 'register', 'email', 'password'],
            callback: (command) => {
                console.log('Voice command received:', command);
                let commandStr = command.command.toLowerCase();
                console.log('Formatted command:', commandStr);
                if (commandStr === "algebra" || commandStr === "geometry" || commandStr === "graph") {
                    setActiveTab(commandStr);
                }
                if(commandStr === "sign in"||commandStr === "log in"){
                    setActiveTab("Sign In");
                    if (signInButtonRef.current) {
                        signInButtonRef.current.click(); // Simulate click on the sign-in/register button
                    }
                }
                // Trigger file upload button click when the command is "file upload"
                if (commandStr.includes("upload")||commandStr.includes("image")||commandStr.includes("file")) {
                    if (fileButtonRef.current) {
                        fileButtonRef.current.click();
                      }
                }
                if (commandStr.includes("mute") && !muted) {
                    setMuted(true);
                  }
                  
                  if (commandStr.includes("unmute") && muted) {
                    setMuted(false);
                  }
            }
        }
    ]
    const { listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition({ commands });

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    const handleMicClick = () => {
        if (listening) {
            playTone(440);            //440Hz = A4 -- descending pattern: stop
            playTone(369.99, 250);   // 369.99 Hz = F#4
            SpeechRecognition.stopListening(); // Use SpeechRecognition directly
        } else {
            playTone(369.99); // ascending pattern: start
            playTone(440, 250);
            SpeechRecognition.startListening(); // Use SpeechRecognition directly
        }
    };

    return (
        <div className="audio-input-container">
            <div className="floating-mic-container">
                {/* Floating mic button */}
                <button
                    className={`floating-mic-button ${listening ? 'recording' : ''}`} // Update color based on listening
                    onClick={handleMicClick}
                    aria-label={listening ? 'Stop recording' : 'Start recording'} // Button text based on listening state
                >
                    {listening ? <FaMicrophone /> : <FaMicrophoneAltSlash />}
                </button>

                {/* Mic Status Text */}
                <div className="mic-status">
                    {listening ? 'Recording...' : 'Mic is off'} {/* Adjust the message based on listening */}
                </div>
            </div>
        </div>
    );
};
export default RecordAudio; 
