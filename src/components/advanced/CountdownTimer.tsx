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
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.06)',
      minHeight: '300px',
      border: '1px solid #f1f5f9'
    }}>
      {/* Heading */}
      <h2 
        contentEditable
        suppressContentEditableWarning={true}
        data-puck-field="heading"
        style={{
          fontSize: '32px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '40px',
          textAlign: 'center',
          cursor: 'text',
          outline: 'none',
          letterSpacing: '-0.02em'
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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
          padding: '28px 24px',
          minWidth: '90px',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.08) translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
        }}>
          <div style={{
            fontSize: '42px',
            fontWeight: '900',
            color: '#ffffff',
            lineHeight: '1',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {formatNumber(timeLeft.months)}
          </div>
          <div style={{
            marginTop: '12px',
            fontSize: '13px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.9)',
            fontWeight: '600'
          }}>
            {timeLeft.months === 1 ? 'Month' : 'Months'}
          </div>
        </div>

        {/* Days */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          borderRadius: '16px',
          boxShadow: '0 8px 25px rgba(240, 147, 251, 0.3)',
          padding: '28px 24px',
          minWidth: '90px',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.08) translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 35px rgba(240, 147, 251, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(240, 147, 251, 0.3)';
        }}>
          <div style={{
            fontSize: '42px',
            fontWeight: '900',
            color: '#ffffff',
            lineHeight: '1',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {formatNumber(timeLeft.days)}
          </div>
          <div style={{
            marginTop: '12px',
            fontSize: '13px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.9)',
            fontWeight: '600'
          }}>
            {timeLeft.days === 1 ? 'Day' : 'Days'}
          </div>
        </div>

        {/* Hours */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          borderRadius: '16px',
          boxShadow: '0 8px 25px rgba(79, 172, 254, 0.3)',
          padding: '28px 24px',
          minWidth: '90px',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.08) translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 35px rgba(79, 172, 254, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(79, 172, 254, 0.3)';
        }}>
          <div style={{
            fontSize: '42px',
            fontWeight: '900',
            color: '#ffffff',
            lineHeight: '1',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {formatNumber(timeLeft.hours)}
          </div>
          <div style={{
            marginTop: '12px',
            fontSize: '13px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.9)',
            fontWeight: '600'
          }}>
            {timeLeft.hours === 1 ? 'Hour' : 'Hours'}
          </div>
        </div>

        {/* Minutes */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          borderRadius: '16px',
          boxShadow: '0 8px 25px rgba(67, 233, 123, 0.3)',
          padding: '28px 24px',
          minWidth: '90px',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.08) translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 35px rgba(67, 233, 123, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(67, 233, 123, 0.3)';
        }}>
          <div style={{
            fontSize: '42px',
            fontWeight: '900',
            color: '#ffffff',
            lineHeight: '1',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {formatNumber(timeLeft.minutes)}
          </div>
          <div style={{
            marginTop: '12px',
            fontSize: '13px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.9)',
            fontWeight: '600'
          }}>
            {timeLeft.minutes === 1 ? 'Minute' : 'Minutes'}
          </div>
        </div>

        {/* Seconds */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          borderRadius: '16px',
          boxShadow: '0 8px 25px rgba(250, 112, 154, 0.3)',
          padding: '28px 24px',
          minWidth: '90px',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.08) translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 35px rgba(250, 112, 154, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(250, 112, 154, 0.3)';
        }}>
          <div style={{
            fontSize: '42px',
            fontWeight: '900',
            color: '#ffffff',
            lineHeight: '1',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {formatNumber(timeLeft.seconds)}
          </div>
          <div style={{
            marginTop: '12px',
            fontSize: '13px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.9)',
            fontWeight: '600'
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
