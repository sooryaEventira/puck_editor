import React from 'react'

interface PricingPlan {
  id: string
  icon: string
  title: string
  price: string
  billingNote: string
  features: string[]
  buttonText: string
}

interface PricingPlansProps {
  plans?: PricingPlan[]
  backgroundColor?: string
  padding?: string
}

const PricingPlans: React.FC<PricingPlansProps> = ({
  plans = [
    {
      id: 'basic',
      icon: '⚡',
      title: 'Basic plan',
      price: '$10',
      billingNote: 'Billed annually.',
      features: [
        'Access to all basic features',
        'Basic reporting and analytics',
        'Up to 10 individual users',
        '20 GB individual data',
        'Basic chat and email support'
      ],
      buttonText: 'Get started'
    },
    {
      id: 'business',
      icon: '📊',
      title: 'Business plan',
      price: '$20',
      billingNote: 'Billed annually.',
      features: [
        '200+ integrations',
        'Advanced reporting and analytics',
        'Up to 20 individual users',
        '40 GB individual data',
        'Priority chat and email support'
      ],
      buttonText: 'Get started'
    },
    {
      id: 'enterprise',
      icon: '🏢',
      title: 'Enterprise plan',
      price: '$40',
      billingNote: 'Billed annually.',
      features: [
        'Advanced custom fields',
        'Audit log and data history',
        'Unlimited individual users',
        'Unlimited individual data',
        'Personalized + priority service'
      ],
      buttonText: 'Get started'
    }
  ],
  backgroundColor = '#f3e8ff',
  padding = '6rem 2rem'
}) => {
  // Dynamic styles that need to remain inline
  const containerStyle: React.CSSProperties = {
    backgroundColor,
    padding
  }

  const handleCardHover = (e: React.MouseEvent<HTMLDivElement>, isEntering: boolean) => {
    if (isEntering) {
      e.currentTarget.classList.add('-translate-y-1', 'shadow-xl')
      e.currentTarget.classList.remove('shadow-sm')
    } else {
      e.currentTarget.classList.remove('-translate-y-1', 'shadow-xl')
      e.currentTarget.classList.add('shadow-sm')
    }
  }

  const handleButtonHover = (e: React.MouseEvent<HTMLAnchorElement>, isEntering: boolean) => {
    if (isEntering) {
      e.currentTarget.style.backgroundColor = '#7c3aed'
    } else {
      e.currentTarget.style.backgroundColor = '#8b5cf6'
    }
  }

  return (
    <>
      <style>
        {`
          @media (max-width: 768px) {
            .pricing-container {
              padding: 3rem 1rem !important;
            }
            .pricing-grid {
              grid-template-columns: 1fr !important;
              gap: 1rem !important;
            }
            .pricing-card {
              padding: 1.25rem !important;
            }
            .pricing-icon {
              width: 40px !important;
              height: 40px !important;
              font-size: 20px !important;
            }
            .pricing-title {
              font-size: 1rem !important;
            }
            .pricing-price {
              font-size: 2rem !important;
            }
            .pricing-billing {
              font-size: 0.75rem !important;
              margin-bottom: 1rem !important;
            }
            .pricing-feature {
              font-size: 0.8rem !important;
              margin-bottom: 0.5rem !important;
            }
            .pricing-features {
              margin-bottom: 1rem !important;
            }
          }
          @media (max-width: 480px) {
            .pricing-container {
              padding: 2rem 1rem !important;
            }
            .pricing-card {
              padding: 1rem !important;
            }
            .pricing-icon {
              width: 36px !important;
              height: 36px !important;
              font-size: 18px !important;
            }
            .pricing-title {
              font-size: 0.95rem !important;
            }
            .pricing-price {
              font-size: 1.75rem !important;
            }
            .pricing-billing {
              font-size: 0.7rem !important;
            }
            .pricing-feature {
              font-size: 0.75rem !important;
            }
            .pricing-button {
              padding: 0.625rem 1.25rem !important;
              font-size: 0.9rem !important;
            }
          }
          @media (min-width: 1200px) {
            .pricing-grid {
              grid-template-columns: repeat(3, 1fr) !important;
              gap: 2rem !important;
            }
            .pricing-card {
              padding: 2rem !important;
            }
          }
        `}
      </style>
      <section style={containerStyle} className="w-full min-h-[600px] pricing-container">
        <div className="max-w-[1200px] mx-auto pricing-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start pricing-grid">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className="bg-white rounded-2xl p-6 shadow-sm transition-all duration-300 cursor-pointer flex flex-col h-full pricing-card"
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
            >
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-2xl mb-6 self-center pricing-icon">
                {plan.icon}
              </div>
              
              <h3 
                className="text-[clamp(1.125rem,3vw,1.25rem)] font-semibold text-purple-500 mb-4 text-center pricing-title"
                data-puck-field={`plans[${index}].title`}
                contentEditable
                suppressContentEditableWarning={true}
              >
                {plan.title}
              </h3>
              
              <div 
                className="text-[clamp(2rem,6vw,3rem)] font-bold text-gray-800 mb-2 text-center leading-none pricing-price"
                data-puck-field={`plans[${index}].price`}
                contentEditable
                suppressContentEditableWarning={true}
              >
                {plan.price}<span className="text-[clamp(1rem,3vw,1.5rem)] font-normal">/mth</span>
              </div>
              
              <p 
                className="text-[clamp(0.8rem,2vw,0.875rem)] text-gray-500 mb-6 text-center pricing-billing"
                data-puck-field={`plans[${index}].billingNote`}
                contentEditable
                suppressContentEditableWarning={true}
              >
                {plan.billingNote}
              </p>
              
              <ul className="list-none p-0 m-0 mb-6 flex-1 pricing-features">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center mb-3 text-[clamp(0.8rem,2vw,0.875rem)] text-gray-700 pricing-feature">
                    <span className="text-purple-500 mr-3 text-base font-bold">✓</span>
                    <span 
                      data-puck-field={`plans[${index}].features[${featureIndex}]`}
                      contentEditable
                      suppressContentEditableWarning={true}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              
              <a
                href="#get-started"
                style={{ backgroundColor: '#8b5cf6' }}
                className="text-white border-none rounded-lg py-3 px-6 text-base font-semibold cursor-pointer transition-all duration-300 w-full text-center no-underline block hover:bg-purple-600 pricing-button"
                onMouseEnter={(e) => handleButtonHover(e, true)}
                onMouseLeave={(e) => handleButtonHover(e, false)}
                data-puck-field={`plans[${index}].buttonText`}
                contentEditable
                suppressContentEditableWarning={true}
              >
                {plan.buttonText}
              </a>
            </div>
          ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default PricingPlans
