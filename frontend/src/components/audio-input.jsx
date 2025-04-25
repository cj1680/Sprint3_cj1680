import './audio-input.css';
import React, { useState, useEffect } from 'react';
import { FaMicrophone, FaMicrophoneAltSlash } from 'react-icons/fa'; // Mic icons from react-icons
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const RecordAudio = ({ setActiveTab, fileButtonRef, signInButtonRef, activeTab, muted, setMuted }) => {
    // Web Audio API setup to generate tones
    const playTone = (frequency, delay = 0) => {
        if (muted) {   
            // If user has muted, don't play tone
            return;
        }
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine'; // Create sin wave oscillator
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + delay / 1000);
        oscillator.connect(audioContext.destination); // Connect the oscillator to the output (speakers)

        oscillator.start(audioContext.currentTime + delay / 1000);
        oscillator.stop(audioContext.currentTime + (delay + 200) / 1000); // 200ms duration
    };

    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    // Handle Mic button click
    const handleMicClick = () => {
        if (listening) {
            playTone(440);            // 440Hz = A4 -- descending pattern: stop
            playTone(369.99, 250);   // 369.99 Hz = F#4
            SpeechRecognition.stopListening(); // Use SpeechRecognition directly
        } else {
            playTone(369.99); // ascending pattern: start
            playTone(440, 250);
            SpeechRecognition.startListening(); // Use SpeechRecognition directly
        }
    };

    // Watch for changes in transcript and handle voice commands
    useEffect(() => {
        if (!transcript) return;

        const commandStr = transcript.toLowerCase();
        console.log("Voice command received:", commandStr);

        // Handle commands and reset transcript after processing
        if (["algebra", "geometry", "graph"].includes(commandStr)) {
            setActiveTab(commandStr);
        }

        if (["sign in", "log in"].includes(commandStr)) {
            setActiveTab("Sign In");
            if (signInButtonRef.current) {
                signInButtonRef.current.click(); // Simulate click on the sign-in/register button
            }
        }

        if (commandStr.includes("upload") || commandStr.includes("image") || commandStr.includes("file")) {
            if (fileButtonRef.current) {
                fileButtonRef.current.click();
            }
        }

        if (commandStr === "mute") {
            setMuted(true);
        }

        if (commandStr === "unmute") {
            setMuted(false);
        }

        // Reset the transcript after processing the command
        resetTranscript();
    }, [transcript, setActiveTab, fileButtonRef, signInButtonRef, setMuted, resetTranscript]);

    return (
        <div className="audio-input-container">
            <p>{transcript}</p>
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
