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

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    alignItems: 'start'
  }

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  }

  const iconStyle: React.CSSProperties = {
    width: '48px',
    height: '48px',
    backgroundColor: '#8b5cf6',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    marginBottom: '1.5rem',
    alignSelf: 'center'
  }

  const titleStyle: React.CSSProperties = {
    fontSize: 'clamp(1.125rem, 3vw, 1.25rem)',
    fontWeight: '600',
    color: '#8b5cf6',
    marginBottom: '1rem',
    textAlign: 'center'
  }

  const priceStyle: React.CSSProperties = {
    fontSize: 'clamp(2rem, 6vw, 3rem)',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '0.5rem',
    textAlign: 'center',
    lineHeight: '1'
  }

  const billingStyle: React.CSSProperties = {
    fontSize: 'clamp(0.8rem, 2vw, 0.875rem)',
    color: '#6b7280',
    marginBottom: '1.5rem',
    textAlign: 'center'
  }

  const featuresListStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    marginBottom: '1.5rem',
    flex: 1
  }

  const featureItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.75rem',
    fontSize: 'clamp(0.8rem, 2vw, 0.875rem)',
    color: '#374151'
  }

  const checkmarkStyle: React.CSSProperties = {
    color: '#8b5cf6',
    marginRight: '0.75rem',
    fontSize: '16px',
    fontWeight: 'bold'
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
    width: '100%',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'block'
  }

  const handleCardHover = (e: React.MouseEvent<HTMLDivElement>, isEntering: boolean) => {
    if (isEntering) {
      e.currentTarget.style.transform = 'translateY(-4px)'
      e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    } else {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
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
      <section style={containerStyle} className="pricing-container">
        <div style={contentStyle} className="pricing-content">
          <div style={gridStyle} className="pricing-grid">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              style={cardStyle}
              className="pricing-card"
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
            >
              <div style={iconStyle} className="pricing-icon">
                {plan.icon}
              </div>
              
              <h3 
                style={titleStyle}
                className="pricing-title"
                data-puck-field={`plans[${index}].title`}
                contentEditable
                suppressContentEditableWarning={true}
              >
                {plan.title}
              </h3>
              
              <div 
                style={priceStyle}
                className="pricing-price"
                data-puck-field={`plans[${index}].price`}
                contentEditable
                suppressContentEditableWarning={true}
              >
                {plan.price}<span style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)', fontWeight: '400' }}>/mth</span>
              </div>
              
              <p 
                style={billingStyle}
                className="pricing-billing"
                data-puck-field={`plans[${index}].billingNote`}
                contentEditable
                suppressContentEditableWarning={true}
              >
                {plan.billingNote}
              </p>
              
              <ul style={featuresListStyle} className="pricing-features">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} style={featureItemStyle} className="pricing-feature">
                    <span style={checkmarkStyle}>✓</span>
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
                style={buttonStyle}
                className="pricing-button"
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
