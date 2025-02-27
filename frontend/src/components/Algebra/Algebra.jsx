import { useState, useEffect } from 'react';
import './Algebra.css'

export default function Algebra() {
    const [test, setTest] = useState(); // Contains response from backend

    useEffect(() => { // Runs when the site is loaded
        fetch('http://localhost:5000/algebra/') // Tests backend communication
        .then(response => response.json())
        .then(data => setTest(data))
        .catch(error => setTest('Failure'));
    }, [])

    return(
        <h1>Algebra: {test}</h1>
    );
}