import { Card, Spinner } from 'react-bootstrap';
import { useState, useRef, useEffect } from 'react';
import jimbo from '../assets/jimbo.png'

const Joker = () => {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(imgRef.current, 0, 0);
  }, []);

  return(
    <>
      <img
        ref={imgRef}
        src={jimbo}
        alt=""
        width="142"
        height="190"
        style={{display: 'none'}}
      />
      <canvas
        ref={canvasRef}
        width="142"
        height="190"
      />
    </>
  );
}

export default Joker;