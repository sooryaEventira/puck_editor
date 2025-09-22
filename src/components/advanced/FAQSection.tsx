import React, { useState } from 'react'
import ContactForm from './ContactForm'

interface FAQItem {
  id: string
  icon: string
  question: string
  answer: string
}

interface FAQSectionProps {
  title?: string
  subtitle?: string
  faqs?: FAQItem[]
  ctaText?: string
  buttonText?: string
  backgroundColor?: string
  padding?: string
}

const FAQSection: React.FC<FAQSectionProps> = ({
  title = "Frequently asked questions",
  subtitle = "Everything you need to know about the product and billing.",
  faqs = [
    {
      id: '1',
      icon: '❤️',
      question: 'Is there a free trial available?',
      answer: 'Yes, you can try us for free for 30 days. If you want, we\'ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.'
    },
    {
      id: '2',
      icon: '🔄',
      question: 'Can I change my plan later?',
      answer: 'Of course. Our pricing scales with your company. Chat to our friendly team to find a solution that works for you.'
    },
    {
      id: '3',
      icon: '🚫',
      question: 'What is your cancellation policy?',
      answer: 'We understand that things change. You can cancel your plan at any time and we\'ll refund you the difference already paid.'
    },
    {
      id: '4',
      icon: '📄',
      question: 'Can other info be added to an invoice?',
      answer: 'Absolutely. You can add any additional information you need to your invoices, including custom fields and notes.'
    },
    {
      id: '5',
      icon: '⚡',
      question: 'How does billing work?',
      answer: 'We offer flexible billing options. You can choose monthly or annual billing, and we accept all major credit cards and payment methods.'
    },
    {
      id: '6',
      icon: '✉️',
      question: 'How do I change my account email?',
      answer: 'You can update your account email anytime from your account settings. We\'ll send a confirmation email to verify the change.'
    }
  ],
  ctaText = "Still have questions? Can't find the answer you're looking for? Please chat to our friendly team.",
  buttonText = "Get in touch",
  backgroundColor = '#f8fafc',
  padding = '6rem 2rem'
}) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const containerStyle: React.CSSProperties = {
    backgroundColor,
    padding,
    width: '100%',
    minHeight: '600px'
  }

  const contentStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto'
  }

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '4rem'
  }

  const titleStyle: React.CSSProperties = {
    fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '1rem',
    lineHeight: '1.1'
  }

  const subtitleStyle: React.CSSProperties = {
    fontSize: 'clamp(1rem, 3vw, 1.25rem)',
    color: '#6b7280',
    lineHeight: '1.5'
  }

  const faqGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem'
  }

  const faqItemStyle: React.CSSProperties = {
    padding: '1.5rem',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease'
  }

  const iconStyle: React.CSSProperties = {
    width: '48px',
    height: '48px',
    backgroundColor: '#f3e8ff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    marginBottom: '1.5rem',
    margin: '0 auto 1.5rem auto'
  }

  const questionStyle: React.CSSProperties = {
    fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '0.75rem',
    lineHeight: '1.4'
  }

  const answerStyle: React.CSSProperties = {
    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
    color: '#6b7280',
    lineHeight: '1.6'
  }

  const ctaSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    padding: '2rem',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    marginTop: '2rem'
  }

  const avatarsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '-0.5rem'
  }

  const avatarStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '2px solid #ffffff',
    marginLeft: '-8px',
    backgroundColor: '#e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
    color: '#6b7280'
  }

  const ctaTextStyle: React.CSSProperties = {
    fontSize: '1rem',
    color: '#1f2937',
    lineHeight: '1.5',
    flex: 1
  }

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#8b5cf6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    display: 'inline-block'
  }

  const handleButtonHover = (e: React.MouseEvent<HTMLAnchorElement>, isEntering: boolean) => {
    if (isEntering) {
      e.currentTarget.style.backgroundColor = '#7c3aed'
      e.currentTarget.style.transform = 'translateY(-2px)'
    } else {
      e.currentTarget.style.backgroundColor = '#8b5cf6'
      e.currentTarget.style.transform = 'translateY(0)'
    }
  }

  const handleButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setIsContactModalOpen(true)
  }

  const handleFaqHover = (e: React.MouseEvent<HTMLDivElement>, isEntering: boolean) => {
    if (isEntering) {
      e.currentTarget.style.transform = 'translateY(-4px)'
      e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)'
    } else {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
    }
  }

  return (
    <>
      <style>
        {`
          @media (max-width: 768px) {
            .faq-section-container {
              padding: 3rem 1rem !important;
            }
            .faq-section-header {
              margin-bottom: 2rem !important;
            }
            .faq-section-grid {
              grid-template-columns: 1fr !important;
              gap: 1rem !important;
              margin-bottom: 2rem !important;
            }
            .faq-section-item {
              padding: 1rem !important;
            }
            .faq-section-cta {
              flex-direction: column !important;
              gap: 1rem !important;
              text-align: center !important;
            }
            .faq-section-avatars {
              justify-content: center !important;
            }
          }
          @media (max-width: 480px) {
            .faq-section-container {
              padding: 2rem 1rem !important;
            }
            .faq-section-title {
              font-size: 1.5rem !important;
            }
            .faq-section-subtitle {
              font-size: 0.9rem !important;
            }
            .faq-section-question {
              font-size: 0.95rem !important;
            }
            .faq-section-answer {
              font-size: 0.85rem !important;
            }
            .faq-section-icon {
              width: 40px !important;
              height: 40px !important;
              font-size: 20px !important;
            }
          }
          @media (min-width: 1200px) {
            .faq-section-grid {
              grid-template-columns: repeat(3, 1fr) !important;
              gap: 2rem !important;
            }
          }
        `}
      </style>
      <section style={containerStyle} className="faq-section-container">
        <div style={contentStyle} className="faq-section-content">
        <div style={headerStyle} className="faq-section-header">
          <h2 
            style={titleStyle}
            className="faq-section-title"
            data-puck-field="title"
            contentEditable
            suppressContentEditableWarning={true}
          >
            {title}
          </h2>
          <p 
            style={subtitleStyle}
            className="faq-section-subtitle"
            data-puck-field="subtitle"
            contentEditable
            suppressContentEditableWarning={true}
          >
            {subtitle}
          </p>
        </div>

        <div style={faqGridStyle} className="faq-section-grid">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              style={faqItemStyle}
              className="faq-section-item"
              onMouseEnter={(e) => handleFaqHover(e, true)}
              onMouseLeave={(e) => handleFaqHover(e, false)}
            >
              <div style={iconStyle} className="faq-section-icon">
                {faq.icon}
              </div>
              <h3 
                style={questionStyle}
                className="faq-section-question"
                data-puck-field={`faqs[${index}].question`}
                contentEditable
                suppressContentEditableWarning={true}
              >
                {faq.question}
              </h3>
              <p 
                style={answerStyle}
                className="faq-section-answer"
                data-puck-field={`faqs[${index}].answer`}
                contentEditable
                suppressContentEditableWarning={true}
              >
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div style={ctaSectionStyle} className="faq-section-cta">
          <div style={avatarsStyle} className="faq-section-avatars">
            <div style={avatarStyle}>A</div>
            <div style={avatarStyle}>B</div>
            <div style={avatarStyle}>C</div>
          </div>
          <p 
            style={ctaTextStyle}
            data-puck-field="ctaText"
            contentEditable
            suppressContentEditableWarning={true}
          >
            {ctaText}
          </p>
          <a
            href="#contact"
            style={buttonStyle}
            onClick={handleButtonClick}
            onMouseEnter={(e) => handleButtonHover(e, true)}
            onMouseLeave={(e) => handleButtonHover(e, false)}
            data-puck-field="buttonText"
            contentEditable
            suppressContentEditableWarning={true}
          >
            {buttonText}
          </a>
        </div>
        </div>
        
        <ContactForm
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
        />
      </section>
    </>
  )
}

export default FAQSection
