import React, { useState } from 'react'
import { NavigationProps } from '../../types'

const Navigation = ({ 
  logo, 
  logoText, 
  menuItems, 
  backgroundColor, 
  customBackgroundColor,
  textColor,
  customTextColor, 
  logoColor,
  customLogoColor,
  linkColor,
  customLinkColor,
  hoverColor,
  customHoverColor,
  padding,
  customPadding,
  alignment
}: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditingMenu, setIsEditingMenu] = useState(false);
  const [tempMenuItems, setTempMenuItems] = useState('');
  // Extract actual values from Puck's React elements
  const logoValue = (logo && typeof logo === 'object' && 'props' in logo && logo.props && 'value' in logo.props) ? logo.props.value : '';
  const logoTextValue = (logoText && typeof logoText === 'object' && 'props' in logoText && logoText.props && 'value' in logoText.props) ? logoText.props.value : '';
  const menuItemsValue = (menuItems && typeof menuItems === 'object' && 'props' in menuItems && menuItems.props && 'value' in menuItems.props) ? menuItems.props.value : '';
  
  // Handle color selections with custom fallbacks
  const finalBackgroundColor = backgroundColor === 'custom' ? customBackgroundColor : backgroundColor;
  const finalTextColor = textColor === 'custom' ? customTextColor : textColor;
  const finalLogoColor = logoColor === 'custom' ? customLogoColor : logoColor;
  const finalLinkColor = linkColor === 'custom' ? customLinkColor : linkColor;
  const finalHoverColor = hoverColor === 'custom' ? customHoverColor : hoverColor;
  const finalPadding = padding === 'custom' ? customPadding : padding;
  
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

  const justifyContentClass = alignment === 'center' ? 'justify-center' : alignment === 'right' ? 'justify-end' : 'justify-between'

  return (
    <nav 
      style={{
        backgroundColor: finalBackgroundColor || '#27115F',
        padding: finalPadding || '1rem 2rem'
      }}
      className="shadow-md relative z-[1000] min-h-[60px]"
    >
      <div className={`flex items-center ${justifyContentClass} max-w-[1200px] mx-auto flex-wrap gap-4 nav-container`}>
        {/* Logo Section */}
        <div className="logo-section flex items-center gap-2 flex-shrink-0">
          {logoValue && (
            <img 
              src={logoValue} 
              alt={logoTextValue || 'Logo'} 
              className="h-10 w-auto object-contain"
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
              color: finalLogoColor || finalTextColor || '#ffffff'
            }}
            className="text-2xl font-bold cursor-text min-w-[100px] outline-none"
          >
            {logoText}
          </div>
        </div>

        {/* Mobile Icons Section */}
        <div className="mobile-icons hidden items-center gap-4">
          {/* Headphones Icon */}
          <div 
            className="text-white text-xl cursor-pointer p-2 rounded transition-colors duration-300 hover:bg-white/10"
          >
            🎧
          </div>

          {/* Bell Icon */}
          <div 
            className="text-white text-xl cursor-pointer p-2 rounded transition-colors duration-300 hover:bg-white/10"
          >
            🔔
          </div>

          {/* Profile Picture */}
          <div className="w-9 h-9 rounded-full border-2 border-white overflow-hidden cursor-pointer flex items-center justify-center bg-gray-100">
            <span className="text-lg">👤</span>
          </div>
        </div>

        {/* Desktop Menu Items */}
        <div className="desktop-menu flex items-center gap-8 flex-wrap">
          {parsedMenuItems.map((item: { label: string; link: string }, index: number) => (
            <a
              key={index}
              href={item.link}
              onClick={(e) => handleLinkClick(e, item.link)}
              style={{
                color: finalLinkColor || finalTextColor || '#ffffff'
              }}
              className={`no-underline font-medium text-base py-2 relative transition-colors duration-300 cursor-pointer flex items-center gap-1 ${index === 0 ? 'border-b border-white' : ''}`}
              data-puck-field={`menuItems`}
              contentEditable
              suppressContentEditableWarning={true}
            >
              {index === 0 && (
                <span className="text-sm">🏠</span>
              )}
              {item.label}
              {index > 0 && index < 6 && (
                <span className="text-xs">▼</span>
              )}
            </a>
          ))}
        </div>

        {/* Desktop Right Side User Elements */}
        <div className="desktop-user-elements flex items-center gap-4">
          {/* Edit Button */}
          <button
            onClick={startEditingMenu}
            className="bg-purple-600 text-white border-none rounded-md py-2 px-4 text-sm font-medium cursor-pointer flex items-center gap-1.5 transition-colors duration-300 hover:bg-purple-700"
          >
            <span className="text-sm">✏️</span>
            Edit
          </button>

          {/* Desktop Icons */}
          <div className="desktop-icons flex items-center gap-4">
            {/* Headphones Icon */}
            <div className="text-white text-xl cursor-pointer p-2 rounded transition-colors duration-300 hover:bg-white/10">
              🎧
            </div>

            {/* Bell Icon */}
            <div className="text-white text-xl cursor-pointer p-2 rounded transition-colors duration-300 hover:bg-white/10">
              🔔
            </div>

            {/* Profile Picture */}
            <div className="w-9 h-9 rounded-full border-2 border-white overflow-hidden cursor-pointer flex items-center justify-center bg-gray-100">
              <span className="text-lg">👤</span>
            </div>
          </div>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={toggleMobileMenu}
          className="mobile-menu-toggle hidden bg-none border-none cursor-pointer p-2 flex-col gap-1"
        >
          <div 
            style={{
              backgroundColor: textColor || '#ffffff',
              transform: isMobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
            }}
            className="w-[25px] h-0.5 transition-all duration-300"
          ></div>
          <div 
            style={{
              backgroundColor: textColor || '#ffffff',
              opacity: isMobileMenuOpen ? '0' : '1'
            }}
            className="w-[25px] h-0.5 transition-all duration-300"
          ></div>
          <div 
            style={{
              backgroundColor: textColor || '#ffffff',
              transform: isMobileMenuOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none'
            }}
            className="w-[25px] h-0.5 transition-all duration-300"
          ></div>
        </button>

      </div>

      {/* Mobile Menu Dropdown */}
      <div 
        style={{
          display: isMobileMenuOpen ? 'block' : 'none',
          backgroundColor: finalBackgroundColor || '#27115F'
        }}
        className="mobile-menu absolute top-full left-0 right-0 shadow-md z-[1000] py-4"
      >
        {parsedMenuItems.map((item: { label: string; link: string }, index: number) => (
          <a
            key={index}
            href={item.link}
            onClick={(e) => handleLinkClick(e, item.link)}
            style={{
              color: finalLinkColor || finalTextColor || '#ffffff'
            }}
            className="block no-underline font-medium text-lg py-4 px-8 border-b border-white/10 transition-colors duration-300 cursor-pointer hover:bg-white/10"
            data-puck-field={`menuItems`}
            contentEditable
            suppressContentEditableWarning={true}
          >
            {item.label}
          </a>
        ))}
      </div>

      {/* Menu Editing Interface */}
      {isEditingMenu && (
        <div 
          style={{
            background: finalBackgroundColor || '#27115F'
          }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-lg p-5 z-[10000] min-w-[400px] max-w-[600px] shadow-2xl"
        >
          <h3 className="m-0 mb-4 text-white">Edit Navigation Menu</h3>
          
          <div className="mb-4">
            <label className="block mb-1.5 font-bold text-white">
              Menu Items (format: Label|Link, Label|Link):
            </label>
            <textarea
              value={tempMenuItems}
              onChange={(e) => setTempMenuItems(e.target.value)}
              className="w-full h-[100px] p-2 border border-gray-300 rounded text-sm resize-y"
              placeholder="About|/about,Speakers|/speakers,Schedule|/schedule"
            />
          </div>

          <div className="mb-4">
            <button
              onClick={addMenuItem}
              className="bg-blue-500 text-white border-none py-2 px-4 rounded cursor-pointer mr-2.5 hover:bg-blue-600 transition-colors"
            >
              ➕ Add Item
            </button>
            <span className="text-xs text-white">
              Click to add a new menu item
            </span>
          </div>

          <div className="mb-5">
            <h4 className="m-0 mb-2.5 text-sm text-white">Current Menu Items:</h4>
            {parsedMenuItems.map((item: { label: string; link: string }, index: number) => (
              <div key={index} className="flex justify-between items-center p-2 bg-purple-600 mb-1.5 rounded">
                <span className="text-sm text-white">
                  <strong>{item.label}</strong> → {item.link}
                </span>
                <button
                  onClick={() => deleteMenuItem(index)}
                  className="bg-red-500 text-white border-none py-1 px-2 rounded cursor-pointer text-xs hover:bg-red-600 transition-colors"
                >
                  🗑️ Delete
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2.5 justify-end">
            <button
              onClick={cancelMenuEdit}
              className="bg-gray-500 text-white border-none py-2.5 px-5 rounded cursor-pointer hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveMenuChanges}
              className="bg-green-500 text-white border-none py-2.5 px-5 rounded cursor-pointer hover:bg-green-600 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* CSS for responsive behavior */}
      <style>{`
        nav * {
          color: #ffffff !important;
        }
        nav a {
          color: #ffffff !important;
        }
        nav a:hover {
          color: ${finalHoverColor || '#E0E0E0'} !important;
        }
        .mobile-menu a:hover {
          background-color: rgba(255,255,255,0.1) !important;
        }
        nav button {
          color: #ffffff !important;
        }
        nav span {
          color: #ffffff !important;
        }
        nav div {
          color: #ffffff !important;
        }
        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          .desktop-user-elements {
            display: none !important;
          }
          .mobile-icons {
            display: flex !important;
          }
          .mobile-menu-toggle {
            display: flex !important;
          }
          .nav-container {
            justify-content: space-between !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-menu {
            display: none !important;
          }
          .mobile-icons {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  )
}

export default Navigation
