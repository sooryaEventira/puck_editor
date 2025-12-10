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
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4 contact-form-modal" onClick={handleOverlayClick}>
        <div className="bg-white rounded-xl p-6 max-w-[600px] w-full max-h-[95vh] overflow-y-auto shadow-xl mx-auto relative contact-form-content">
        <button
          className="absolute top-3 right-3 bg-none border-none text-2xl cursor-pointer text-gray-500 p-2 rounded transition-colors duration-200 z-10 hover:text-gray-700"
          onClick={onClose}
        >
          ×
        </button>
        
        <div className="text-center mb-8">
          <div className="text-sm text-purple-500 font-semibold mb-2">Contact us</div>
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-gray-800 mb-2 leading-tight contact-form-title">{title}</h2>
          <p className="text-base text-gray-500 leading-relaxed contact-form-subtitle">{subtitle}</p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 contact-form-row">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                First name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First name"
                className="px-3 py-3 border border-gray-300 rounded-md text-base text-gray-800 bg-white transition-colors duration-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Last name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last name"
                className="px-3 py-3 border border-gray-300 rounded-md text-base text-gray-800 bg-white transition-colors duration-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@company.com"
              className="px-3 py-3 border border-gray-300 rounded-md text-base text-gray-800 bg-white transition-colors duration-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Phone number</label>
            <div className="flex gap-2 flex-wrap contact-form-phone-container">
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="px-3 py-3 border border-gray-300 rounded-md text-base text-gray-800 bg-white transition-colors duration-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 min-w-[80px] w-20 flex-shrink-0 contact-form-country-select"
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
                className="px-3 py-3 border border-gray-300 rounded-md text-base text-gray-800 bg-white transition-colors duration-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 flex-1 min-w-[200px] contact-form-phone-input"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Leave us a message..."
              className="px-3 py-3 border border-gray-300 rounded-md text-base text-gray-800 bg-white transition-colors duration-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 min-h-[120px] resize-y"
              required
            />
          </div>

          <div className="flex items-start gap-3 contact-form-checkbox-container">
            <input
              type="checkbox"
              name="agreeToPrivacy"
              checked={formData.agreeToPrivacy}
              onChange={handleInputChange}
              className="w-4 h-4 mt-0.5"
              required
            />
            <div className="text-sm text-gray-500 leading-relaxed">
              {privacyText.split('privacy policy')[0]}
              <span className="text-purple-500 underline cursor-pointer">privacy policy</span>
              {privacyText.split('privacy policy')[1]}
            </div>
          </div>

          <button
            type="submit"
            style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}
            className="text-white border-none rounded-lg py-3.5 px-6 text-base font-semibold cursor-pointer transition-all duration-300 w-full hover:-translate-y-0.5 hover:shadow-lg"
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(139, 92, 246, 0.3)'
            }}
            onMouseLeave={(e) => {
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
