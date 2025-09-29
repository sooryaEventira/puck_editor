import React, { useState } from 'react';

interface ScheduleEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  type: 'In-Person' | 'Virtual';
  description?: string;
  attachments?: number;
  participants?: string;
  tags?: string[];
  isParallel?: boolean;
}

interface SchedulePageProps {
  puck?: any;
}

const SchedulePage: React.FC<SchedulePageProps> = () => {
  const [currentDate, setCurrentDate] = useState(new Date('2024-01-03')); // Wed 3
  const [events] = useState<ScheduleEvent[]>([
    {
      id: '1',
      title: 'Welcome presentation',
      startTime: '08:00 AM',
      endTime: '09:00 AM',
      location: 'Room A',
      type: 'In-Person',
      description: 'Brief overview and a warm welcome.',
      attachments: 1
    },
    {
      id: '2',
      title: 'Poster presentation',
      startTime: '08:00 AM',
      endTime: '09:00 AM',
      location: 'Room B',
      type: 'In-Person',
      description: 'Brief overview of posters and topics.',
      attachments: 5,
      isParallel: true
    }
  ]);

  // Generate week dates
  const getWeekDates = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
    startOfWeek.setDate(diff);
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  };

  const weekDates = getWeekDates(currentDate);
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const isCurrentDay = (date: Date) => {
    return date.toDateString() === currentDate.toDateString();
  };

  const selectDate = (date: Date) => {
    setCurrentDate(date);
  };

  const addSession = () => {
    console.log('Add session clicked');
    // This would typically open a modal or form
  };


  const getEventsForTime = (time: string) => {
    return events.filter(event => event.startTime === time);
  };

  const getTypeIcon = (type: 'In-Person' | 'Virtual') => {
    return type === 'In-Person' ? '👤' : '📹';
  };

  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      padding: '20px'
    }}>
      {/* Header with Date Navigation */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          {/* Left Arrow */}
          <button
            onClick={() => navigateWeek('prev')}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#f1f3f4',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              color: '#5f6368'
            }}
          >
            ‹
          </button>

          {/* Date Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {weekDates.map((date, index) => (
              <button
                key={index}
                onClick={() => selectDate(date)}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: isCurrentDay(date) ? '#8b5cf6' : '#f1f3f4',
                  color: isCurrentDay(date) ? '#ffffff' : '#000000',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px',
                  minWidth: '60px'
                }}
              >
                {dayNames[index]} {date.getDate()}
              </button>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => navigateWeek('next')}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#f1f3f4',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              color: '#5f6368'
            }}
          >
            ›
          </button>
        </div>

        {/* Add Session Button */}
        <button
          onClick={addSession}
          style={{
            backgroundColor: '#8b5cf6',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          + Add session
        </button>
      </div>

      {/* Schedule Listing */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {/* Schedule Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '10px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#111827' }}>
            Schedule
          </h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              ⋮
            </button>
          </div>
        </div>

        {/* Schedule Content */}
        <div style={{ display: 'flex', gap: '20px' }}>
          {/* Time Column */}
          <div style={{ minWidth: '100px', paddingTop: '20px' }}>
            <div style={{
              height: '280px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '10px',
              position: 'relative',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              
              marginBottom: '8px'
            }}>
              <span style={{
                fontSize: '16px',
                color: '#000000',
                fontWeight: '700',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                marginBottom: '10px'
              }}>
                08:00 AM
              </span>
              
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '10px',
                right: '10px',
                backgroundColor: '#dbeafe',
                color: '#1e40af',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                textAlign: 'center'
              }}>
                1 parallel session
              </div>
              
              <span style={{
                position: 'absolute',
                bottom: '10px',
                fontSize: '16px',
                color: '#000000',
                fontWeight: '700',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                09:00 AM
              </span>
            </div>
          </div>

          {/* Events Column */}
          <div style={{ flex: 1, position: 'relative' }}>
            {/* Vertical Line */}
            <div style={{
              position: 'absolute',
              left: '-10px',
              top: '0',
              bottom: '0',
              width: '1px',
              backgroundColor: '#e5e7eb'
            }} />

            <div style={{
              height: '280px',
              position: 'relative',
              marginBottom: '8px'
            }}>
              {getEventsForTime('08:00 AM').map((event) => (
                <div
                  key={event.id}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '8px',
                    position: 'relative',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    cursor: 'move'
                  }}
                  draggable={true}
                >
                  {/* Checkbox */}
                  <div style={{
                    position: 'absolute',
                    left: '16px',
                    top: '16px',
                    width: '16px',
                    height: '16px',
                    border: '2px solid #d1d5db',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }} />

                    {/* Event Content */}
                    <div style={{ marginLeft: '32px' }}>
                      {/* Title and Action Buttons */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <h3 style={{
                          margin: '0',
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#111827'
                        }}>
                          {event.title}
                        </h3>
                        <div style={{
                          display: 'flex',
                          gap: '8px',
                          alignItems: 'center'
                        }}>
                          <button style={{
                            width: '24px',
                            height: '24px',
                            border: 'none',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px',
                            color: '#6b7280'
                          }}>
                            ⋮
                          </button>
                          <button style={{
                            width: '24px',
                            height: '24px',
                            border: '1px solid #d1d5db',
                            backgroundColor: '#ffffff',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            color: '#6b7280'
                          }}>
                            +
                          </button>
                        </div>
                      </div>

                        {/* Time, Location and Type in one line */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px',
                          flexWrap: 'wrap'
                        }}>
                          <span style={{
                            fontSize: '14px',
                            color: '#6b7280'
                          }}>
                            {event.startTime} - {event.endTime}
                          </span>
                          <span style={{
                            color: '#6b7280',
                            fontSize: '14px'
                          }}>
                            •
                          </span>
                          <span style={{
                            backgroundColor: '#f3f4f6',
                            color: '#374151',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            {event.location}
                          </span>
                          <span style={{
                            color: '#6b7280',
                            fontSize: '14px'
                          }}>
                            •
                          </span>
                          <span style={{
                            backgroundColor: '#f3f4f6',
                            color: '#374151',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            {getTypeIcon(event.type)} {event.type}
                          </span>
                          {event.tags?.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              style={{
                                backgroundColor: '#dbeafe',
                                color: '#1e40af',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '500'
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                    {/* Description */}
                    {event.description && (
                      <div style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        marginBottom: '8px'
                      }}>
                        {event.description}
                      </div>
                    )}

                    {/* Participants */}
                    {event.participants && (
                      <div style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        marginBottom: '8px'
                      }}>
                        {event.participants}
                      </div>
                    )}

                      {/* Attachments */}
                      {event.attachments && (
                        <span style={{
                          backgroundColor: '#f3f4f6',
                          color: '#374151',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          📎 {event.attachments}
                        </span>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;