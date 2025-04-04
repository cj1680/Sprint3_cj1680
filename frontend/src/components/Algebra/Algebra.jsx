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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/algebra/`, {
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
      <h2>Algebra:</h2>
      <div className='butt'>
        <FileButton onChange={handleImageChange} accept="image/png,image/jpeg,image/jpg">
            {(props) => <Button {...props} style={{ backgroundColor: 'black', color: 'white' }}
            >
              Upload image
            </Button>}
        </FileButton>
      </div>
      <img src={image} style={{ marginTop: '75px' }}></img>
      <p>{response}</p>
    </>
  );
}
