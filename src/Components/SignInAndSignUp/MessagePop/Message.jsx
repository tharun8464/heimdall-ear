// Message.js
import React, { useState, useEffect } from 'react';

const Message = ({ content, duration = 3000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [duration]);

  return (
    <div className={`message ${visible ? 'visible' : 'hidden'}`}>
      {content}
    </div>
  );
};

export default Message;
