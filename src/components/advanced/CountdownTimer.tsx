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

  // Helper component for time unit cards
  const TimeUnitCard: React.FC<{
    value: number;
    label: string;
    gradient: string;
    shadowColor: string;
  }> = ({ value, label, gradient, shadowColor }) => {
    return (
      <div
        style={{
          background: gradient,
          boxShadow: `0 8px 25px ${shadowColor}`
        }}
        className="flex flex-col items-center rounded-2xl p-7 min-w-[90px] transition-all duration-300 cursor-pointer relative overflow-hidden"
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.08) translateY(-4px)';
          e.currentTarget.style.boxShadow = `0 12px 35px ${shadowColor.replace('0.3', '0.4')}`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.boxShadow = `0 8px 25px ${shadowColor}`;
        }}
      >
        <div className="text-[42px] font-black text-white leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
          {formatNumber(value)}
        </div>
        <div className="mt-3 text-[13px] uppercase tracking-wider text-white/90 font-semibold">
          {label}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 bg-white rounded-[20px] shadow-[0_20px_40px_rgba(0,0,0,0.1),0_8px_16px_rgba(0,0,0,0.06)] min-h-[300px] border border-slate-100">
      {/* Heading */}
      <h2 
        contentEditable
        suppressContentEditableWarning={true}
        data-puck-field="heading"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
        className="text-[32px] font-bold mb-10 text-center cursor-text outline-none tracking-tight"
      >
        {heading}
      </h2>

      {/* Countdown Timer */}
      <div className="flex flex-wrap justify-center gap-6 max-w-[800px]">
        {/* Months */}
        <TimeUnitCard
          value={timeLeft.months}
          label={timeLeft.months === 1 ? 'Month' : 'Months'}
          gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          shadowColor="rgba(102, 126, 234, 0.3)"
        />

        {/* Days */}
        <TimeUnitCard
          value={timeLeft.days}
          label={timeLeft.days === 1 ? 'Day' : 'Days'}
          gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
          shadowColor="rgba(240, 147, 251, 0.3)"
        />

        {/* Hours */}
        <TimeUnitCard
          value={timeLeft.hours}
          label={timeLeft.hours === 1 ? 'Hour' : 'Hours'}
          gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
          shadowColor="rgba(79, 172, 254, 0.3)"
        />

        {/* Minutes */}
        <TimeUnitCard
          value={timeLeft.minutes}
          label={timeLeft.minutes === 1 ? 'Minute' : 'Minutes'}
          gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
          shadowColor="rgba(67, 233, 123, 0.3)"
        />

        {/* Seconds */}
        <TimeUnitCard
          value={timeLeft.seconds}
          label={timeLeft.seconds === 1 ? 'Second' : 'Seconds'}
          gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
          shadowColor="rgba(250, 112, 154, 0.3)"
        />
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
