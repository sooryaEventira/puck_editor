import React, { useState, useEffect } from 'react';

export interface CountdownTimerProps {
  heading: string | React.ReactElement;
  targetDate: string | React.ReactElement;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ heading, targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
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

  const targetDateValue = getStringValue(targetDate);

  useEffect(() => {
    if (!targetDateValue) {
      return;
    }

    const calculateTimeLeft = () => {
      try {
        const target = new Date(targetDateValue).getTime();
        
        // Check if date is valid
        if (isNaN(target)) {
          return;
        }
        
        const now = new Date().getTime();
        const difference = target - now;

        if (difference <= 0) {
          setTimeLeft({
            months: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
          });
          return;
        }

        // Calculate time units
        const months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30));
        const days = Math.floor((difference % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          months,
          days,
          hours,
          minutes,
          seconds
        });
      } catch (error) {
        // Silently handle invalid dates
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDateValue]);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  const isExpired = timeLeft.months === 0 && timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      background: 'linear-gradient(to bottom, #f9fafb, #ffffff)',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      minHeight: '300px'
    }}>
      {/* Heading */}
      <h2 
        contentEditable
        suppressContentEditableWarning={true}
        data-puck-field="heading"
        style={{
          fontSize: '28px',
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: '32px',
          textAlign: 'center',
          cursor: 'text',
          outline: 'none'
        }}
      >
        {heading}
      </h2>

      {/* Countdown Timer */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '24px',
        maxWidth: '800px'
      }}>
        {/* Months */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          padding: '24px 20px',
          minWidth: '80px',
          transition: 'transform 0.2s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}>
          <div style={{
            fontSize: '36px',
            fontWeight: '800',
            color: isExpired ? '#9ca3af' : '#111827',
            lineHeight: '1'
          }}>
            {formatNumber(timeLeft.months)}
          </div>
          <div style={{
            marginTop: '8px',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#6b7280',
            fontWeight: '500'
          }}>
            {timeLeft.months === 1 ? 'Month' : 'Months'}
          </div>
        </div>

        {/* Days */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          padding: '24px 20px',
          minWidth: '80px',
          transition: 'transform 0.2s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}>
          <div style={{
            fontSize: '36px',
            fontWeight: '800',
            color: isExpired ? '#9ca3af' : '#111827',
            lineHeight: '1'
          }}>
            {formatNumber(timeLeft.days)}
          </div>
          <div style={{
            marginTop: '8px',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#6b7280',
            fontWeight: '500'
          }}>
            {timeLeft.days === 1 ? 'Day' : 'Days'}
          </div>
        </div>

        {/* Hours */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          padding: '24px 20px',
          minWidth: '80px',
          transition: 'transform 0.2s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}>
          <div style={{
            fontSize: '36px',
            fontWeight: '800',
            color: isExpired ? '#9ca3af' : '#111827',
            lineHeight: '1'
          }}>
            {formatNumber(timeLeft.hours)}
          </div>
          <div style={{
            marginTop: '8px',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#6b7280',
            fontWeight: '500'
          }}>
            {timeLeft.hours === 1 ? 'Hour' : 'Hours'}
          </div>
        </div>

        {/* Minutes */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          padding: '24px 20px',
          minWidth: '80px',
          transition: 'transform 0.2s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}>
          <div style={{
            fontSize: '36px',
            fontWeight: '800',
            color: isExpired ? '#9ca3af' : '#111827',
            lineHeight: '1'
          }}>
            {formatNumber(timeLeft.minutes)}
          </div>
          <div style={{
            marginTop: '8px',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#6b7280',
            fontWeight: '500'
          }}>
            {timeLeft.minutes === 1 ? 'Minute' : 'Minutes'}
          </div>
        </div>

        {/* Seconds */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          padding: '24px 20px',
          minWidth: '80px',
          transition: 'transform 0.2s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}>
          <div style={{
            fontSize: '36px',
            fontWeight: '800',
            color: isExpired ? '#9ca3af' : '#111827',
            lineHeight: '1'
          }}>
            {formatNumber(timeLeft.seconds)}
          </div>
          <div style={{
            marginTop: '8px',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#6b7280',
            fontWeight: '500'
          }}>
            {timeLeft.seconds === 1 ? 'Second' : 'Seconds'}
          </div>
        </div>
      </div>

      {/* Target Date Editor */}
      {/* <div style={{
        marginTop: '32px',
        fontSize: '14px',
        color: '#6b7280',
        textAlign: 'center',
        opacity: '0.7'
      }}>
        <div 
          contentEditable
          suppressContentEditableWarning={true}
          data-puck-field="targetDate"
          style={{
            backgroundColor: 'white',
            borderRadius: '6px',
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            cursor: 'text',
            outline: 'none',
            minWidth: '200px',
            display: 'inline-block',
            marginBottom: '4px'
          }}
        >
          {targetDateValue || '2025-12-31T23:59:59'}
        </div>
        <div style={{
          fontSize: '11px',
          color: '#9ca3af',
          marginTop: '4px'
        }}>
          Target: {targetDateValue ? new Date(targetDateValue).toLocaleString() : 'No date set'}
        </div>
      </div> */}
    </div>
  );
};

export default CountdownTimer;
