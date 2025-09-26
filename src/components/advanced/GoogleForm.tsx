import React from 'react';
import { GoogleFormProps } from '../../types';

const GoogleForm: React.FC<GoogleFormProps> = ({ formUrl, height = 500, puck }) => {
  if (!formUrl) {
    return (
      <div 
        ref={puck?.dragRef}
        style={{
          padding: '20px',
          border: '2px dashed #ff6b6b',
          borderRadius: '8px',
          backgroundColor: '#ffe0e0',
          color: '#d63031',
          textAlign: 'center',
          margin: '10px 0'
        }}
      >
        <strong>Google Form URL not provided</strong>
        <br />
        <small>Please provide a valid Google Form URL</small>
      </div>
    );
  }

  return (
    <div 
      ref={puck?.dragRef}
      style={{
        margin: '20px 0',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      <iframe
        src={formUrl}
        width="100%"
        height={height}
        frameBorder="0"
        marginHeight={0}
        marginWidth={0}
        style={{
          border: 'none',
          borderRadius: '8px'
        }}
        title="Google Form"
      >
        Loading Google Form...
      </iframe>
    </div>
  );
};

export default GoogleForm;
