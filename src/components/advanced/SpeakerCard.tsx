
import React, { useEffect } from 'react'
import { SpeakerCardProps } from '../../types'

const SpeakerCard = ({ photo, uploadedImage, name, designation, profileLink }: SpeakerCardProps) => {
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
  
  // Debug logging removed for cleaner console
  
  // Detect if we're in preview mode (not editor mode)
  const [isPreviewMode, setIsPreviewMode] = React.useState(false);
  
  useEffect(() => {
    const checkPreviewMode = () => {
      // Check if we're in an iframe (common for preview)
      const inIframe = window.self !== window.top;
      
      // Check for Puck editor UI elements (sidebar, etc.)
      const hasPuckEditor = document.querySelector('[class*="puck__sidebar"]') !== null ||
                           document.querySelector('[class*="Puck"]') !== null ||
                           document.querySelector('[class*="puck"]') !== null;
      
      // Check URL for preview indicators
      const urlHasPreview = window.location.href.includes('preview') || 
                           window.location.search.includes('preview') ||
                           window.location.pathname.includes('preview');
      
      // If we're in an iframe or URL has preview, it's preview mode
      // If we don't have Puck editor UI and we're not in an iframe, check more carefully
      if (inIframe || urlHasPreview) {
        setIsPreviewMode(true);
      } else if (!hasPuckEditor) {
        // No Puck editor UI found, likely preview mode
        setIsPreviewMode(true);
      } else {
        setIsPreviewMode(false);
      }
    };
    
    // Check immediately
    checkPreviewMode();
    
    // Also check after a short delay to catch dynamic rendering
    const timeout = setTimeout(checkPreviewMode, 100);
    
    return () => clearTimeout(timeout);
  }, []);
  
  // Handle click on photo to navigate to profile
  const handlePhotoClick = (e: React.MouseEvent) => {
    if (profileLink) {
      const target = e.target as HTMLElement;
      const isFileInput = target.tagName === 'INPUT' || target.closest('input[type="file"]');
      
      // Don't navigate if clicking file input
      if (!isFileInput) {
        window.open(profileLink, '_blank', 'noopener,noreferrer');
      }
    }
  };
  
  // Handle name click - navigate to profile
  const handleNameClick = (e: React.MouseEvent) => {
    if (profileLink) {
      // In preview mode, always navigate
      if (isPreviewMode) {
        window.open(profileLink, '_blank', 'noopener,noreferrer');
        return;
      }
      
      // In editor mode, check if user is selecting text
      const selection = window.getSelection();
      const hasTextSelection = selection && selection.toString().length > 0;
      
      // If no text is selected, navigate to profile
      if (!hasTextSelection) {
        window.open(profileLink, '_blank', 'noopener,noreferrer');
      }
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 shadow-sm bg-white overflow-hidden">
      {/* Photo Section */}
      <div 
        className={`w-full h-[220px] overflow-hidden rounded-t-lg relative bg-gray-100 flex items-center justify-center ${profileLink ? 'cursor-pointer transition-opacity hover:opacity-90' : ''}`}
        onClick={handlePhotoClick}
      >
          {imageSrc ? (
            <img 
              src={imageSrc} 
              alt={nameValue}
              className="w-full h-full block"
              style={{
                objectFit: 'contain' as const,
                objectPosition: 'center center',
                width: '100%',
                height: '250px',
                display: 'block'
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="text-gray-500 text-sm">No image</div>
          )}
          {/* File upload input - only in editor mode */}
          {!isPreviewMode && (
            <div
              className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-xs opacity-0 transition-opacity duration-200 cursor-pointer rounded-lg z-10 hover:opacity-100"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <span>Click to upload image</span>
            </div>
          )}
          
          {/* ContentEditable field for uploaded image (hidden but functional) */}
          <div
            contentEditable
            suppressContentEditableWarning={true}
            data-puck-field="uploadedImage"
            className="absolute -top-[9999px] -left-[9999px] w-px h-px opacity-0 pointer-events-none"
          >
            {uploadedImageValue}
          </div>
          
          {/* Inline editable overlay for image URL - only in editor mode */}
          {!isPreviewMode && (
            <div
              contentEditable
              suppressContentEditableWarning={true}
              data-puck-field="photo"
              className="absolute top-2.5 left-2.5 right-2.5 bg-black/70 text-white text-[10px] px-2 py-1 rounded opacity-0 transition-opacity duration-200 cursor-pointer z-[11] hover:opacity-100"
            >
              {photo}
            </div>
          )}
        </div>
      
      {/* Text Section */}
      <div className="p-4">
        {profileLink && isPreviewMode ? (
          // In preview mode, use a link
          <a
            href={profileLink}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-lg block mb-1 text-gray-900 cursor-pointer transition-colors hover:text-blue-600"
          >
            {name}
          </a>
        ) : (
          // In editor mode, use contentEditable with click handler for navigation
          <div 
            className={`font-semibold text-lg block mb-1 text-gray-900 ${profileLink ? 'cursor-pointer transition-colors hover:text-blue-600' : ''}`}
            contentEditable={!isPreviewMode}
            suppressContentEditableWarning={true}
            data-puck-field="name"
            onClick={handleNameClick}
            onMouseDown={(e) => {
              // Allow text selection on mousedown
              // Only prevent navigation if user is starting to select text
              const selection = window.getSelection();
              if (selection && selection.rangeCount > 0) {
                // User might be selecting, don't interfere
                return;
              }
            }}
          >
            {name}
          </div>
        )}
        <div 
          className="text-gray-500 text-sm leading-snug"
          contentEditable={!isPreviewMode}
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
