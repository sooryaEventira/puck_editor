import React, { useState, useEffect, useRef } from 'react';

export interface HTMLContentProps {
  htmlContent: string | React.ReactElement;
  id?: string;
}

const HTMLContent: React.FC<HTMLContentProps> = ({ htmlContent, id }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Helper function to extract string value from props
  const getStringValue = (prop: string | React.ReactElement): string => {
    if (typeof prop === 'string') {
      return prop;
    }
    if (prop && typeof prop === 'object' && 'props' in prop && prop.props && 'value' in prop.props) {
      return prop.props.value || '';
    }
    return '';
  };

  const htmlContentValue = getStringValue(htmlContent);

  // Set up inline editing when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      makeContentEditable();
    }, 100); // Small delay to ensure DOM is ready

    return () => {
      removeContentEditable();
    };
  }, [htmlContentValue]);

  // Function to make HTML content editable inline
  const makeContentEditable = () => {
    if (!contentRef.current) return;
    
    const editableElements = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, a, button, li, td, th');
    
    editableElements.forEach((element) => {
      element.setAttribute('contenteditable', 'true');
      element.setAttribute('data-puck-field', 'htmlContent');
      (element as HTMLElement).classList.add('outline-none', 'cursor-text');
      
      // Add hover effect
      element.addEventListener('mouseenter', () => {
        (element as HTMLElement).classList.add('bg-blue-500/10', 'rounded');
      });
      
      element.addEventListener('mouseleave', () => {
        (element as HTMLElement).classList.remove('bg-blue-500/10', 'rounded');
      });
      
      // Handle content changes
      element.addEventListener('input', () => {
        updateHTMLContent();
      });
      
      element.addEventListener('blur', () => {
        updateHTMLContent();
      });
    });
  };

  // Function to update HTML content when inline editing
  const updateHTMLContent = () => {
    if (!contentRef.current) return;
    
    const newHTML = contentRef.current.innerHTML;
    const htmlField = document.querySelector('[data-puck-field="htmlContent"]') as HTMLElement;
    if (htmlField) {
      htmlField.textContent = newHTML;
      const inputEvent = new Event('input', { bubbles: true });
      htmlField.dispatchEvent(inputEvent);
    }
  };

  // Function to remove inline editing
  const removeContentEditable = () => {
    if (!contentRef.current) return;
    
    const editableElements = contentRef.current.querySelectorAll('[contenteditable="true"]');
    editableElements.forEach((element) => {
      element.removeAttribute('contenteditable');
      element.removeAttribute('data-puck-field');
      (element as HTMLElement).classList.remove('outline-none', 'cursor-text', 'bg-blue-500/10', 'rounded');
    });
  };

  return (
    <div 
      id={id}
      className="w-full min-h-screen relative"
    >
      {/* Hidden field for Puck to track the content */}
      <div
        contentEditable
        suppressContentEditableWarning={true}
        data-puck-field="htmlContent"
        className="absolute -top-[9999px] -left-[9999px] w-px h-px opacity-0 pointer-events-none"
      >
        {htmlContentValue}
      </div>

      <div
        ref={contentRef}
        dangerouslySetInnerHTML={{ __html: htmlContentValue }}
        className="w-full min-h-screen relative"
      />
    </div>
  );
};

export default HTMLContent;
