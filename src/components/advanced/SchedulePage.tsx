import React, { useState, useEffect, useRef, useCallback } from 'react';

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
  isCompleted?: boolean;
  parentId?: string;
  children?: ScheduleEvent[];
  isExpanded?: boolean;
}

interface SchedulePageProps {
  puck?: any;
}

const SchedulePage: React.FC<SchedulePageProps> = () => {
  const [currentDate, setCurrentDate] = useState(new Date('2024-01-03')); // Wed 3
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlockType, setSelectedBlockType] = useState('Presentation Session');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isHeaderDropdownOpen, setIsHeaderDropdownOpen] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  const [hasSelectedAll, setHasSelectedAll] = useState(false);
  const eventsContainerRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const [events, setEvents] = useState<ScheduleEvent[]>([
    {
      id: '1',
      title: 'Welcome presentation',
      startTime: '08:00 AM',
      endTime: '09:00 AM',
      location: 'Room A',
      type: 'In-Person',
      description: 'Brief overview and a warm welcome.',
      attachments: 1,
      isCompleted: false,
      children: [],
      isExpanded: false
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
      isParallel: true,
      isCompleted: false,
      children: [],
      isExpanded: false
    },
    // {
    //   id: '3',
    //   title: 'Welcome Note',
    //   startTime: '09:10 AM',
    //   endTime: '10:10 AM',
    //   location: 'Main Hall',
    //   type: 'In-Person',
    //   description: 'Chairman: Speaker 1, Others: Speaker 2, +2 more',
    //   attachments: 12,
    //   isCompleted: false,
    //   children: [
    //     {
    //       id: '3-1',
    //       title: 'Special topic',
    //       startTime: '09:15 AM',
    //       endTime: '09:30 AM',
    //       location: 'Drawing Room',
    //       type: 'In-Person',
    //       description: 'Chairman: Speaker 1, Others: Speaker 2, +2 more',
    //       attachments: 8,
    //       isCompleted: false,
    //       parentId: '3',
    //       children: [],
    //       isExpanded: false
    //     }
    //   ],
    //   isExpanded: true
    // }
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
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleBlockTypeSelect = (blockType: string) => {
    setSelectedBlockType(blockType);
  };

  const handleSelect = () => {
    console.log('Selected block type:', selectedBlockType);
    setIsModalOpen(false);
    // Here you would typically add the new session
  };

  const toggleEventCompletion = (eventId: string) => {
    setEvents(prevEvents => {
      const updatedEvents = prevEvents.map(event => 
        event.id === eventId 
          ? { ...event, isCompleted: !event.isCompleted }
          : event
      );
      
      // Check if all events are completed
      const allCompleted = updatedEvents.every(event => event.isCompleted);
      setHasSelectedAll(allCompleted);
      
      return updatedEvents;
    });
  };

  const toggleDropdown = (eventId: string) => {
    setOpenDropdownId(openDropdownId === eventId ? null : eventId);
  };

  const toggleHeaderDropdown = () => {
    setIsHeaderDropdownOpen(!isHeaderDropdownOpen);
  };

  const selectAllEvents = () => {
    setEvents(prevEvents => 
      prevEvents.map(event => ({ ...event, isCompleted: true }))
    );
    setHasSelectedAll(true);
    setRenderKey(prev => prev + 1); // Force re-render
    setIsHeaderDropdownOpen(false);
  };

  const unselectAllEvents = () => {
    setEvents(prevEvents => 
      prevEvents.map(event => ({ ...event, isCompleted: false }))
    );
    setHasSelectedAll(false);
    setRenderKey(prev => prev + 1); // Force re-render
    setIsHeaderDropdownOpen(false);
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prevEvents => {
      const updatedEvents = prevEvents.filter(event => event.id !== eventId);
      // Check if all remaining events are completed
      const allCompleted = updatedEvents.length > 0 && updatedEvents.every(event => event.isCompleted);
      setHasSelectedAll(allCompleted);
      return updatedEvents;
    });
    setOpenDropdownId(null);
    
    // Update height after deleting event
    setTimeout(() => {
      const timeSlots = ['08:00 AM'];
      timeSlots.forEach(time => {
        measureAndUpdateHeight(time);
      });
    }, 200);
  };

  const addChildEvent = (parentId: string) => {
    const newChildId = `${parentId}-${Date.now()}`;
    const newChild: ScheduleEvent = {
      id: newChildId,
      title: 'New Child Event',
      startTime: '09:15 AM',
      endTime: '09:30 AM',
      location: 'Room',
      type: 'In-Person',
      description: 'New child event description',
      attachments: 0,
      isCompleted: false,
      parentId: parentId,
      children: [],
      isExpanded: false
    };

    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === parentId 
          ? { 
              ...event, 
              children: [...(event.children || []), newChild],
              isExpanded: true
            }
          : event
      )
    );
    setRenderKey(prev => prev + 1);
    
    // Update height after adding child event
    setTimeout(() => {
      const timeSlots = ['08:00 AM'];
      timeSlots.forEach(time => {
        measureAndUpdateHeight(time);
      });
    }, 200);
  };

  const toggleEventExpansion = (eventId: string) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId 
          ? { ...event, isExpanded: !event.isExpanded }
          : event
      )
    );
    setRenderKey(prev => prev + 1);
    
    // Update height after state change
    setTimeout(() => {
      const timeSlots = ['08:00 AM'];
      timeSlots.forEach(time => {
        measureAndUpdateHeight(time);
      });
    }, 200); // Longer delay to ensure DOM has updated
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside the dropdown
      const target = event.target as Element;
      if (target && !target.closest('[data-dropdown]')) {
        if (openDropdownId) {
          setOpenDropdownId(null);
        }
        if (isHeaderDropdownOpen) {
          setIsHeaderDropdownOpen(false);
        }
      }
    };

    if (openDropdownId || isHeaderDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdownId, isHeaderDropdownOpen]);


  const getEventsForTime = (time: string) => {
    return events.filter(event => event.startTime === time);
  };

  const [timeSlotHeights, setTimeSlotHeights] = useState<{[key: string]: number}>({
    '08:00 AM': 280
  });

  const updateTimeSlotHeight = (time: string, height: number) => {
    const finalHeight = Math.max(height, 280);
    setTimeSlotHeights(prev => ({
      ...prev,
      [time]: finalHeight
    }));
  };

  const measureAndUpdateHeight = useCallback((time: string) => {
    const container = eventsContainerRefs.current[time];
    if (container) {
      const height = container.scrollHeight;
      updateTimeSlotHeight(time, height);
    }
  }, []);

  const createRefCallback = useCallback((time: string) => {
    return (el: HTMLDivElement | null) => {
      eventsContainerRefs.current[time] = el;
      if (el) {
        // Immediately measure and update height when ref is set
        setTimeout(() => {
          const height = el.scrollHeight;
          updateTimeSlotHeight(time, height);
        }, 0);
      }
    };
  }, []);

  // Update heights when events change
  useEffect(() => {
    const timeSlots = ['08:00 AM'];
    // Use a longer delay to ensure all DOM updates are complete
    setTimeout(() => {
      timeSlots.forEach(time => {
        measureAndUpdateHeight(time);
      });
    }, 200);
  }, [events, measureAndUpdateHeight]);

  // Set up ResizeObserver to automatically update heights
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const timeSlot = Object.keys(eventsContainerRefs.current).find(
          key => eventsContainerRefs.current[key] === entry.target
        );
        if (timeSlot) {
          updateTimeSlotHeight(timeSlot, entry.contentRect.height);
        }
      });
    });

    // Observe all event containers with a delay to ensure they're mounted
    setTimeout(() => {
      const containers = Object.values(eventsContainerRefs.current).filter(Boolean);
      containers.forEach(container => {
        if (container) {
          resizeObserver.observe(container);
        }
      });
    }, 100);

    return () => {
      resizeObserver.disconnect();
    };
  }, [events, renderKey]); // Add renderKey to re-observe after re-renders

  const getTypeIcon = (type: 'In-Person' | 'Virtual') => {
    return type === 'In-Person' ? '👤' : '📹';
  };

  const renderEvent = (event: ScheduleEvent, isChild: boolean = false) => {
    return (
      <div key={event.id}>
        <div
          key={`${event.id}-${event.isCompleted}`}
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '8px',
            position: 'relative',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            cursor: 'move',
            opacity: event.isCompleted ? 0.6 : 1,
            transition: 'opacity 0.2s ease',
            marginLeft: isChild ? '32px' : '0' // Indentation for child events
          }}
          draggable={true}
        >
          {/* Checkbox */}
          <div 
            onClick={() => toggleEventCompletion(event.id)}
            style={{
              position: 'absolute',
              left: '16px',
              top: '16px',
              width: '16px',
              height: '16px',
              border: event.isCompleted ? '2px solid #8b5cf6' : '2px solid #d1d5db',
              backgroundColor: event.isCompleted ? '#8b5cf6' : 'transparent',
              borderRadius: '3px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            {event.isCompleted && (
              <span style={{
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: 'bold'
              }}>
                ✓
              </span>
            )}
          </div>

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
                alignItems: 'center',
                position: 'relative'
              }}>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown(event.id);
                  }}
                  style={{
                    width: '24px',
                    height: '24px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    color: '#6b7280',
                    borderRadius: '4px'
                  }}
                >
                  ⋮
                </button>

                {/* Dropdown Menu */}
                {openDropdownId === event.id && (
                  <div style={{
                    position: 'absolute',
                    top: '28px',
                    right: '0',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    zIndex: 50,
                    minWidth: '120px'
                  }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteEvent(event.id);
                      }}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: '#dc2626',
                        fontSize: '14px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        borderRadius: '8px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#fef2f2';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}

                {/* Expand/Collapse Button for Parent Events */}
                {event.children && event.children.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleEventExpansion(event.id);
                    }}
                    style={{
                      width: '24px',
                      height: '24px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      color: '#6b7280',
                      borderRadius: '4px'
                    }}
                  >
                    {event.isExpanded ? '▲' : '▼'}
                  </button>
                )}

                {/* + Button for Adding Child Events */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addChildEvent(event.id);
                  }}
                  style={{
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
                  }}
                >
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

        {/* Render Children */}
        {event.children && event.children.length > 0 && event.isExpanded && (
          <div>
            {event.children.map(child => renderEvent(child, true))}
          </div>
        )}
      </div>
    );
  };

  const blockTypes = [
    'Presentation Session',
    'Discussion session',
    'Poster/Abstract session',
    'Workshop session',
    'Networking session',
    'Create custom session'
  ];

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
          <div style={{ display: 'flex', gap: '8px', position: 'relative' }}>
            <button 
              onClick={toggleHeaderDropdown}
              style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                color: '#6b7280'
              }}
            >
              ⋮
            </button>

            {/* Header Dropdown Menu */}
            {isHeaderDropdownOpen && (
              <div 
                data-dropdown
                style={{
                  position: 'absolute',
                  top: '36px',
                  right: '0',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  zIndex: 50,
                  minWidth: '160px'
                }}>
                <button
                  onClick={() => {
                    console.log('Export schedule');
                    setIsHeaderDropdownOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#374151',
                    fontSize: '14px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: '8px 8px 0 0'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  📤 Export Schedule
                </button>
                <button
                  onClick={() => {
                    console.log('Print schedule');
                    setIsHeaderDropdownOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#374151',
                    fontSize: '14px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  🖨️ Print Schedule
                </button>
                {!hasSelectedAll ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      selectAllEvents();
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#374151',
                      fontSize: '14px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    Select All
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      unselectAllEvents();
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#374151',
                      fontSize: '14px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    Unselect All
                  </button>
                )}
                <div style={{
                  height: '1px',
                  backgroundColor: '#e5e7eb',
                  margin: '4px 0'
                }} />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEvents(prevEvents => prevEvents.filter(event => !event.isCompleted));
                    setHasSelectedAll(false);
                    setRenderKey(prev => prev + 1); // Force re-render
                    setIsHeaderDropdownOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#dc2626',
                    fontSize: '14px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: '0 0 8px 8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fef2f2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  🗑️ Delete
            </button>
          </div>
            )}
          </div>
          
        </div>

        {/* Schedule Content */}
        <div style={{ display: 'flex', gap: '20px' }}>
          {/* Time Column */}
          <div style={{ minWidth: '100px', paddingTop: '20px' }}>
            <div style={{
              height: `${timeSlotHeights['08:00 AM']}px`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '10px',
              position: 'relative',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              backgroundColor: '#f9fafb',
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

            <div 
              ref={createRefCallback('08:00 AM')}
              key={renderKey}
              style={{
                position: 'relative',
                marginBottom: '8px'
              }}>
              {getEventsForTime('08:00 AM').map((event) => renderEvent(event))}
            </div>
          </div>
        </div>

      </div>

      {/* Block Type Selection Modal */}
      {isModalOpen && (
                      <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
                        <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            width: '500px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                            border: 'none',
                fontSize: '20px',
                color: '#6b7280',
                            cursor: 'pointer',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>

            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{
                margin: '0 0 8px 0',
                fontSize: '20px',
                fontWeight: '600',
                color: '#111827'
              }}>
                Select block type
              </h2>
              <p style={{
                margin: '0',
                            fontSize: '14px',
                            color: '#6b7280'
                          }}>
                Select a style for your block.
              </p>
                      </div>

            {/* Block Type Grid */}
                        <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '24px'
            }}>
              {blockTypes.map((blockType) => (
                <div
                  key={blockType}
                  onClick={() => handleBlockTypeSelect(blockType)}
                  style={{
                    border: selectedBlockType === blockType ? '2px solid #8b5cf6' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '16px',
                    cursor: 'pointer',
                    backgroundColor: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Icon */}
                    <div style={{
                      width: '32px',
                      height: '32px',
                            backgroundColor: '#f3f4f6',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        position: 'relative'
                      }}>
                        {/* Colored dots */}
                        <div style={{
                          position: 'absolute',
                          top: '2px',
                          left: '2px',
                          width: '4px',
                          height: '4px',
                          backgroundColor: '#fbbf24',
                          borderRadius: '50%'
                        }} />
                        <div style={{
                          position: 'absolute',
                          top: '2px',
                          right: '2px',
                          width: '4px',
                          height: '4px',
                          backgroundColor: '#f97316',
                          borderRadius: '50%'
                        }} />
                        <div style={{
                          position: 'absolute',
                          bottom: '2px',
                          left: '2px',
                          width: '4px',
                          height: '4px',
                          backgroundColor: '#10b981',
                          borderRadius: '50%'
                        }} />
                        <div style={{
                          position: 'absolute',
                          bottom: '2px',
                          right: '2px',
                          width: '4px',
                          height: '4px',
                          backgroundColor: '#8b5cf6',
                          borderRadius: '50%'
                        }} />
                        {/* Horizontal lines */}
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          left: '2px',
                          right: '2px',
                          height: '1px',
                          backgroundColor: '#d1d5db'
                        }} />
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          left: '2px',
                          right: '2px',
                          height: '1px',
                          backgroundColor: '#d1d5db'
                        }} />
                      </div>
                    </div>
                    
                    {/* Text */}
                          <span style={{
                      fontSize: '14px',
                            fontWeight: '500',
                      color: '#111827',
                      lineHeight: '1.4'
                          }}>
                      {blockType}
                          </span>
                        </div>

                  {/* Radio Button */}
                      <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    border: selectedBlockType === blockType ? '2px solid #8b5cf6' : '2px solid #d1d5db',
                    backgroundColor: selectedBlockType === blockType ? '#8b5cf6' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {selectedBlockType === blockType && (
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#ffffff'
                      }} />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
                      <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <a
                href="#"
                style={{
                        fontSize: '14px',
                        color: '#6b7280',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: '#6b7280'
                }}>
                  ?
                      </div>
                Need help?
              </a>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={closeModal}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    backgroundColor: '#ffffff',
                          color: '#374151',
                    fontSize: '14px',
                          fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSelect}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#8b5cf6',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Select
                </button>
                  </div>
                </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default SchedulePage;