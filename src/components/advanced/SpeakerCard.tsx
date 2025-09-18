
import React, { useEffect } from 'react'
import { SpeakerCardProps } from '../../types'

const SpeakerCard = ({ photo, uploadedImage, name, designation }: SpeakerCardProps) => {
  // Extract actual values from Puck's React elements or direct values
  const photoValue = (photo && typeof photo === 'object' && 'props' in photo && photo.props && 'value' in photo.props) 
    ? photo.props.value 
    : (typeof photo === 'string' ? photo : '');
  const uploadedImageValue = (uploadedImage && typeof uploadedImage === 'object' && 'props' in uploadedImage && uploadedImage.props && 'value' in uploadedImage.props) 
    ? uploadedImage.props.value 
    : (typeof uploadedImage === 'string' ? uploadedImage : '');
  const nameValue = (name && typeof name === 'object' && 'props' in name && name.props && 'value' in name.props) 
    ? name.props.value 
    : (typeof name === 'string' ? name : '');
  const designationValue = (designation && typeof designation === 'object' && 'props' in designation && designation.props && 'value' in designation.props) 
    ? designation.props.value 
    : (typeof designation === 'string' ? designation : '');
  
  // State for file upload preview (only for temporary preview during file selection)
  const [imagePreview, setImagePreview] = React.useState<string>('');
  
  // Use a ref to store the initial photo URL and never change it
  const stablePhotoUrlRef = React.useRef<string>('');
  
  // Set the stable photo URL only once
  if (photoValue && !stablePhotoUrlRef.current) {
    console.log('Setting stable photo URL:', photoValue);
    stablePhotoUrlRef.current = photoValue;
  }
  
  // Determine which image to use (preview takes priority during upload, then uploaded image, then stable photo)
  const imageSrc = imagePreview || uploadedImageValue || stablePhotoUrlRef.current;
  
  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log('File selected:', file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        console.log('File read result:', result.substring(0, 50) + '...');
        setImagePreview(result);
        
        // Update the contentEditable field for uploaded image
        const uploadedImageField = document.querySelector('[data-puck-field="uploadedImage"]') as HTMLElement;
        console.log('Found uploadedImageField:', uploadedImageField);
        if (uploadedImageField) {
          uploadedImageField.textContent = result;
          console.log('Updated field content to:', result.substring(0, 50) + '...');
          // Trigger input event to notify Puck of the change
          const inputEvent = new Event('input', { bubbles: true });
          uploadedImageField.dispatchEvent(inputEvent);
          console.log('Dispatched input event');
        } else {
          console.log('No uploadedImageField found');
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Clear preview when uploaded image changes (image has been saved)
  useEffect(() => {
    if (uploadedImageValue && imagePreview) {
      setImagePreview('');
    }
  }, [uploadedImageValue]);

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
  console.log('Stable photo URL ref:', stablePhotoUrlRef.current);
  console.log('Final image source:', imageSrc);
  console.log('imagePreview state:', imagePreview);
  
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
        
        {/* ContentEditable field for uploaded image (hidden but functional) */}
        <div
          contentEditable
          suppressContentEditableWarning={true}
          data-puck-field="uploadedImage"
          style={{
            position: 'absolute',
            top: '-9999px',
            left: '-9999px',
            width: '1px',
            height: '1px',
            opacity: 0,
            pointerEvents: 'none'
          }}
        >
          {uploadedImageValue}
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
