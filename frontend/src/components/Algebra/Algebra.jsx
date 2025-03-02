import './Algebra.css';
import React, { useState } from 'react';
import { FileButton, Button } from '@mantine/core';

export default function Algebra() {
  const [image, setImage] = useState();
  const [response, setResponse] = useState()


  const handleImageChange = async (file) => {
    if (file) {
      const objectURL = URL.createObjectURL(file);
      setImage(objectURL);

      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch(`http://localhost:5000/algebra/`, {
          method: "POST",
          body: formData
        });
        const data = await response.json();
        setResponse(data.response);
      } catch (error) {
        setResponse('Failure');
      }

    } else {
      console.error('No file selected');
    }
  };

  return (
    <>
      <div>
        <h1>Algebra:</h1>
        <FileButton onChange={handleImageChange} accept="image/png,image/jpeg">
            {(props) => <Button {...props}>Upload image</Button>}
        </FileButton>
      </div>
      <img src={image}></img>
      <p>{response}</p>
    </>
  );
}
