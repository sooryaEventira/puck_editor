import React, { useState } from 'react'

interface ContactFormProps {
  isOpen?: boolean
  onClose?: () => void
  title?: string
  subtitle?: string
  buttonText?: string
  privacyText?: string
  privacyLink?: string
}

const ContactForm: React.FC<ContactFormProps> = ({
  isOpen = false,
  onClose,
  title = "Get in touch",
  subtitle = "We'd love to hear from you. Please fill out this form.",
  buttonText = "Send message",
  privacyText = "You agree to our friendly privacy policy.",
  privacyLink = "#privacy"
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'US',
    message: '',
    agreeToPrivacy: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    // You can add your form submission logic here
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onClose) {
      onClose()
    }
  }

  if (!isOpen) return null

  const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '16px'
  }

  const modalContentStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '1.5rem',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '95vh',
    overflowY: 'auto',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    margin: '0 auto'
  }

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '2rem'
  }

  const contactLabelStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: '#8b5cf6',
    fontWeight: '600',
    marginBottom: '0.5rem'
  }

  const titleStyle: React.CSSProperties = {
    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '0.5rem',
    lineHeight: '1.1'
  }

  const subtitleStyle: React.CSSProperties = {
    fontSize: '1rem',
    color: '#6b7280',
    lineHeight: '1.5'
  }

  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  }

  const rowStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  }

  const fieldGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151'
  }

  const inputStyle: React.CSSProperties = {
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '1rem',
    color: '#1f2937',
    backgroundColor: '#ffffff',
    transition: 'border-color 0.2s ease'
  }

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: '120px',
    resize: 'vertical'
  }

  const phoneContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  }

  const countrySelectStyle: React.CSSProperties = {
    ...inputStyle,
    minWidth: '80px',
    width: '80px',
    padding: '0.75rem 0.5rem',
    flexShrink: 0
  }

  const phoneInputStyle: React.CSSProperties = {
    ...inputStyle,
    flex: 1,
    minWidth: '200px'
  }

  const checkboxContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem'
  }

  const checkboxStyle: React.CSSProperties = {
    width: '16px',
    height: '16px',
    marginTop: '2px'
  }

  const privacyTextStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: '#6b7280',
    lineHeight: '1.5'
  }

  const privacyLinkStyle: React.CSSProperties = {
    color: '#8b5cf6',
    textDecoration: 'underline',
    cursor: 'pointer'
  }

  const buttonStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '0.875rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    width: '100%'
  }

  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '0.75rem',
    right: '0.75rem',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#6b7280',
    padding: '0.5rem',
    borderRadius: '4px',
    transition: 'color 0.2s ease',
    zIndex: 10
  }

  return (
    <>
      <style>
        {`
          @media (max-width: 640px) {
            .contact-form-modal {
              padding: 12px !important;
            }
            .contact-form-content {
              padding: 1rem !important;
              margin: 0 !important;
              border-radius: 8px !important;
            }
            .contact-form-row {
              grid-template-columns: 1fr !important;
            }
            .contact-form-phone-container {
              flex-direction: column !important;
            }
            .contact-form-country-select {
              width: 100% !important;
              min-width: auto !important;
            }
            .contact-form-phone-input {
              min-width: auto !important;
            }
            .contact-form-checkbox-container {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 0.5rem !important;
            }
          }
          @media (max-width: 480px) {
            .contact-form-title {
              font-size: 1.5rem !important;
            }
            .contact-form-subtitle {
              font-size: 0.9rem !important;
            }
          }
        `}
      </style>
      <div style={modalOverlayStyle} onClick={handleOverlayClick} className="contact-form-modal">
        <div style={modalContentStyle} className="contact-form-content">
        <button
          style={closeButtonStyle}
          onClick={onClose}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#374151'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#6b7280'
          }}
        >
          ×
        </button>
        
        <div style={headerStyle}>
          <div style={contactLabelStyle}>Contact us</div>
          <h2 style={titleStyle} className="contact-form-title">{title}</h2>
          <p style={subtitleStyle} className="contact-form-subtitle">{subtitle}</p>
        </div>

        <form style={formStyle} onSubmit={handleSubmit}>
          <div style={rowStyle} className="contact-form-row">
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>
                First name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First name"
                style={inputStyle}
                required
              />
            </div>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>
                Last name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last name"
                style={inputStyle}
                required
              />
            </div>
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>
              Email <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@company.com"
              style={inputStyle}
              required
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Phone number</label>
            <div style={phoneContainerStyle} className="contact-form-phone-container">
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                style={countrySelectStyle}
                className="contact-form-country-select"
              >
                <option value="US">US</option>
                <option value="CA">CA</option>
                <option value="UK">UK</option>
                <option value="AU">AU</option>
                <option value="DE">DE</option>
                <option value="FR">FR</option>
              </select>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 000-0000"
                style={phoneInputStyle}
                className="contact-form-phone-input"
              />
            </div>
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>
              Message <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Leave us a message..."
              style={textareaStyle}
              required
            />
          </div>

          <div style={checkboxContainerStyle} className="contact-form-checkbox-container">
            <input
              type="checkbox"
              name="agreeToPrivacy"
              checked={formData.agreeToPrivacy}
              onChange={handleInputChange}
              style={checkboxStyle}
              required
            />
            <div style={privacyTextStyle}>
              {privacyText.split('privacy policy')[0]}
              <span style={privacyLinkStyle}>privacy policy</span>
              {privacyText.split('privacy policy')[1]}
            </div>
          </div>

          <button
            type="submit"
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(139, 92, 246, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {buttonText}
          </button>
        </form>
        </div>
      </div>
    </>
  )
}

export default ContactForm
