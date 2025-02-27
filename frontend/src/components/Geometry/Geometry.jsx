import { useState, useEffect } from 'react';
import './Geometry.css'

export default function Geometry() {
    const [test, setTest] = useState(); // Contains response from backend

    useEffect(() => { // Runs when the site is loaded
        fetch('http://localhost:5000/geometry/') // Tests backend communication
        .then(response => response.json())
        .then(data => setTest(data))
        .catch(error => setTest('Failure'));
    }, [])

    return(
        <h1>Geometry: {test}</h1>
    );
}