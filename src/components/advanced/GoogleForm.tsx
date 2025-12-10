import React from 'react';
import { GoogleFormProps } from '../../types';

const GoogleForm: React.FC<GoogleFormProps> = ({ formUrl, height = 500, puck }) => {
  if (!formUrl) {
    return (
      <div 
        ref={puck?.dragRef}
        className="p-5 border-2 border-dashed border-red-400 rounded-lg bg-red-50 text-red-600 text-center my-2.5"
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
      className="my-5 rounded-lg overflow-hidden shadow-md"
    >
      <iframe
        src={formUrl}
        width="100%"
        height={height}
        frameBorder="0"
        marginHeight={0}
        marginWidth={0}
        className="border-none rounded-lg"
        title="Google Form"
      >
        Loading Google Form...
      </iframe>
    </div>
  );
};

export default GoogleForm;
