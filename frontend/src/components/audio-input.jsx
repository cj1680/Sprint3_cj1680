import './audio-input.css';
import React, { useState, useEffect } from 'react';
import { FaMicrophone, FaMicrophoneAltSlash } from 'react-icons/fa'; // Mic icons from react-icons
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const RecordAudio = ({ setActiveTab, fileButtonRef, signInButtonRef, activeTab, muted, setMuted }) => {
    // Web Audio API setup to generate tones
    const [isMicOn, setIsMicOn] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false); // prevents overlap
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

    const [autoStopTimeout, setAutoStopTimeout] = useState(null);
    // Handle Mic button click
    const handleMicClick = async () => {
        if (isTransitioning) return; // Prevent double-trigger
        setIsTransitioning(true);

        if (isMicOn) {
            playTone(440);            // 440Hz = A4 -- descending pattern: stop
            playTone(369.99, 250);   // 369.99 Hz = F#4
            SpeechRecognition.stopListening(); // Use SpeechRecognition directly
            setIsMicOn(false);
            clearTimeout(autoStopTimeout);
            setAutoStopTimeout(null);
        } else {
            playTone(369.99); // ascending pattern: start
            playTone(440, 250);
            SpeechRecognition.startListening({ continuous: true, interimResults: true });
            setIsMicOn(true);

            const timeoutId = setTimeout(() => {
                SpeechRecognition.stopListening();
                setIsMicOn(false);
                setAutoStopTimeout(null);
            }, 3000); // Auto-stop after  seconds
    
            setAutoStopTimeout(timeoutId);
        }
        // Prevent spam for 500ms
        setTimeout(() => setIsTransitioning(false), 500);
    };

    // Watch for changes in transcript and handle voice commands
    // Watch for voice command triggers
    useEffect(() => {
        if (!transcript) return;

        const commandStr = transcript.toLowerCase();
        console.log("Voice command received:", commandStr);

        if (commandStr === "algebra" || commandStr === "geometry" || commandStr === "graph") {
            setActiveTab(commandStr);
        }

        if (commandStr === "sign in" || commandStr === "log in") {
            setActiveTab("Sign In");
            if (signInButtonRef.current) {
                signInButtonRef.current.click();
            }
        }

        if (commandStr.includes("upload") || commandStr.includes("image") || commandStr.includes("file")) {
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

        setTimeout(() => {
            resetTranscript();
        }, 500);
    }, [transcript]);

    // Auto-stop after 4s of silence — reset on each transcript update
    useEffect(() => {
        if (!listening) return;

        if (autoStopTimeout) {
            clearTimeout(autoStopTimeout);
        }

        const timeoutId = setTimeout(() => {
            SpeechRecognition.stopListening();
            playTone(440); // Stop tone
            playTone(369.99, 250);
            setIsMicOn(false);
            setAutoStopTimeout(null);
        }, 4000);

        setAutoStopTimeout(timeoutId);

        return () => clearTimeout(timeoutId);
    }, [transcript, listening]);

    return (
        <div className="audio-input-container">
            <p>{transcript}</p>
            <div className="floating-mic-container">
                {/* Floating mic button */}
                <button
                    className={`floating-mic-button ${isMicOn ? 'recording' : ''}`} // Update color based on listening
                    onClick={handleMicClick}
                    aria-label={listening ? 'Stop recording' : 'Start recording'} // Button text based on listening state
                >
                    {isMicOn ? <FaMicrophone /> : <FaMicrophoneAltSlash />}
                </button>

                {/* Mic Status Text */}
                <div className="mic-status">
                    {isMicOn ? 'Recording...' : 'Mic is off'} {/* Adjust the message based on listening */}
                </div>
            </div>
        </div>
    );
};

export default RecordAudio;
