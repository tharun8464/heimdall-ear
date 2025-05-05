import React, { useRef, useEffect, useState } from 'react';

const WhiteBoard = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set initial styles
    context.strokeStyle = '#000';
    context.lineWidth = 2;
    context.lineCap = 'round';

    let lastX = 0;
    let lastY = 0;

    const startDrawing = (e) => {
      setIsDrawing(true);
      [lastX, lastY] = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
    };

    const draw = (e) => {
      if (!isDrawing) return;

      context.beginPath();
      context.moveTo(lastX, lastY);
      context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      context.stroke();

      [lastX, lastY] = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
    };

    const stopDrawing = () => {
      setIsDrawing(false);
    };

    // Add event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    return () => {
      // Remove event listeners on cleanup
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
    };
  }, [isDrawing]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      style={{ border: '1px solid #ccc', cursor: 'crosshair' }}
    />
  );
};

export default WhiteBoard;
