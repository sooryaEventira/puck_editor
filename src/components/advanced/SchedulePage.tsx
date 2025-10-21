import React, { useState, useEffect, useRef, useCallback } from "react";
import SessionForm from "./SessionForm";
import { useNavigation } from "../../contexts/NavigationContext";

interface ScheduleEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  type: "In-Person" | "Virtual";
  description?: string;
  attachments?: number;
  participants?: string;
  tags?: string[];
  isParallel?: boolean;
  isCompleted?: boolean;
  parentId?: string;
  parentSessionId?: string;
  children?: ScheduleEvent[];
  isExpanded?: boolean;
}

interface SchedulePageProps {
  puck?: any;
  initialDate?: Date;
  onDateChange?: (date: Date) => void;
  events?: ScheduleEvent[];
  onEventsChange?: (events: ScheduleEvent[]) => void;
  onNavigateToEditor?: () => void;
}

const SchedulePage: React.FC<SchedulePageProps> = ({
  initialDate,
  onDateChange,
  events: externalEvents,
  onEventsChange,
  onNavigateToEditor: onNavigateToEditorProp,
  ...props
}) => {
  // Get navigation function from context or props
  const { onNavigateToEditor: onNavigateToEditorContext } = useNavigation();
  const onNavigateToEditor = onNavigateToEditorProp || onNavigateToEditorContext;
  
  console.log('SchedulePage: onNavigateToEditor from prop:', typeof onNavigateToEditorProp);
  console.log('SchedulePage: onNavigateToEditor from context:', typeof onNavigateToEditorContext);
  console.log('SchedulePage: Final onNavigateToEditor:', typeof onNavigateToEditor);
  
  // Get events from Puck props if available
  const puckEvents = (props as any).events || [];
  // Initialize with today's date, props, or localStorage
  const [currentDate, setCurrentDate] = useState(() => {
    if (initialDate) return initialDate;

    // Try to get from localStorage
    const saved = localStorage.getItem("schedule-current-date");
    if (saved) {
      const parsedDate = new Date(saved);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }

    // Fallback to today
    return new Date();
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlockType, setSelectedBlockType] = useState(
    "Presentation Session"
  );
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isHeaderDropdownOpen, setIsHeaderDropdownOpen] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  const [hasSelectedAll, setHasSelectedAll] = useState(false);
  const [showBlockTypeModal, setShowBlockTypeModal] = useState(true);
  const [isAddingChildSession, setIsAddingChildSession] = useState(false);
  const [showSessionFormPage, setShowSessionFormPage] = useState(false);
  const [expandedParents, setExpandedParents] = useState<Set<string>>(
    new Set()
  );
  const [formData, setFormData] = useState({
    title: "",
    startTime: "08:00",
    endTime: "09:00",
    location: "",
    type: "In-Person" as "In-Person" | "Virtual",
    description: "",
    tags: "",
    participants: "",
    attachments: 0,
    parentSessionId: "", // For child sessions
  });
  const eventsContainerRefs = useRef<{ [key: string]: HTMLDivElement | null }>(
    {}
  );
  const [events, setEvents] = useState<ScheduleEvent[]>(externalEvents || puckEvents || []);

  // Sync with external events when they change
  useEffect(() => {
    if (externalEvents) {
      setEvents(externalEvents);
    } else if (puckEvents.length > 0) {
      setEvents(puckEvents);
    }
  }, [externalEvents, puckEvents]);

  // Notify parent when events change
  const updateEvents = (newEvents: ScheduleEvent[]) => {
    setEvents(newEvents);
    if (onEventsChange) {
      onEventsChange(newEvents);
    }
  };

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
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentDate(newDate);

    // Persist to localStorage
    localStorage.setItem("schedule-current-date", newDate.toISOString());

    // Notify parent component
    onDateChange?.(newDate);
  };

  const isCurrentDay = (date: Date) => {
    return date.toDateString() === currentDate.toDateString();
  };

  const selectDate = (date: Date) => {
    setCurrentDate(date);

    // Persist to localStorage
    localStorage.setItem("schedule-current-date", date.toISOString());

    // Notify parent component
    onDateChange?.(date);
  };

  // Utility functions for date management
  const goToToday = () => {
    const today = new Date();
    selectDate(today);
  };

  const goToSpecificDate = (dateString: string) => {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      selectDate(date);
    }
  };

  const goToDate = (year: number, month: number, day: number) => {
    const date = new Date(year, month - 1, day); // month is 0-indexed
    selectDate(date);
  };

  const addSession = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setShowBlockTypeModal(true);
    setIsAddingChildSession(false);
    setFormData({
      title: "",
      startTime: "08:00",
      endTime: "09:00",
      location: "",
      type: "In-Person",
      description: "",
      tags: "",
      participants: "",
      attachments: 0,
      parentSessionId: "",
    });
  };

  const handleAddChildSession = (parentEventId: string) => {
    const parentEvent = events.find((event) => event.id === parentEventId);
    if (parentEvent) {
      // Pre-fill form with parent event's location but allow custom times
      setFormData((prev) => ({
        ...prev,
        startTime: convertTo24Hour(parentEvent.startTime), // Default to parent start time
        endTime: convertTo24Hour(parentEvent.endTime), // Default to parent end time
        location: parentEvent.location,
        parentSessionId: parentEventId,
      }));

      setIsAddingChildSession(true);
      setShowBlockTypeModal(false);
      setIsModalOpen(true);
    }
  };

  // Helper function to convert 12-hour to 24-hour format
  const convertTo24Hour = (time12: string): string => {
    const [time, period] = time12.split(" ");
    const [hours, minutes] = time.split(":");
    let hour24 = parseInt(hours);

    if (period === "PM" && hour24 !== 12) {
      hour24 += 12;
    } else if (period === "AM" && hour24 === 12) {
      hour24 = 0;
    }

    return `${hour24.toString().padStart(2, "0")}:${minutes}`;
  };

  const handleBlockTypeSelect = (blockType: string) => {
    setSelectedBlockType(blockType);
  };

  const handleSelect = () => {
    if (selectedBlockType === "Create custom session") {
      setShowSessionFormPage(true);
      setIsModalOpen(false);
      setShowBlockTypeModal(true);
    } else {
      setShowBlockTypeModal(false);
    }
  };

  const handleEditSessionForm = () => {
    console.log('handleEditSessionForm called!');
    
    // Create SessionForm component data for Puck
    const editorData = {
      content: [
        {
          type: "SessionForm",
          props: {
            sessionTitle: "Session title",
            startTime: "00:00",
            startAMPM: "AM",
            endTime: "00:00",
            endAMPM: "AM",
            location: "",
            locationPlaceholder: "Enter location",
            eventType: "",
            eventTypePlaceholder: "Select event type",
            ctaText: "Click to add a section!",
            addButtonText: "+ Add section",
            cancelButtonText: "Cancel",
            saveButtonText: "Save",
            showActionButtons: true, // Show Save/Cancel buttons in Puck canvas
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            padding: "40px"
          },
          id: "session-form-editor"
        }
      ],
      root: {
        props: {}
      }
    };

    // Store the data in localStorage for the Puck editor to load
    console.log('Storing SessionForm data:', editorData);
    localStorage.setItem('custom-session-data', JSON.stringify(editorData));
    
    // Verify the data was stored
    const storedData = localStorage.getItem('custom-session-data');
    console.log('Verifying stored data:', storedData);
    
    // Navigate to editor
    if (onNavigateToEditor) {
      console.log('Navigating to editor...');
      try {
        onNavigateToEditor();
        console.log('onNavigateToEditor called successfully');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Error calling onNavigateToEditor:', errorMessage);
        alert('Error navigating to editor: ' + errorMessage);
      }
    } else {
      console.error('onNavigateToEditor function not provided!');
      alert('ERROR: onNavigateToEditor function not provided!');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Convert 24-hour time to 12-hour AM/PM format
  const convertTo12Hour = (time24: string): string => {
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12.toString().padStart(2, "0")}:${minutes} ${ampm}`;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const startTime12 = convertTo12Hour(formData.startTime);
    const endTime12 = convertTo12Hour(formData.endTime);

    // Check if this is a parallel session
    const existingEventsAtTime = events.filter(
      (event) => event.startTime === startTime12
    );
    const isParallel = existingEventsAtTime.length > 0;

    const newEvent: ScheduleEvent = {
      id: Date.now().toString(),
      title: formData.title || "Untitled Session",
      startTime: startTime12,
      endTime: endTime12,
      location: formData.location || "TBA",
      type: formData.type,
      description: formData.description,
      attachments: formData.attachments,
      participants: formData.participants,
      tags: formData.tags
        ? formData.tags.split(",").map((tag) => tag.trim())
        : undefined,
      isParallel: isParallel,
      isCompleted: false,
      children: [],
      isExpanded: false,
      parentSessionId: isAddingChildSession
        ? formData.parentSessionId
        : undefined,
    };

    updateEvents([...events, newEvent]);

    // If adding a child session, expand the parent
    if (isAddingChildSession && formData.parentSessionId) {
      setExpandedParents(
        (prev) => new Set([...prev, formData.parentSessionId])
      );
    }

    // Reset form
    setFormData({
      title: "",
      startTime: "08:00",
      endTime: "09:00",
      location: "",
      type: "In-Person",
      description: "",
      tags: "",
      participants: "",
      attachments: 0,
      parentSessionId: "",
    });

    setIsModalOpen(false);
    setShowBlockTypeModal(true);
    setSelectedBlockType("Presentation Session");
    setIsAddingChildSession(false);

    // Update height after adding event
    setTimeout(() => {
      uniqueTimeSlots.forEach((time) => {
        measureAndUpdateHeight(time);
      });
    }, 200);
  };

  const toggleEventCompletion = (eventId: string) => {
    const updatedEvents = events.map((event) =>
      event.id === eventId
        ? { ...event, isCompleted: !event.isCompleted }
        : event
    );

    // Check if all events are completed
    const allCompleted = updatedEvents.every((event) => event.isCompleted);
    setHasSelectedAll(allCompleted);

    updateEvents(updatedEvents);
  };

  const toggleDropdown = (eventId: string) => {
    setOpenDropdownId(openDropdownId === eventId ? null : eventId);
  };

  const toggleHeaderDropdown = () => {
    setIsHeaderDropdownOpen(!isHeaderDropdownOpen);
  };

  const selectAllEvents = () => {
    const updatedEvents = events.map((event) => ({ ...event, isCompleted: true }));
    updateEvents(updatedEvents);
    setHasSelectedAll(true);
    setRenderKey((prev) => prev + 1); // Force re-render
    setIsHeaderDropdownOpen(false);
  };

  const unselectAllEvents = () => {
    const updatedEvents = events.map((event) => ({ ...event, isCompleted: false }));
    updateEvents(updatedEvents);
    setHasSelectedAll(false);
    setRenderKey((prev) => prev + 1); // Force re-render
    setIsHeaderDropdownOpen(false);
  };

  const deleteEvent = (eventId: string) => {
    const updatedEvents = events.filter((event) => event.id !== eventId);
    // Check if all remaining events are completed
    const allCompleted =
      updatedEvents.length > 0 &&
      updatedEvents.every((event) => event.isCompleted);
    setHasSelectedAll(allCompleted);
    updateEvents(updatedEvents);
    setOpenDropdownId(null);

    // Update height after deleting event
    setTimeout(() => {
      uniqueTimeSlots.forEach((time) => {
        measureAndUpdateHeight(time);
      });
    }, 200);
  };

  const toggleEventExpansion = (eventId: string) => {
    const updatedEvents = events.map((event) =>
      event.id === eventId
        ? { ...event, isExpanded: !event.isExpanded }
        : event
    );
    updateEvents(updatedEvents);
    setRenderKey((prev) => prev + 1);

    // Update height after state change
    setTimeout(() => {
      uniqueTimeSlots.forEach((time) => {
        measureAndUpdateHeight(time);
      });
    }, 200); // Longer delay to ensure DOM has updated
  };

  const toggleChildSessions = (parentId: string) => {
    setExpandedParents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(parentId)) {
        newSet.delete(parentId);
      } else {
        newSet.add(parentId);
      }
      return newSet;
    });

    // Update height after toggling child sessions
    setTimeout(() => {
      uniqueTimeSlots.forEach((time) => {
        measureAndUpdateHeight(time);
      });
    }, 200);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside the dropdown
      const target = event.target as Element;
      if (target && !target.closest("[data-dropdown]")) {
        if (openDropdownId) {
          setOpenDropdownId(null);
        }
        if (isHeaderDropdownOpen) {
          setIsHeaderDropdownOpen(false);
        }
      }
    };

    if (openDropdownId || isHeaderDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownId, isHeaderDropdownOpen]);

  const getEventsForTime = (time: string) => {
    // Only get main events (parent sessions) at this time slot
    // Child sessions will be displayed under their parent sessions
    return events.filter(
      (event) => event.startTime === time && !event.parentSessionId
    );
  };

  // Get all unique time slots from events (only parent sessions)
  const getUniqueTimeSlots = () => {
    // Only include parent sessions (no parentSessionId) in time slot calculation
    const parentEvents = events.filter((event) => !event.parentSessionId);
    const times = new Set(parentEvents.map((event) => event.startTime));
    return Array.from(times).sort((a, b) => {
      // Convert to 24-hour for sorting
      const convertTo24Hour = (time12: string) => {
        const [time, period] = time12.split(" ");
        const [hours, minutes] = time.split(":");
        let hour = parseInt(hours);
        if (period === "PM" && hour !== 12) hour += 12;
        if (period === "AM" && hour === 12) hour = 0;
        return hour * 60 + parseInt(minutes);
      };
      return convertTo24Hour(a) - convertTo24Hour(b);
    });
  };

  const uniqueTimeSlots = getUniqueTimeSlots();

  const [timeSlotHeights, setTimeSlotHeights] = useState<{
    [key: string]: number;
  }>({});

  const updateTimeSlotHeight = (time: string, height: number) => {
    const finalHeight = Math.max(height, 60); // Much smaller minimum height
    setTimeSlotHeights((prev) => ({
      ...prev,
      [time]: finalHeight,
    }));
  };

  const measureAndUpdateHeight = useCallback((time: string) => {
    const container = eventsContainerRefs.current[time];
    if (container) {
      // Calculate height based on number of events - more compact
      const eventsAtTime = getEventsForTime(time);

      if (eventsAtTime.length === 0) {
        // Empty time slot - minimal height
        updateTimeSlotHeight(time, 80);
      } else {
        // Calculate height considering child session visibility
        const baseHeight = 60; // Minimal base height for time slot header
        const eventHeight = 100; // Compact height per event
        const childEventHeight = 80; // Height per child event
        
        let calculatedHeight = baseHeight;
        
        eventsAtTime.forEach(parentEvent => {
          calculatedHeight += eventHeight;
          
          // Add height for child sessions if they are expanded
          const childSessions = events.filter(child => child.parentSessionId === parentEvent.id);
          if (childSessions.length > 0 && expandedParents.has(parentEvent.id)) {
            calculatedHeight += childSessions.length * childEventHeight;
          }
        });

        // Use actual content height if it's larger
        const actualHeight = container.scrollHeight;
        const finalHeight = Math.max(calculatedHeight, actualHeight + 20, 80);

        updateTimeSlotHeight(time, finalHeight);
      }
    }
  }, [events, expandedParents]);

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
    // Get unique time slots from current events (only parent sessions)
    const parentEvents = events.filter((event) => !event.parentSessionId);
    const currentUniqueTimeSlots = Array.from(
      new Set(parentEvents.map((event) => event.startTime))
    ).sort((a, b) => {
      const convertTo24Hour = (time12: string) => {
        const [time, period] = time12.split(" ");
        const [hours, minutes] = time.split(":");
        let hour24 = parseInt(hours);

        if (period === "PM" && hour24 !== 12) {
          hour24 += 12;
        } else if (period === "AM" && hour24 === 12) {
          hour24 = 0;
        }

        return `${hour24.toString().padStart(2, "0")}:${minutes}`;
      };

      const timeA24 = convertTo24Hour(a);
      const timeB24 = convertTo24Hour(b);
      return timeA24.localeCompare(timeB24);
    });

    // Calculate heights immediately for all time slots - more compact
    currentUniqueTimeSlots.forEach((time) => {
      const eventsAtTime = events.filter(
        (event) => event.startTime === time && !event.parentSessionId
      );

      if (eventsAtTime.length === 0) {
        // Empty time slot - minimal height
        updateTimeSlotHeight(time, 80);
      } else {
        // Compact height calculation considering child session visibility
        const baseHeight = 60;
        const eventHeight = 100;
        const childEventHeight = 80;
        
        let totalHeight = baseHeight;
        
        eventsAtTime.forEach(parentEvent => {
          totalHeight += eventHeight;
          
          // Add height for child sessions if they are expanded
          const childSessions = events.filter(child => child.parentSessionId === parentEvent.id);
          if (childSessions.length > 0 && expandedParents.has(parentEvent.id)) {
            totalHeight += childSessions.length * childEventHeight;
          }
        });
        
        updateTimeSlotHeight(time, totalHeight);
      }
    });

    // Then measure actual heights with a delay
    setTimeout(() => {
      currentUniqueTimeSlots.forEach((time) => {
        measureAndUpdateHeight(time);
      });
    }, 100);
  }, [events, expandedParents]);

  // Set up ResizeObserver to automatically update heights
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const timeSlot = Object.keys(eventsContainerRefs.current).find(
          (key) => eventsContainerRefs.current[key] === entry.target
        );
        if (timeSlot) {
          updateTimeSlotHeight(timeSlot, entry.contentRect.height);
        }
      });
    });

    // Observe all event containers with a delay to ensure they're mounted
    setTimeout(() => {
      const containers = Object.values(eventsContainerRefs.current).filter(
        Boolean
      );
      containers.forEach((container) => {
        if (container) {
          resizeObserver.observe(container);
        }
      });
    }, 100);

    return () => {
      resizeObserver.disconnect();
    };
  }, [events, renderKey]); // Add renderKey to re-observe after re-renders

  const getTypeIcon = (type: "In-Person" | "Virtual") => {
    return type === "In-Person" ? "👤" : "📹";
  };

  const renderEvent = (event: ScheduleEvent) => {
    const isChild = !!event.parentSessionId;
    return (
      <div key={event.id}>
        <div
          key={`${event.id}-${event.isCompleted}`}
          style={{
            backgroundColor: isChild ? "#f8fafc" : "#ffffff",
            border: isChild ? "1px solid #cbd5e1" : "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "8px",
            position: "relative",
            boxShadow: isChild
              ? "0 1px 2px rgba(0,0,0,0.05)"
              : "0 1px 3px rgba(0,0,0,0.1)",
            cursor: "move",
            opacity: event.isCompleted ? 0.6 : 1,
            transition: "opacity 0.2s ease",
            marginLeft: isChild ? "32px" : "0", // Indentation for child events
          }}
          draggable={true}
        >
          {/* Checkbox */}
          <div
            onClick={() => toggleEventCompletion(event.id)}
            style={{
              position: "absolute",
              left: "16px",
              top: "16px",
              width: "16px",
              height: "16px",
              border: event.isCompleted
                ? "2px solid #8b5cf6"
                : "2px solid #d1d5db",
              backgroundColor: event.isCompleted ? "#8b5cf6" : "transparent",
              borderRadius: "3px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
          >
            {event.isCompleted && (
              <span
                style={{
                  color: "#ffffff",
                  fontSize: "10px",
                  fontWeight: "bold",
                }}
              >
                ✓
              </span>
            )}
          </div>

          {/* Event Content */}
          <div style={{ marginLeft: "32px" }}>
            {/* Title and Action Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <h3
                style={{
                  margin: "0",
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#111827",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {isChild && (
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      fontWeight: "500",
                    }}
                  >
                    ↳
                  </span>
                )}
                {event.title}
              </h3>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown(event.id);
                  }}
                  style={{
                    width: "24px",
                    height: "24px",
                    border: "none",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    color: "#6b7280",
                    borderRadius: "4px",
                  }}
                >
                  ⋮
                </button>

                {/* Dropdown Menu */}
                {openDropdownId === event.id && (
                  <div
                    style={{
                      position: "absolute",
                      top: "28px",
                      right: "0",
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      zIndex: 50,
                      minWidth: "120px",
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteEvent(event.id);
                      }}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: "none",
                        backgroundColor: "transparent",
                        color: "#dc2626",
                        fontSize: "14px",
                        textAlign: "left",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        borderRadius: "8px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#fef2f2";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
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
                      width: "24px",
                      height: "24px",
                      border: "none",
                      backgroundColor: "transparent",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      color: "#6b7280",
                      borderRadius: "4px",
                    }}
                  >
                    {event.isExpanded ? "▲" : "▼"}
                  </button>
                )}

                {/* Collapse/Expand Child Sessions Button */}
                {(() => {
                  const childSessions = events.filter(
                    (child) => child.parentSessionId === event.id
                  );
                  return (
                    childSessions.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleChildSessions(event.id);
                        }}
                        style={{
                          minWidth: "32px",
                          height: "24px",
                          border: "1px solid #d1d5db",
                          backgroundColor: "#ffffff",
                          borderRadius: "4px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "11px",
                          color: "#6b7280",
                          transition: "all 0.2s ease",
                          marginRight: "4px",
                          padding: "0 4px",
                          gap: "2px",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#f9fafb";
                          e.currentTarget.style.borderColor = "#9ca3af";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#ffffff";
                          e.currentTarget.style.borderColor = "#d1d5db";
                        }}
                        title={`${
                          expandedParents.has(event.id) ? "Hide" : "Show"
                        } ${childSessions.length} child session${
                          childSessions.length > 1 ? "s" : ""
                        }`}
                      >
                        <span>{expandedParents.has(event.id) ? "▲" : "▼"}</span>
                        <span style={{ fontSize: "10px", fontWeight: "500" }}>
                          {childSessions.length}
                        </span>
                      </button>
                    )
                  );
                })()}

                {/* + Button for Adding Child Sessions */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddChildSession(event.id);
                  }}
                  style={{
                    width: "24px",
                    height: "24px",
                    border: "1px solid #d1d5db",
                    backgroundColor: "#ffffff",
                    borderRadius: "4px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    color: "#6b7280",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f9fafb";
                    e.currentTarget.style.borderColor = "#9ca3af";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#ffffff";
                    e.currentTarget.style.borderColor = "#d1d5db";
                  }}
                  title="Add Child Session"
                >
                  +
                </button>
              </div>
            </div>

            {/* Time, Location and Type in one line */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                {event.startTime} - {event.endTime}
              </span>
              <span
                style={{
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                •
              </span>
              <span
                style={{
                  backgroundColor: "#f3f4f6",
                  color: "#374151",
                  padding: "4px 8px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                {event.location}
              </span>
              <span
                style={{
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                •
              </span>
              <span
                style={{
                  backgroundColor: "#f3f4f6",
                  color: "#374151",
                  padding: "4px 8px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {getTypeIcon(event.type)} {event.type}
              </span>
              {event.tags?.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  style={{
                    backgroundColor: "#dbeafe",
                    color: "#1e40af",
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "500",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Description */}
            {event.description && (
              <div
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  marginBottom: "8px",
                }}
              >
                {event.description}
              </div>
            )}

            {/* Participants */}
            {event.participants && (
              <div
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  marginBottom: "8px",
                }}
              >
                {event.participants}
              </div>
            )}

            {/* Attachments */}
            {event.attachments && (
              <span
                style={{
                  backgroundColor: "#f3f4f6",
                  color: "#374151",
                  padding: "4px 8px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "500",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                📎 {event.attachments}
              </span>
            )}
          </div>
        </div>

        {/* Render Child Sessions */}
        {(() => {
          const childSessions = events.filter(
            (child) => child.parentSessionId === event.id
          );
          const isExpanded = expandedParents.has(event.id);

          return (
            childSessions.length > 0 &&
            isExpanded && (
              <div
                style={{
                  marginTop: "8px",
                  marginLeft: "16px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  padding: "8px",
                  backgroundColor: "#f8fafc",
                }}
              >
                {childSessions.map((child) => renderEvent(child))}
              </div>
            )
          );
        })()}
      </div>
    );
  };

  const blockTypes = [
    "Presentation Session",
    "Discussion session",
    "Poster/Abstract session",
    "Workshop session",
    "Networking session",
    "Create custom session",
  ];

  // If showing SessionForm page, render it instead of the schedule
  if (showSessionFormPage) {
    return (
      <div
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          backgroundColor: "#f8f9fa",
          minHeight: "100vh",
          padding: "40px",
        }}
      >
        {/* Back Button */}
        <button
          onClick={() => setShowSessionFormPage(false)}
          style={{
            marginBottom: "24px",
            padding: "10px 20px",
            backgroundColor: "#f3f4f6",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            color: "#374151",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#e5e7eb";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#f3f4f6";
          }}
        >
          ← Back to Schedule
        </button>

        {/* SessionForm Component (non-editable preview) */}
        <SessionForm
          sessionTitle="Session title"
          startTime="00:00"
          startAMPM="AM"
          endTime="00:00"
          endAMPM="AM"
          location=""
          locationPlaceholder="Enter location"
          eventType=""
          eventTypePlaceholder="Select event type"
          ctaText="Click to add a section!"
          addButtonText="+ Add section"
          cancelButtonText="Cancel"
          saveButtonText="Save"
          showActionButtons={false}
          backgroundColor="#ffffff"
          borderRadius="12px"
          padding="40px"
        />

        {/* Edit Button */}
        <div
          style={{
            marginTop: "32px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            onClick={handleEditSessionForm}
            style={{
              backgroundColor: "#8b5cf6",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              padding: "12px 32px",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#7c3aed";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#8b5cf6";
            }}
          >
            Edit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      {/* Header with Date Navigation */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          {/* Left Arrow */}
          <button
            onClick={() => navigateWeek("prev")}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: "#f1f3f4",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              color: "#5f6368",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#e5e7eb";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#f1f3f4";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            ‹
          </button>

          {/* Date Buttons */}
          <div style={{ display: "flex", gap: "12px" }}>
            {weekDates.map((date, index) => (
              <button
                key={index}
                onClick={() => selectDate(date)}
                style={{
                  padding: "16px 24px",
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: isCurrentDay(date) ? "#8b5cf6" : "#f1f3f4",
                  color: isCurrentDay(date) ? "#ffffff" : "#000000",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "16px",
                  minWidth: "80px",
                  transition: "all 0.2s ease",
                  boxShadow: isCurrentDay(date)
                    ? "0 4px 8px rgba(139, 92, 246, 0.3)"
                    : "0 2px 4px rgba(0,0,0,0.1)",
                }}
                onMouseEnter={(e) => {
                  if (!isCurrentDay(date)) {
                    e.currentTarget.style.backgroundColor = "#e5e7eb";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCurrentDay(date)) {
                    e.currentTarget.style.backgroundColor = "#f1f3f4";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                {dayNames[index]} {date.getDate()}
              </button>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => navigateWeek("next")}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: "#f1f3f4",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              color: "#5f6368",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#e5e7eb";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#f1f3f4";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            ›
          </button>
        </div>

        {/* Add Session Button */}
        <button
          onClick={addSession}
          style={{
            backgroundColor: "#8b5cf6",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "500",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          + Add session
        </button>
      </div>

      {/* Schedule Listing */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {/* Schedule Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            paddingBottom: "10px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: "600",
              color: "#111827",
            }}
          >
            Schedule
          </h2>
          <div style={{ display: "flex", gap: "8px", position: "relative" }}>
            <button
              onClick={toggleHeaderDropdown}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                backgroundColor: "#ffffff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                color: "#6b7280",
              }}
            >
              ⋮
            </button>

            {/* Header Dropdown Menu */}
            {isHeaderDropdownOpen && (
              <div
                data-dropdown
                style={{
                  position: "absolute",
                  top: "36px",
                  right: "0",
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  zIndex: 50,
                  minWidth: "160px",
                }}
              >
                {/* <button
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
                </button> */}
                {!hasSelectedAll ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      selectAllEvents();
                    }}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "none",
                      backgroundColor: "transparent",
                      color: "#374151",
                      fontSize: "14px",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f9fafb";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
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
                      width: "100%",
                      padding: "8px 12px",
                      border: "none",
                      backgroundColor: "transparent",
                      color: "#374151",
                      fontSize: "14px",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f9fafb";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    Unselect All
                  </button>
                )}
                <div
                  style={{
                    height: "1px",
                    backgroundColor: "#e5e7eb",
                    margin: "4px 0",
                  }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const updatedEvents = events.filter((event) => !event.isCompleted);
                    updateEvents(updatedEvents);
                    setHasSelectedAll(false);
                    setRenderKey((prev) => prev + 1); // Force re-render
                    setIsHeaderDropdownOpen(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "none",
                    backgroundColor: "transparent",
                    color: "#dc2626",
                    fontSize: "14px",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    borderRadius: "0 0 8px 8px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#fef2f2";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Schedule Content */}
        <div style={{ display: "flex", gap: "20px", alignItems: "stretch" }}>
          {/* Time Column */}
          <div
            style={{
              minWidth: "120px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {uniqueTimeSlots.length === 0 ? (
              <div
                style={{
                  padding: "20px",
                  textAlign: "center",
                  color: "#9ca3af",
                  fontSize: "14px",
                }}
              >
                No sessions scheduled
              </div>
            ) : (
              uniqueTimeSlots.map((timeSlot, index) => {
                const eventsAtTime = getEventsForTime(timeSlot);
                const parallelCount = eventsAtTime.length;
                // Get end time from first event (assuming all events in slot have same end time)
                const endTime = eventsAtTime[0]?.endTime || timeSlot;
                const currentHeight = timeSlotHeights[timeSlot] || 80;

                return (
                  <div
                    key={timeSlot}
                    style={{
                      height: `${currentHeight}px`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: "10px",
                      position: "relative",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      backgroundColor: "#f9fafb",
                      marginBottom:
                        index < uniqueTimeSlots.length - 1 ? "12px" : "0",
                      flex: "0 0 auto", // Prevent shrinking/growing
                    }}
                  >
                    <span
                      style={{
                        fontSize: "16px",
                        color: "#000000",
                        fontWeight: "700",
                        fontFamily: "system-ui, -apple-system, sans-serif",
                        marginBottom: "10px",
                      }}
                    >
                      {timeSlot}
                    </span>

                    {parallelCount > 1 && (
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "10px",
                          right: "10px",
                          backgroundColor: "#dbeafe",
                          color: "#1e40af",
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "500",
                          textAlign: "center",
                          transform: "translateY(-50%)",
                        }}
                      >
                        {parallelCount} parallel session
                        {parallelCount > 1 ? "s" : ""}
                      </div>
                    )}

                    <span
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        fontSize: "16px",
                        color: "#000000",
                        fontWeight: "700",
                        fontFamily: "system-ui, -apple-system, sans-serif",
                      }}
                    >
                      {endTime}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Events Column */}
          <div
            style={{
              flex: 1,
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Vertical Line */}
            <div
              style={{
                position: "absolute",
                left: "-10px",
                top: "0",
                bottom: "0",
                width: "1px",
                backgroundColor: "#e5e7eb",
              }}
            />

            {uniqueTimeSlots.length === 0 ? (
              <div
                style={{
                  padding: "40px 20px",
                  textAlign: "center",
                  color: "#9ca3af",
                  fontSize: "14px",
                }}
              >
                Click "Add session" to create your first session
              </div>
            ) : (
              uniqueTimeSlots.map((timeSlot, index) => {
                const currentHeight = timeSlotHeights[timeSlot] || 80;

                return (
                  <div
                    key={timeSlot}
                    ref={createRefCallback(timeSlot)}
                    style={{
                      height: `${currentHeight}px`,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "stretch",
                      marginBottom:
                        index < uniqueTimeSlots.length - 1 ? "12px" : "0",
                      flex: "0 0 auto", // Prevent shrinking/growing
                      overflow: "hidden", // Prevent content overflow
                    }}
                  >
                    {getEventsForTime(timeSlot).map((event) => (
                      <div
                        key={event.id}
                        style={{
                          marginBottom: "8px",
                          flex: "0 0 auto", // Prevent event shrinking
                        }}
                      >
                        {renderEvent(event)}
                      </div>
                    ))}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              padding: "24px",
              width: showBlockTypeModal ? "500px" : "600px",
              maxWidth: "90vw",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              position: "relative",
            }}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "none",
                border: "none",
                fontSize: "24px",
                color: "#6b7280",
                cursor: "pointer",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "6px",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f3f4f6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              ×
            </button>

            {showBlockTypeModal ? (
              <>
                {/* Block Type Selection */}
                <div style={{ marginBottom: "24px" }}>
                  <h2
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "20px",
                      fontWeight: "600",
                      color: "#111827",
                    }}
                  >
                    Select block type
                  </h2>
                  <p
                    style={{
                      margin: "0",
                      fontSize: "14px",
                      color: "#6b7280",
                    }}
                  >
                    Select a style for your block.
                  </p>
                </div>

                {/* Block Type Grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    marginBottom: "24px",
                  }}
                >
                  {blockTypes.map((blockType) => (
                    <div
                      key={blockType}
                      onClick={() => handleBlockTypeSelect(blockType)}
                      style={{
                        border:
                          selectedBlockType === blockType
                            ? "2px solid #8b5cf6"
                            : "1px solid #e5e7eb",
                        borderRadius: "8px",
                        padding: "16px",
                        cursor: "pointer",
                        backgroundColor: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        {/* Icon */}
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            backgroundColor: "#f3f4f6",
                            borderRadius: "6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                          }}
                        >
                          <div
                            style={{
                              width: "20px",
                              height: "20px",
                              position: "relative",
                            }}
                          >
                            {/* Colored dots */}
                            <div
                              style={{
                                position: "absolute",
                                top: "2px",
                                left: "2px",
                                width: "4px",
                                height: "4px",
                                backgroundColor: "#fbbf24",
                                borderRadius: "50%",
                              }}
                            />
                            <div
                              style={{
                                position: "absolute",
                                top: "2px",
                                right: "2px",
                                width: "4px",
                                height: "4px",
                                backgroundColor: "#f97316",
                                borderRadius: "50%",
                              }}
                            />
                            <div
                              style={{
                                position: "absolute",
                                bottom: "2px",
                                left: "2px",
                                width: "4px",
                                height: "4px",
                                backgroundColor: "#10b981",
                                borderRadius: "50%",
                              }}
                            />
                            <div
                              style={{
                                position: "absolute",
                                bottom: "2px",
                                right: "2px",
                                width: "4px",
                                height: "4px",
                                backgroundColor: "#8b5cf6",
                                borderRadius: "50%",
                              }}
                            />
                            {/* Horizontal lines */}
                            <div
                              style={{
                                position: "absolute",
                                top: "8px",
                                left: "2px",
                                right: "2px",
                                height: "1px",
                                backgroundColor: "#d1d5db",
                              }}
                            />
                            <div
                              style={{
                                position: "absolute",
                                top: "12px",
                                left: "2px",
                                right: "2px",
                                height: "1px",
                                backgroundColor: "#d1d5db",
                              }}
                            />
                          </div>
                        </div>

                        {/* Text */}
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#111827",
                            lineHeight: "1.4",
                          }}
                        >
                          {blockType}
                        </span>
                      </div>

                      {/* Radio Button */}
                      <div
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          border:
                            selectedBlockType === blockType
                              ? "2px solid #8b5cf6"
                              : "2px solid #d1d5db",
                          backgroundColor:
                            selectedBlockType === blockType
                              ? "#8b5cf6"
                              : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {selectedBlockType === blockType && (
                          <div
                            style={{
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              backgroundColor: "#ffffff",
                            }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <a
                    href="#"
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        backgroundColor: "#f3f4f6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "10px",
                        color: "#6b7280",
                      }}
                    >
                      ?
                    </div>
                    Need help?
                  </a>

                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      onClick={closeModal}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "6px",
                        border: "1px solid #d1d5db",
                        backgroundColor: "#ffffff",
                        color: "#374151",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSelect}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "6px",
                        border: "none",
                        backgroundColor: "#8b5cf6",
                        color: "#ffffff",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: "pointer",
                      }}
                    >
                      Select
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Session Form */}
                <div style={{ marginBottom: "24px" }}>
                  <h2
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "20px",
                      fontWeight: "600",
                      color: "#111827",
                    }}
                  >
                    {isAddingChildSession
                      ? "Add Child Session"
                      : "Add New Session"}
                  </h2>
                  <p
                    style={{
                      margin: "0",
                      fontSize: "14px",
                      color: "#6b7280",
                    }}
                  >
                    {isAddingChildSession
                      ? `Fill in the details for your child ${selectedBlockType.toLowerCase()}.`
                      : `Fill in the details for your ${selectedBlockType.toLowerCase()}.`}
                  </p>
                </div>

                <form onSubmit={handleFormSubmit}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    {/* Parent Session Indicator */}
                    {isAddingChildSession && formData.parentSessionId && (
                      <div
                        style={{
                          padding: "12px",
                          backgroundColor: "#f0f9ff",
                          border: "1px solid #bae6fd",
                          borderRadius: "6px",
                          marginBottom: "8px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#0369a1",
                            fontWeight: "500",
                            marginBottom: "4px",
                          }}
                        >
                          Adding Child Session to:
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            color: "#0c4a6e",
                            fontWeight: "600",
                            marginBottom: "4px",
                          }}
                        >
                          {events.find((e) => e.id === formData.parentSessionId)
                            ?.title || "Parent Session"}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#0369a1",
                            fontStyle: "italic",
                          }}
                        >
                          Parent Time:{" "}
                          {
                            events.find(
                              (e) => e.id === formData.parentSessionId
                            )?.startTime
                          }{" "}
                          -{" "}
                          {
                            events.find(
                              (e) => e.id === formData.parentSessionId
                            )?.endTime
                          }
                        </div>
                      </div>
                    )}

                    {/* Title */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#374151",
                          marginBottom: "6px",
                        }}
                      >
                        Session Title{" "}
                        <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter session title"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                          outline: "none",
                          transition: "border-color 0.2s",
                        }}
                        onFocus={(e) =>
                          (e.currentTarget.style.borderColor = "#8b5cf6")
                        }
                        onBlur={(e) =>
                          (e.currentTarget.style.borderColor = "#d1d5db")
                        }
                      />
                    </div>

                    {/* Time Fields */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "12px",
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#374151",
                            marginBottom: "6px",
                          }}
                        >
                          Start Time <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <input
                          type="time"
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleInputChange}
                          required
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            border: "1px solid #d1d5db",
                            borderRadius: "6px",
                            fontSize: "14px",
                            outline: "none",
                            backgroundColor: "#ffffff",
                            color: "#111827",
                            cursor: "text",
                          }}
                          onFocus={(e) =>
                            (e.currentTarget.style.borderColor = "#8b5cf6")
                          }
                          onBlur={(e) =>
                            (e.currentTarget.style.borderColor = "#d1d5db")
                          }
                        />
                        {isAddingChildSession && (
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#6b7280",
                              marginTop: "4px",
                              fontStyle: "italic",
                            }}
                          >
                            Child session time should be within parent session
                            period
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#374151",
                            marginBottom: "6px",
                          }}
                        >
                          End Time <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <input
                          type="time"
                          name="endTime"
                          value={formData.endTime}
                          onChange={handleInputChange}
                          required
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            border: "1px solid #d1d5db",
                            borderRadius: "6px",
                            fontSize: "14px",
                            outline: "none",
                            backgroundColor: "#ffffff",
                            color: "#111827",
                            cursor: "text",
                          }}
                          onFocus={(e) =>
                            (e.currentTarget.style.borderColor = "#8b5cf6")
                          }
                          onBlur={(e) =>
                            (e.currentTarget.style.borderColor = "#d1d5db")
                          }
                        />
                      </div>
                    </div>

                    {/* Location and Type */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "12px",
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#374151",
                            marginBottom: "6px",
                          }}
                        >
                          Location <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g., Room A, Main Hall"
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            border: "1px solid #d1d5db",
                            borderRadius: "6px",
                            fontSize: "14px",
                            outline: "none",
                          }}
                          onFocus={(e) =>
                            (e.currentTarget.style.borderColor = "#8b5cf6")
                          }
                          onBlur={(e) =>
                            (e.currentTarget.style.borderColor = "#d1d5db")
                          }
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#374151",
                            marginBottom: "6px",
                          }}
                        >
                          Type <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <select
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                          required
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            border: "1px solid #d1d5db",
                            borderRadius: "6px",
                            fontSize: "14px",
                            outline: "none",
                            backgroundColor: "#ffffff",
                          }}
                          onFocus={(e) =>
                            (e.currentTarget.style.borderColor = "#8b5cf6")
                          }
                          onBlur={(e) =>
                            (e.currentTarget.style.borderColor = "#d1d5db")
                          }
                        >
                          <option value="In-Person">In-Person</option>
                          <option value="Virtual">Virtual</option>
                        </select>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#374151",
                          marginBottom: "6px",
                        }}
                      >
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter session description..."
                        rows={3}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                          outline: "none",
                          resize: "vertical",
                          fontFamily: "inherit",
                        }}
                        onFocus={(e) =>
                          (e.currentTarget.style.borderColor = "#8b5cf6")
                        }
                        onBlur={(e) =>
                          (e.currentTarget.style.borderColor = "#d1d5db")
                        }
                      />
                    </div>

                    {/* Participants */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#374151",
                          marginBottom: "6px",
                        }}
                      >
                        Participants
                      </label>
                      <input
                        type="text"
                        name="participants"
                        value={formData.participants}
                        onChange={handleInputChange}
                        placeholder="e.g., Chairman: Dr. Smith, Speaker: Dr. Johnson"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                          outline: "none",
                        }}
                        onFocus={(e) =>
                          (e.currentTarget.style.borderColor = "#8b5cf6")
                        }
                        onBlur={(e) =>
                          (e.currentTarget.style.borderColor = "#d1d5db")
                        }
                      />
                    </div>

                    {/* Tags */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#374151",
                          marginBottom: "6px",
                        }}
                      >
                        Tags
                      </label>
                      <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        placeholder="Enter tags separated by commas"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                          outline: "none",
                        }}
                        onFocus={(e) =>
                          (e.currentTarget.style.borderColor = "#8b5cf6")
                        }
                        onBlur={(e) =>
                          (e.currentTarget.style.borderColor = "#d1d5db")
                        }
                      />
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                          marginTop: "4px",
                        }}
                      >
                        Separate tags with commas (e.g., Workshop, Beginner, AI)
                      </p>
                    </div>

                    {/* Attachments */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#374151",
                          marginBottom: "6px",
                        }}
                      >
                        Number of Attachments
                      </label>
                      <input
                        type="number"
                        name="attachments"
                        value={formData.attachments}
                        onChange={handleInputChange}
                        min="0"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                          outline: "none",
                        }}
                        onFocus={(e) =>
                          (e.currentTarget.style.borderColor = "#8b5cf6")
                        }
                        onBlur={(e) =>
                          (e.currentTarget.style.borderColor = "#d1d5db")
                        }
                      />
                    </div>

                    {/* Form Actions */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "8px",
                        paddingTop: "16px",
                        borderTop: "1px solid #e5e7eb",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setShowBlockTypeModal(true)}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "6px",
                          border: "1px solid #d1d5db",
                          backgroundColor: "#ffffff",
                          color: "#374151",
                          fontSize: "14px",
                          fontWeight: "500",
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f9fafb")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "#ffffff")
                        }
                      >
                        ← Back
                      </button>
                      <div style={{ display: "flex", gap: "12px" }}>
                        <button
                          type="button"
                          onClick={closeModal}
                          style={{
                            padding: "8px 16px",
                            borderRadius: "6px",
                            border: "1px solid #d1d5db",
                            backgroundColor: "#ffffff",
                            color: "#374151",
                            fontSize: "14px",
                            fontWeight: "500",
                            cursor: "pointer",
                            transition: "background-color 0.2s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#f9fafb")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#ffffff")
                          }
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          style={{
                            padding: "8px 24px",
                            borderRadius: "6px",
                            border: "none",
                            backgroundColor: "#8b5cf6",
                            color: "#ffffff",
                            fontSize: "14px",
                            fontWeight: "500",
                            cursor: "pointer",
                            transition: "background-color 0.2s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#7c3aed")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#8b5cf6")
                          }
                        >
                          Add Session
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;
