
import React, { useEffect } from 'react'
import { SpeakerCardProps } from '../../types'

const SpeakerCard = ({ photo, uploadedImage, name, designation }: SpeakerCardProps) => {
  // Extract actual values from Puck's React elements
  const photoValue = (photo && typeof photo === 'object' && 'props' in photo && photo.props && 'value' in photo.props) ? photo.props.value : '';
  const uploadedImageValue = (uploadedImage && typeof uploadedImage === 'object' && 'props' in uploadedImage && uploadedImage.props && 'value' in uploadedImage.props) ? uploadedImage.props.value : '';
  const nameValue = (name && typeof name === 'object' && 'props' in name && name.props && 'value' in name.props) ? name.props.value : '';
  const designationValue = (designation && typeof designation === 'object' && 'props' in designation && designation.props && 'value' in designation.props) ? designation.props.value : '';
  
  // State for file upload
  const [imagePreview, setImagePreview] = React.useState<string>('');
  
  // Determine which image to use (uploaded image takes priority)
  const imageSrc = imagePreview || uploadedImageValue || photoValue;
  
  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Cleanup object URL when component unmounts
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);
  
  console.log('SpeakerCard props:', { photo, uploadedImage, name, designation });
  console.log('Extracted values:', { photoValue, uploadedImageValue, nameValue, designationValue });
  console.log('Final image source:', imageSrc);
  
  return (
    <div style={{
      borderRadius: '12px', 
      border: '1px solid #e5e7eb', 
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
      backgroundColor: 'white',
      overflow: 'hidden'
    }}>
      {/* Photo Section */}
      <div style={{ 
        width: '100%', 
        height: '165px', 
        overflow: 'hidden', 
        borderRadius: '8px 8px 0 0',
        position: 'relative', 
        backgroundColor: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={nameValue}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block'
            }}
            onLoad={() => console.log('✅ Image loaded successfully:', imageSrc)}
            onError={(e) => {
              console.log('❌ Image failed to load:', imageSrc);
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div style={{ color: '#6b7280', fontSize: '14px' }}>No image</div>
        )}
        {/* File upload input */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '12px',
            opacity: 0,
            transition: 'opacity 0.2s',
            cursor: 'pointer',
            borderRadius: '8px',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0';
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0,
              cursor: 'pointer'
            }}
          />
          <span>Click to upload image</span>
        </div>
        
        {/* Inline editable overlay for image URL */}
        <div
          contentEditable
          suppressContentEditableWarning={true}
          data-puck-field="photo"
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            fontSize: '10px',
            padding: '4px 8px',
            borderRadius: '4px',
            opacity: 0,
            transition: 'opacity 0.2s',
            cursor: 'pointer',
            zIndex: 11
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0';
          }}
        >
          {photo}
        </div>
      </div>
      
      {/* Text Section */}
      <div style={{ padding: '16px' }}>
        <div 
          style={{ 
            fontWeight: '600', 
            fontSize: '18px', 
            display: 'block', 
            marginBottom: '4px',
            color: '#111827'
          }}
          contentEditable
          suppressContentEditableWarning={true}
          data-puck-field="name"
        >
          {name}
        </div>
        <div 
          style={{ 
            color: '#6b7280', 
            fontSize: '14px',
            lineHeight: '1.4'
          }}
          contentEditable
          suppressContentEditableWarning={true}
          data-puck-field="designation"
        >
          {designation}
        </div>
      </div>
    </div>
  )
}

export default SpeakerCard
