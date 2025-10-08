import React, { useState } from 'react'

interface FAQItem {
  id: string
  question: string
  answer: string
}

interface FAQAccordionProps {
  title?: string
  subtitle?: string
  faqs?: FAQItem[]
  allowMultiple?: boolean
  backgroundColor?: string
  textColor?: string
  questionColor?: string
  answerColor?: string
  borderColor?: string
  padding?: string
  spacing?: string
  iconColor?: string
  hoverColor?: string
}

const FAQAccordion: React.FC<FAQAccordionProps> = ({
  title = "Frequently Asked Questions",

  faqs = [
    {
      id: '1',
      question: 'What is this service about?',
      answer: 'This service provides comprehensive solutions for your business needs. We offer a wide range of features and support to help you achieve your goals.'
    },
    {
      id: '2',
      question: 'How do I get started?',
      answer: 'Getting started is easy! Simply sign up for an account, complete the onboarding process, and you\'ll be ready to use all our features within minutes.'
    },
    {
      id: '3',
      question: 'Is there a free trial available?',
      answer: 'Yes, we offer a 30-day free trial for all new users. No credit card required to start your trial period.'
    },
    {
      id: '4',
      question: 'What kind of support do you provide?',
      answer: 'We provide 24/7 customer support through email, chat, and phone. Our support team is always ready to help you with any questions or issues.'
    },
    {
      id: '5',
      question: 'Can I cancel my subscription anytime?',
      answer: 'Absolutely! You can cancel your subscription at any time from your account settings. There are no cancellation fees or long-term contracts.'
    }
  ],
  allowMultiple = false,
  backgroundColor = '#ffffff',
  textColor = '#333333',
  questionColor = '#1f2937',
  answerColor = '#6b7280',
  borderColor = '#e5e7eb',
  padding = '3rem 2rem',
  spacing = '1rem',
  iconColor = '#8b5cf6',
  hoverColor = '#f8fafc'
}) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev)
      const wasOpen = newSet.has(id)
      
      if (wasOpen) {
        newSet.delete(id)
      } else {
        if (!allowMultiple) {
          newSet.clear()
        }
        newSet.add(id)
      }
      
      // Update background colors after state change
      setTimeout(() => {
        const faqItem = document.querySelector(`[data-faq-id="${id}"]`) as HTMLDivElement
        const questionButton = faqItem?.querySelector('.faq-accordion-question') as HTMLButtonElement
        const answerContent = faqItem?.querySelector('.faq-accordion-answer') as HTMLDivElement
        
        if (faqItem && questionButton && answerContent) {
          if (newSet.has(id)) {
            // Question is now open - set white background
            questionButton.style.backgroundColor = '#ffffff'
            answerContent.style.backgroundColor = '#ffffff'
          } else {
            // Question is now closed - reset to default
            questionButton.style.backgroundColor = 'transparent'
            answerContent.style.backgroundColor = '#f8fafc'
          }
        }
      }, 0)
      
      return newSet
    })
  }

  const containerStyle: React.CSSProperties = {
    backgroundColor,
    padding,
    width: '100%',
    minHeight: '400px'
  }

  const contentStyle: React.CSSProperties = {
    maxWidth: '800px',
    margin: '0 auto'
  }

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '3rem'
  }

  const titleStyle: React.CSSProperties = {
    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
    fontWeight: '600',
    color: questionColor,
    marginBottom: '1rem',
    lineHeight: '1.2'
  }


  const faqContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing
  }

  const faqItemStyle: React.CSSProperties = {
    border: `1px solid ${borderColor}`,
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    backgroundColor: '#f8fafc'
  }

  const questionButtonStyle: React.CSSProperties = {
    width: '100%',
    padding: '1.5rem',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: 'none',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'left',
    transition: 'all 0.3s ease',
    fontSize: '1.125rem',
    fontWeight: '600',
    color: questionColor,
    lineHeight: '1.4'
  }

  const questionTextStyle: React.CSSProperties = {
    flex: 1,
    marginRight: '1rem'
  }

  const iconStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    color: iconColor,
    transition: 'transform 0.3s ease',
    flexShrink: 0
  }

  const answerContainerStyle: React.CSSProperties = {
    maxHeight: '0',
    overflow: 'hidden',
    transition: 'max-height 0.3s ease',
    backgroundColor: 'transparent'
  }

  const answerContentStyle: React.CSSProperties = {
    padding: '0 1.5rem 1.5rem 1.5rem',
    fontSize: '1rem',
    color: answerColor,
    lineHeight: '1.6',
    backgroundColor: '#f8fafc'
  }

  const handleQuestionHover = (e: React.MouseEvent<HTMLDivElement>, isEntering: boolean) => {
    const questionButton = e.currentTarget.querySelector('.faq-accordion-question') as HTMLButtonElement
    const answerContainer = e.currentTarget.querySelector('.faq-accordion-answer-container') as HTMLDivElement
    const answerContent = e.currentTarget.querySelector('.faq-accordion-answer') as HTMLDivElement
    const isOpen = openItems.has(e.currentTarget.dataset.faqId || '')
    
    if (questionButton) {
      if (isEntering) {
        if (isOpen) {
          questionButton.style.backgroundColor = '#ffffff'
          if (answerContent) answerContent.style.backgroundColor = '#ffffff'
        } else {
          questionButton.style.backgroundColor = hoverColor
        }
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
      } else {
        if (isOpen) {
          questionButton.style.backgroundColor = '#ffffff'
          if (answerContent) answerContent.style.backgroundColor = '#ffffff'
        } else {
          questionButton.style.backgroundColor = 'transparent'
        }
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }
    }
  }

  return (
    <>
      <style>
        {`
          .faq-accordion-question {
            border: none !important;
            border-bottom: none !important;
            outline: none !important;
            box-shadow: none !important;
          }
          .faq-accordion-answer-container {
            border: none !important;
            border-top: none !important;
            outline: none !important;
            box-shadow: none !important;
          }
          .faq-accordion-item {
            border: 1px solid ${borderColor} !important;
            border-bottom: 1px solid ${borderColor} !important;
          }
          .faq-accordion-item:focus-within {
            border: 1px solid ${borderColor} !important;
          }
          @media (max-width: 768px) {
            .faq-accordion-container {
              padding: 2rem 1rem !important;
            }
            .faq-accordion-header {
              margin-bottom: 2rem !important;
            }
            .faq-accordion-title {
              font-size: 1.5rem !important;
            }
            .faq-accordion-subtitle {
              font-size: 0.9rem !important;
            }
            .faq-accordion-question {
              font-size: 1rem !important;
              padding: 1rem !important;
            }
            .faq-accordion-answer {
              font-size: 0.9rem !important;
              padding: 0 1rem 1rem 1rem !important;
            }
          }
          @media (max-width: 480px) {
            .faq-accordion-container {
              padding: 1.5rem 1rem !important;
            }
            .faq-accordion-title {
              font-size: 1.25rem !important;
            }
            .faq-accordion-subtitle {
              font-size: 0.85rem !important;
            }
            .faq-accordion-question {
              font-size: 0.95rem !important;
              padding: 0.75rem !important;
            }
            .faq-accordion-answer {
              font-size: 0.85rem !important;
              padding: 0 0.75rem 0.75rem 0.75rem !important;
            }
          }
        `}
      </style>
      <section style={containerStyle} className="faq-accordion-container">
        <div style={contentStyle} className="faq-accordion-content">
          <div style={headerStyle} className="faq-accordion-header">
            <h2 
              style={titleStyle}
              className="faq-accordion-title"
              data-puck-field="title"
              contentEditable
              suppressContentEditableWarning={true}
            >
              {title}
            </h2>
          </div>

          <div style={faqContainerStyle} className="faq-accordion-list">
            {faqs.map((faq, index) => {
              const isOpen = openItems.has(faq.id)
              const answerStyle = {
                ...answerContainerStyle,
                maxHeight: isOpen ? '200px' : '0'
              }

               return (
                 <div 
                   key={faq.id} 
                   style={faqItemStyle} 
                   className="faq-accordion-item"
                   data-faq-id={faq.id}
                   onMouseEnter={(e) => handleQuestionHover(e, true)}
                   onMouseLeave={(e) => handleQuestionHover(e, false)}
                 >
                   <button
                     style={questionButtonStyle}
                     className="faq-accordion-question"
                     onClick={() => toggleItem(faq.id)}
                     data-puck-field={`faqs[${index}].question`}
                     contentEditable
                     suppressContentEditableWarning={true}
                   >
                    <span style={questionTextStyle}>{faq.question}</span>
                    <span 
                      style={{
                        ...iconStyle,
                        transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)'
                      }}
                    >
                      +
                    </span>
                  </button>
                  
                  <div style={answerStyle} className="faq-accordion-answer-container">
                    <div 
                      style={answerContentStyle}
                      className="faq-accordion-answer"
                      data-puck-field={`faqs[${index}].answer`}
                      contentEditable
                      suppressContentEditableWarning={true}
                    >
                      {faq.answer}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

export default FAQAccordion
