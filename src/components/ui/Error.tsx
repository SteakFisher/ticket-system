// Error403.tsx
import React from 'react';
import './Error.css';

const Error = (props: {code: String; text: String; detail: String}) => {
  return (
    <div className="error-container">
      <div className="error-content">
        <h1 className="error-code">{props.code}</h1>
        <p className="error-text">{props.text}</p>
        <p className="error-description">{props.detail}</p>
        <a href="/" className="home-link">Go Home</a>
      </div>
    </div>
  );
}

export default Error;