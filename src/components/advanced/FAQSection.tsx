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
  
  // Dynamic styles that need to remain inline
  const containerStyle: React.CSSProperties = {
    backgroundColor,
    padding
  }

  const handleButtonHover = (e: React.MouseEvent<HTMLAnchorElement>, isEntering: boolean) => {
    if (isEntering) {
      e.currentTarget.style.backgroundColor = '#7c3aed'
      e.currentTarget.classList.add('-translate-y-0.5')
    } else {
      e.currentTarget.style.backgroundColor = '#8b5cf6'
      e.currentTarget.classList.remove('-translate-y-0.5')
    }
  }

  const handleButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setIsContactModalOpen(true)
  }

  const handleFaqHover = (e: React.MouseEvent<HTMLDivElement>, isEntering: boolean) => {
    if (isEntering) {
      e.currentTarget.classList.add('-translate-y-1', 'shadow-lg')
      e.currentTarget.classList.remove('shadow-sm')
    } else {
      e.currentTarget.classList.remove('-translate-y-1', 'shadow-lg')
      e.currentTarget.classList.add('shadow-sm')
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
      <section style={containerStyle} className="w-full min-h-[600px] faq-section-container">
        <div className="max-w-[1200px] mx-auto faq-section-content">
        <div className="text-center mb-16 faq-section-header">
          <h2 
            className="text-[clamp(1.75rem,5vw,2.5rem)] font-bold text-gray-800 mb-4 leading-tight faq-section-title"
            data-puck-field="title"
            contentEditable
            suppressContentEditableWarning={true}
          >
            {title}
          </h2>
          <p 
            className="text-[clamp(1rem,3vw,1.25rem)] text-gray-500 leading-relaxed faq-section-subtitle"
            data-puck-field="subtitle"
            contentEditable
            suppressContentEditableWarning={true}
          >
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 faq-section-grid">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="p-6 bg-white rounded-xl shadow-sm transition-all duration-300 faq-section-item"
              onMouseEnter={(e) => handleFaqHover(e, true)}
              onMouseLeave={(e) => handleFaqHover(e, false)}
            >
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl mb-6 mx-auto faq-section-icon">
                {faq.icon}
              </div>
              <h3 
                className="text-[clamp(1rem,2.5vw,1.125rem)] font-semibold text-gray-800 mb-3 leading-snug faq-section-question"
                data-puck-field={`faqs[${index}].question`}
                contentEditable
                suppressContentEditableWarning={true}
              >
                {faq.question}
              </h3>
              <p 
                className="text-[clamp(0.9rem,2vw,1rem)] text-gray-500 leading-relaxed faq-section-answer"
                data-puck-field={`faqs[${index}].answer`}
                contentEditable
                suppressContentEditableWarning={true}
              >
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-8 p-8 bg-white rounded-xl shadow-sm mt-8 flex-col md:flex-row md:text-left text-center faq-section-cta">
          <div className="flex items-center -space-x-2 faq-section-avatars">
            <div className="w-10 h-10 rounded-full border-2 border-white -ml-2 bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-500">A</div>
            <div className="w-10 h-10 rounded-full border-2 border-white -ml-2 bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-500">B</div>
            <div className="w-10 h-10 rounded-full border-2 border-white -ml-2 bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-500">C</div>
          </div>
          <p 
            className="text-base text-gray-800 leading-relaxed flex-1"
            data-puck-field="ctaText"
            contentEditable
            suppressContentEditableWarning={true}
          >
            {ctaText}
          </p>
          <a
            href="#contact"
            style={{ backgroundColor: '#8b5cf6' }}
            className="text-white border-none rounded-lg py-3 px-6 text-base font-semibold cursor-pointer transition-all duration-300 no-underline inline-block hover:bg-purple-600"
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
