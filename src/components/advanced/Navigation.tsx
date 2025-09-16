import React, { useState } from 'react'
import { NavigationProps } from '../../types'

const Navigation = ({ 
  logo, 
  logoText, 
  menuItems, 
  backgroundColor, 
  textColor, 
  logoColor,
  linkColor,
  hoverColor,
  padding,
  alignment
}: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditingMenu, setIsEditingMenu] = useState(false);
  const [tempMenuItems, setTempMenuItems] = useState('');
  // Extract actual values from Puck's React elements
  const logoValue = (logo && typeof logo === 'object' && 'props' in logo && logo.props && 'value' in logo.props) ? logo.props.value : '';
  const logoTextValue = (logoText && typeof logoText === 'object' && 'props' in logoText && logoText.props && 'value' in logoText.props) ? logoText.props.value : '';
  const menuItemsValue = (menuItems && typeof menuItems === 'object' && 'props' in menuItems && menuItems.props && 'value' in menuItems.props) ? menuItems.props.value : '';
  
  // Parse menu items from string (format: "Home|/home,About|/about,Speakers|/speakers")
  const currentMenuItems = isEditingMenu ? tempMenuItems : menuItemsValue;
  const parsedMenuItems = currentMenuItems ? 
    currentMenuItems.split(',').map((item: string) => {
      const [label, link] = item.trim().split('|');
      return { label: label?.trim() || '', link: link?.trim() || '#' };
    }) : [
      { label: 'About', link: '/about' },
      { label: 'Speakers', link: '/speakers' },
      { label: 'Schedule', link: '/schedule' },
      { label: 'Information', link: '/information' },
      { label: 'Contact', link: '/contact' },
      { label: 'Register', link: '/register' }
    ];

  const handleLinkClick = (e: React.MouseEvent, link: string) => {
    e.preventDefault();
    if (link && link !== '#') {
      // For demo purposes, we'll just log the navigation
      console.log('Navigate to:', link);
      // In a real app, you would use React Router or similar
      // navigate(link);
    }
    // Close mobile menu when link is clicked
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const startEditingMenu = () => {
    setIsEditingMenu(true);
    setTempMenuItems(menuItemsValue);
  };

  const saveMenuChanges = () => {
    // This would normally update the Puck field
    // For now, we'll just log the changes
    console.log('Menu items updated:', tempMenuItems);
    setIsEditingMenu(false);
  };

  const cancelMenuEdit = () => {
    setIsEditingMenu(false);
    setTempMenuItems('');
  };

  const addMenuItem = () => {
    const newItem = 'New Item|#';
    const updatedItems = tempMenuItems ? `${tempMenuItems},${newItem}` : newItem;
    setTempMenuItems(updatedItems);
  };

  const deleteMenuItem = (index: number) => {
    const items = tempMenuItems.split(',');
    items.splice(index, 1);
    setTempMenuItems(items.join(','));
  };

  return (
    <nav style={{
      backgroundColor: backgroundColor || '#ffffff',
      padding: padding || '1rem 2rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'relative',
      zIndex: 1000
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: alignment === 'center' ? 'center' : alignment === 'right' ? 'flex-end' : 'space-between',
        maxWidth: '1200px',
        margin: '0 auto',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Logo Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexShrink: 0
        }}>
          {logoValue && (
            <img 
              src={logoValue} 
              alt={logoTextValue || 'Logo'} 
              style={{
                height: '40px',
                width: 'auto',
                objectFit: 'contain'
              }}
              onError={(e) => {
                console.log('Logo image failed to load:', logoValue);
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <div 
            contentEditable
            suppressContentEditableWarning={true}
            data-puck-field="logoText"
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: logoColor || textColor || '#333333',
              cursor: 'text',
              minWidth: '100px',
              outline: 'none'
            }}
          >
            {logoText}
          </div>
        </div>

        {/* Desktop Menu Items */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          flexWrap: 'wrap'
        }} className="desktop-menu">
          {parsedMenuItems.map((item: { label: string; link: string }, index: number) => (
            <a
              key={index}
              href={item.link}
              onClick={(e) => handleLinkClick(e, item.link)}
              style={{
                color: linkColor || textColor || '#333333',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '1rem',
                padding: '0.5rem 0',
                position: 'relative',
                transition: 'color 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = hoverColor || '#007bff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = linkColor || textColor || '#333333';
              }}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={toggleMobileMenu}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            flexDirection: 'column',
            gap: '4px'
          }}
          className="mobile-menu-toggle"
        >
          <div style={{
            width: '25px',
            height: '3px',
            backgroundColor: textColor || '#333333',
            transition: 'all 0.3s ease',
            transform: isMobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
          }}></div>
          <div style={{
            width: '25px',
            height: '3px',
            backgroundColor: textColor || '#333333',
            transition: 'all 0.3s ease',
            opacity: isMobileMenuOpen ? '0' : '1'
          }}></div>
          <div style={{
            width: '25px',
            height: '3px',
            backgroundColor: textColor || '#333333',
            transition: 'all 0.3s ease',
            transform: isMobileMenuOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none'
          }}></div>
        </button>

        {/* Menu Edit Button */}
        <button
          onClick={startEditingMenu}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            border: 'none',
            fontSize: '11px',
            padding: '6px 10px',
            borderRadius: '6px',
            opacity: 0,
            transition: 'opacity 0.3s',
            cursor: 'pointer',
            zIndex: 1001
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0';
          }}
        >
          ✏️ Edit Menu
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div style={{
        display: isMobileMenuOpen ? 'block' : 'none',
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: backgroundColor || '#ffffff',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        zIndex: 1000,
        padding: '1rem 0'
      }} className="mobile-menu">
        {parsedMenuItems.map((item: { label: string; link: string }, index: number) => (
          <a
            key={index}
            href={item.link}
            onClick={(e) => handleLinkClick(e, item.link)}
            style={{
              display: 'block',
              color: linkColor || textColor || '#333333',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '1.1rem',
              padding: '1rem 2rem',
              borderBottom: '1px solid rgba(0,0,0,0.1)',
              transition: 'background-color 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {item.label}
          </a>
        ))}
      </div>

      {/* Menu Editing Interface */}
      {isEditingMenu && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          border: '2px solid #333',
          borderRadius: '8px',
          padding: '20px',
          zIndex: 10000,
          minWidth: '400px',
          maxWidth: '600px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>Edit Navigation Menu</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Menu Items (format: Label|Link, Label|Link):
            </label>
            <textarea
              value={tempMenuItems}
              onChange={(e) => setTempMenuItems(e.target.value)}
              style={{
                width: '100%',
                height: '100px',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
                resize: 'vertical'
              }}
              placeholder="About|/about,Speakers|/speakers,Schedule|/schedule"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <button
              onClick={addMenuItem}
              style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              ➕ Add Item
            </button>
            <span style={{ fontSize: '12px', color: '#666' }}>
              Click to add a new menu item
            </span>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Current Menu Items:</h4>
            {parsedMenuItems.map((item: { label: string; link: string }, index: number) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px',
                background: '#f5f5f5',
                marginBottom: '5px',
                borderRadius: '4px'
              }}>
                <span style={{ fontSize: '14px' }}>
                  <strong>{item.label}</strong> → {item.link}
                </span>
                <button
                  onClick={() => deleteMenuItem(index)}
                  style={{
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              onClick={cancelMenuEdit}
              style={{
                background: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={saveMenuChanges}
              style={{
                background: '#28a745',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* CSS for responsive behavior */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-menu-toggle {
            display: flex !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-menu {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  )
}

export default Navigation
