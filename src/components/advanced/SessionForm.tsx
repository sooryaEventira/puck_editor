import React from 'react';
import Heading from '../basic/Heading';
import Text from '../basic/Text';
import Button from '../basic/Button';
import Spacer from '../basic/Spacer';
import TimeInputWithAMPM from '../basic/TimeInputWithAMPM';
import InputField from '../basic/InputField';
import SelectField from '../basic/SelectField';


export interface SessionFormProps {
  // Puck prop for drag and drop
  puck?: {
    dragRef?: any;
  };
  
  // Title
  sessionTitle?: string;
  
  // Time fields
  startTime?: string;
  startAMPM?: 'AM' | 'PM';
  endTime?: string;
  endAMPM?: 'AM' | 'PM';
  
  // Location
  location?: string;
  
  // Event type
  eventType?: string;
  eventTypeOptions?: { label: string; value: string }[];
  
  // Call to action
  ctaText?: string;
  addButtonText?: string;
  
  // Action buttons
  cancelButtonText?: string;
  saveButtonText?: string;
  showActionButtons?: boolean; // Control visibility of Save/Cancel buttons
  
  // Styling
  backgroundColor?: string;
  borderRadius?: string;
  padding?: string;
  
  // Callbacks
  onSave?: () => void;
  onCancel?: () => void;
  onAddSection?: () => void;
}

export const SessionForm: React.FC<SessionFormProps> = ({
  puck,
  sessionTitle = 'Session title',
  startTime = '00:00',
  startAMPM = 'AM',
  endTime = '00:00',
  endAMPM = 'AM',
  location = 'Enter location',
  eventType = 'Select event type',
  eventTypeOptions = [
    { label: 'Select event type', value: 'Select event type' },
    { label: 'In-Person', value: 'In-Person' },
    { label: 'Virtual', value: 'Virtual' },
    { label: 'Hybrid', value: 'Hybrid' }
  ],
  ctaText = 'Click to add a section!',
  addButtonText = '+ Add section',
  cancelButtonText = 'Cancel',
  saveButtonText = 'Save',
  showActionButtons = true, // Default to showing buttons (for Puck canvas)
  backgroundColor = '#ffffff',
  borderRadius = '12px',
  padding = '40px',
  onSave,
  onCancel,
  onAddSection
}) => {
  return (
    <div
      ref={puck?.dragRef}
      style={{
        backgroundColor,
        borderRadius,
        padding
      }}
      className="shadow-md max-w-[1200px] mx-auto"
    >
      {/* Session Title */}
      <Heading
        text={sessionTitle}
        level={1}
        size="XL"
        color="#111827"
        align="left"
      />
      
      <Spacer height="32px" />
      
      {/* Form Fields Row */}
      <div className="flex gap-5 flex-wrap items-end">
        {/* Start Time Group */}
        <div className="flex-none">
          <div className="mb-2">
            <Text text="Start time" size="14px" color="#374151" align="left" />
          </div>
          <TimeInputWithAMPM
            timeValue={startTime}
            ampmValue={startAMPM}
            width="150px"
            height="40px"
          />
        </div>
        
        {/* End Time Group */}
        <div className="flex-none">
          <div className="mb-2">
            <Text text="End Time" size="14px" color="#374151" align="left" />
          </div>
          <TimeInputWithAMPM
            timeValue={endTime}
            ampmValue={endAMPM}
            width="150px"
            height="40px"
          />
        </div>
        
        {/* Location Group */}
        <div className="flex-1 min-w-[200px]">
          <div className="mb-2">
            <Text text="Location" size="14px" color="#374151" align="left" />
          </div>
          <InputField
            label=""
            value={location}
            placeholder={location}
            icon={
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            }
            iconPosition="left"
            width="100%"
            height="40px"
          />
        </div>
        
        {/* Event Type Group */}
        <div className="flex-none w-[220px]">
          <div className="mb-2">
            <Text text="Event type" size="14px" color="#374151" align="left" />
          </div>
          <SelectField
            label=""
            value={eventType}
            placeholder=""
            options={eventTypeOptions}
            width="100%"
            height="40px"
          />
        </div>
      </div>
      
      <Spacer height="48px" />
      
      {/* Call to Action Section */}
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl py-[60px] px-10 text-center min-h-[200px] flex flex-col items-center justify-center">
        <Text
          text={ctaText}
          size="18px"
          color="#6b7280"
          align="center"
        />
        <Spacer height="16px" />
        <Button
          text={addButtonText}
          variant="primary"
          size="medium"
          backgroundColor="#8b5cf6"
          onClick={onAddSection}
        />
      </div>
      
      {/* Action Buttons - Only show in Puck canvas edit mode */}
      {showActionButtons && (
        <>
          <Spacer height="32px" />
          
          <div className="flex justify-end gap-3">
            <Button
              text={cancelButtonText}
              variant="secondary"
              size="medium"
              onClick={onCancel}
            />
            <Button
              text={saveButtonText}
              variant="primary"
              size="medium"
              backgroundColor="#8b5cf6"
              onClick={onSave}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SessionForm;

