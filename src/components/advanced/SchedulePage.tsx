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
  const { onNavigateToEditor: onNavigateToEditorContext, onAddComponent } = useNavigation();
  
  // Debug: Log context availability on component mount
  useEffect(() => {
    console.log('🔍 SchedulePage mounted - NavigationContext check:');
    console.log('  - onAddComponent available?', !!onAddComponent);
    console.log('  - onNavigateToEditor available?', !!onNavigateToEditorContext);
    console.log('  - Full context:', { onAddComponent, onNavigateToEditorContext });
  }, [onAddComponent, onNavigateToEditorContext]);
  const onNavigateToEditor = onNavigateToEditorProp || onNavigateToEditorContext;
  
  console.log('SchedulePage: onNavigateToEditor from prop:', typeof onNavigateToEditorProp);
  console.log('SchedulePage: onNavigateToEditor from context:', typeof onNavigateToEditorContext);
  console.log('SchedulePage: Final onNavigateToEditor:', typeof onNavigateToEditor);
  console.log('SchedulePage: onAddComponent:', typeof onAddComponent);
  
  // Get events from Puck props if available
  const puckEventsRaw = (props as any).events || [];
  
  // Convert tags from string to array if needed (Puck stores tags as comma-separated string)
  const puckEvents = puckEventsRaw.map((event: any) => {
    if (event && typeof event.tags === 'string') {
      return {
        ...event,
        tags: event.tags ? event.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0) : []
      };
    }
    return event;
  });
  
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

  // Static default events data
  const staticEvents: ScheduleEvent[] = [
    {
      id: "1",
      title: "Welcome & Opening Keynote",
      startTime: "09:00 AM",
      endTime: "10:00 AM",
      location: "Main Hall",
      type: "In-Person",
      description: "Opening keynote address by the conference chair",
      participants: "Chairman: Dr. Smith, Speaker: Dr. Johnson",
      tags: ["Keynote", "Opening"],
      attachments: 2,
      isCompleted: false,
      isExpanded: false,
      children: []
    },
    {
      id: "2",
      title: "Coffee Break",
      startTime: "10:00 AM",
      endTime: "10:30 AM",
      location: "Lobby",
      type: "In-Person",
      description: "Networking and refreshments",
      isCompleted: false,
      isExpanded: false,
      children: []
    },
    {
      id: "3",
      title: "AI & Machine Learning Workshop",
      startTime: "10:30 AM",
      endTime: "12:00 PM",
      location: "Room A",
      type: "In-Person",
      description: "Hands-on workshop on AI and ML fundamentals",
      participants: "Instructor: Prof. Williams",
      tags: ["Workshop", "AI", "ML"],
      attachments: 5,
      isCompleted: false,
      isExpanded: false,
      children: []
    },
    {
      id: "4",
      title: "Panel Discussion: Future of Tech",
      startTime: "10:30 AM",
      endTime: "12:00 PM",
      location: "Room B",
      type: "Virtual",
      description: "Expert panel discussing emerging technologies",
      participants: "Moderator: Dr. Brown, Panelists: Dr. Davis, Dr. Wilson",
      tags: ["Panel", "Discussion", "Tech"],
      attachments: 1,
      isParallel: true,
      isCompleted: false,
      isExpanded: false,
      children: []
    },
    {
      id: "5",
      title: "Lunch Break",
      startTime: "12:00 PM",
      endTime: "01:00 PM",
      location: "Dining Hall",
      type: "In-Person",
      description: "Buffet lunch and networking",
      isCompleted: false,
      isExpanded: false,
      children: []
    },
    {
      id: "6",
      title: "Poster Session",
      startTime: "01:00 PM",
      endTime: "02:30 PM",
      location: "Exhibition Hall",
      type: "In-Person",
      description: "Poster presentations and networking",
      participants: "Multiple presenters",
      tags: ["Poster", "Networking"],
      attachments: 0,
      isCompleted: false,
      isExpanded: false,
      children: []
    },
    {
      id: "7",
      title: "Advanced React Patterns",
      startTime: "02:30 PM",
      endTime: "04:00 PM",
      location: "Room A",
      type: "In-Person",
      description: "Deep dive into advanced React patterns and best practices",
      participants: "Speaker: Dr. Martinez",
      tags: ["Workshop", "React", "Frontend"],
      attachments: 3,
      isCompleted: false,
      isExpanded: false,
      children: []
    },
    {
      id: "8",
      title: "Closing Remarks",
      startTime: "04:00 PM",
      endTime: "04:30 PM",
      location: "Main Hall",
      type: "In-Person",
      description: "Conference closing and thank you notes",
      participants: "Chairman: Dr. Smith",
      tags: ["Closing"],
      attachments: 0,
      isCompleted: false,
      isExpanded: false,
      children: []
    }
  ];

  // Helper function to normalize event tags (convert string to array if needed)
  const normalizeEventTags = (event: ScheduleEvent | any): ScheduleEvent => {
    if (event && typeof event.tags === 'string') {
      const tagsString = event.tags as string;
      return {
        ...event,
        tags: tagsString ? tagsString.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0) : []
      };
    }
    // Ensure tags is always an array
    if (event && !Array.isArray(event.tags)) {
      return {
        ...event,
        tags: []
      };
    }
    return event;
  };

  // Helper function to normalize an array of events
  const normalizeEvents = (eventsArray: ScheduleEvent[]): ScheduleEvent[] => {
    return eventsArray.map(normalizeEventTags);
  };

  const [events, setEvents] = useState<ScheduleEvent[]>(() => {
    // Initialize with static events if no external data provided
    if (externalEvents && externalEvents.length > 0) {
      return normalizeEvents(externalEvents);
    }
    if (puckEvents && puckEvents.length > 0) {
      return normalizeEvents(puckEvents);
    }
    return normalizeEvents(staticEvents);
  });

  // Sync with external events when they change
  useEffect(() => {
    if (externalEvents && externalEvents.length > 0) {
      setEvents(normalizeEvents(externalEvents));
    } else if (puckEvents && puckEvents.length > 0) {
      setEvents(normalizeEvents(puckEvents));
    }
    // Note: staticEvents are used as initial state, so they'll show by default
  }, [externalEvents, puckEvents]);

  // Notify parent when events change
  const updateEvents = (newEvents: ScheduleEvent[]) => {
    const normalizedEvents = normalizeEvents(newEvents);
    setEvents(normalizedEvents);
    if (onEventsChange) {
      onEventsChange(normalizedEvents);
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
    console.log('🎯 addSession called!');
    console.log('🎯 onAddComponent available?', !!onAddComponent);
    
    // If we're in the Puck editor, add a SessionForm component to the canvas
    if (onAddComponent) {
      console.log('✅ Using onAddComponent to add SessionForm to Puck canvas');
      onAddComponent('SessionForm', {
        sessionTitle: 'New Session',
        startTime: '00:00',
        startAMPM: 'AM',
        endTime: '00:00',
        endAMPM: 'AM',
        location: 'Enter location',
        eventType: 'Select event type',
        ctaText: 'Click to add a section!',
        addButtonText: '+ Add section',
        cancelButtonText: 'Cancel',
        saveButtonText: 'Save',
        showActionButtons: true,
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '40px'
      });
      console.log('✅ SessionForm component added to canvas');
    } else {
      console.log('⚠️ onAddComponent not available, using fallback modal');
      // Fallback: show modal if not in Puck editor
      setIsModalOpen(true);
    }
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
            location: "Enter location",
            eventType: "Select event type",
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
          className={`rounded-lg p-4 mb-2 relative cursor-move transition-opacity duration-200 ${
            isChild
              ? "bg-slate-50 border border-slate-300 shadow-sm ml-8"
              : "bg-white border border-gray-200 shadow-sm ml-0"
          }`}
          style={{
            opacity: event.isCompleted ? 0.6 : 1,
          }}
          draggable={true}
        >
          {/* Checkbox */}
          <div
            onClick={() => toggleEventCompletion(event.id)}
            className={`absolute left-4 top-4 w-4 h-4 rounded-sm cursor-pointer flex items-center justify-center transition-all duration-200 ${
              event.isCompleted
                ? "border-2 border-purple-600 bg-purple-600"
                : "border-2 border-gray-300 bg-transparent"
            }`}
          >
            {event.isCompleted && (
              <span className="text-white text-[10px] font-bold">
                ✓
              </span>
            )}
          </div>

          {/* Event Content */}
          <div className="ml-8">
            {/* Title and Action Buttons */}
            <div className="flex justify-between items-center mb-2">
              <h3 className="m-0 text-base font-bold text-gray-900 flex items-center gap-2">
                {isChild && (
                  <span className="text-xs text-gray-500 font-medium">
                    ↳
                  </span>
                )}
                {event.title}
              </h3>
              <div className="flex gap-2 items-center relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown(event.id);
                  }}
                  className="w-6 h-6 border-none bg-transparent cursor-pointer flex items-center justify-center text-base text-gray-500 rounded"
                >
                  ⋮
                </button>

                {/* Dropdown Menu */}
                {openDropdownId === event.id && (
                  <div className="absolute top-7 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[120px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteEvent(event.id);
                      }}
                      className="w-full px-3 py-2 border-none bg-transparent text-red-600 text-sm text-left cursor-pointer flex items-center gap-2 rounded-lg hover:bg-red-50"
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
                    className="w-6 h-6 border-none bg-transparent cursor-pointer flex items-center justify-center text-base text-gray-500 rounded"
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
                        className="min-w-[32px] h-6 border border-gray-300 bg-white rounded cursor-pointer flex items-center justify-center text-[11px] text-gray-500 transition-all duration-200 mr-1 px-1 gap-0.5 hover:bg-gray-50 hover:border-gray-400"
                        title={`${
                          expandedParents.has(event.id) ? "Hide" : "Show"
                        } ${childSessions.length} child session${
                          childSessions.length > 1 ? "s" : ""
                        }`}
                      >
                        <span>{expandedParents.has(event.id) ? "▲" : "▼"}</span>
                        <span className="text-[10px] font-medium">
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
                  className="w-6 h-6 border border-gray-300 bg-white rounded cursor-pointer flex items-center justify-center text-sm text-gray-500 transition-all duration-200 hover:bg-gray-50 hover:border-gray-400"
                  title="Add Child Session"
                >
                  +
                </button>
              </div>
            </div>

            {/* Time, Location and Type in one line */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-sm text-gray-500">
                {event.startTime} - {event.endTime}
              </span>
              <span className="text-gray-500 text-sm">
                •
              </span>
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-xl text-xs font-medium">
                {event.location}
              </span>
              <span className="text-gray-500 text-sm">
                •
              </span>
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-xl text-xs font-medium flex items-center gap-1">
                {getTypeIcon(event.type)} {event.type}
              </span>
              {Array.isArray(event.tags) && event.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-xl text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Description */}
            {event.description && (
              <div className="text-sm text-gray-500 mb-2">
                {event.description}
              </div>
            )}

            {/* Participants */}
            {event.participants && (
              <div className="text-sm text-gray-500 mb-2">
                {event.participants}
              </div>
            )}

            {/* Attachments */}
            {event.attachments && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-xl text-xs font-medium inline-flex items-center gap-1">
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
              <div className="mt-2 ml-4 border border-gray-200 rounded-md p-2 bg-slate-50">
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
      <div className="font-sans bg-gray-50 min-h-screen p-10">
        {/* Back Button */}
        <button
          onClick={() => setShowSessionFormPage(false)}
          className="mb-6 px-5 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2 transition-all duration-200 hover:bg-gray-200"
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
          location="Enter location"
          eventType="Select event type"
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
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={handleEditSessionForm}
            className="bg-purple-600 text-white border-none rounded-lg px-8 py-3 text-base font-medium cursor-pointer transition-colors duration-200 hover:bg-purple-700"
          >
            Edit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans bg-gray-50 min-h-screen p-5">
      {/* Header with Date Navigation */}
      <div className="bg-white rounded-xl p-5 mb-5 shadow-md">
        <div className="flex items-center justify-between mb-5">
          {/* Left Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              navigateWeek("prev");
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-12 h-12 rounded-full border-none bg-gray-100 cursor-pointer flex items-center justify-center text-xl text-gray-600 transition-all duration-200 shadow-sm pointer-events-auto relative z-10 hover:bg-gray-200 hover:-translate-y-0.5"
          >
            ‹
          </button>

          {/* Date Buttons */}
          <div className="flex gap-3">
            {weekDates.map((date, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  selectDate(date);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                className={`px-6 py-4 rounded-xl border-none cursor-pointer font-semibold text-base min-w-[80px] transition-all duration-200 pointer-events-auto relative z-10 ${
                  isCurrentDay(date)
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                    : "bg-gray-100 text-black shadow-sm hover:bg-gray-200 hover:-translate-y-0.5"
                }`}
              >
                {dayNames[index]} {date.getDate()}
              </button>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              navigateWeek("next");
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-12 h-12 rounded-full border-none bg-gray-100 cursor-pointer flex items-center justify-center text-xl text-gray-600 transition-all duration-200 shadow-sm pointer-events-auto relative z-10 hover:bg-gray-200 hover:-translate-y-0.5"
          >
            ›
          </button>
        </div>

        {/* Add Session Button - Special Interactive Zone for Puck */}
        <div
          data-puck-interactive="true"
          className="pointer-events-auto relative z-[100]"
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              console.log('🔵 =============================================');
              console.log('🔵 Add Session button CLICKED in Preview Mode!');
              console.log('🔵 onAddComponent is:', onAddComponent);
              console.log('🔵 Type of onAddComponent:', typeof onAddComponent);
              console.log('🔵 =============================================');
              addSession();
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            onMouseUp={(e) => {
              e.stopPropagation();
            }}
            className="bg-purple-600 text-white border-none rounded-lg px-6 py-3 text-base font-medium cursor-pointer flex items-center gap-2 pointer-events-auto relative z-[101] select-none"
          >
            + Add session
          </button>
        </div>
      </div>

      {/* Schedule Listing */}
      <div className="bg-white rounded-xl p-5 shadow-md">
        {/* Schedule Header */}
        <div className="flex justify-between items-center mb-5 pb-2.5 border-b border-gray-200">
          <h2 className="m-0 text-xl font-semibold text-gray-900">
            Schedule
          </h2>
          <div className="flex gap-2 relative">
            <button
              onClick={toggleHeaderDropdown}
              className="w-8 h-8 rounded-md border border-gray-300 bg-white cursor-pointer flex items-center justify-center text-base text-gray-500"
            >
              ⋮
            </button>

            {/* Header Dropdown Menu */}
            {isHeaderDropdownOpen && (
              <div
                data-dropdown
                className="absolute top-9 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[160px]"
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
                    className="w-full px-3 py-2 border-none bg-transparent text-gray-700 text-sm text-left cursor-pointer flex items-center gap-2 hover:bg-gray-50"
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
                    className="w-full px-3 py-2 border-none bg-transparent text-gray-700 text-sm text-left cursor-pointer flex items-center gap-2 hover:bg-gray-50"
                  >
                    Unselect All
                  </button>
                )}
                <div className="h-px bg-gray-200 my-1" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const updatedEvents = events.filter((event) => !event.isCompleted);
                    updateEvents(updatedEvents);
                    setHasSelectedAll(false);
                    setRenderKey((prev) => prev + 1); // Force re-render
                    setIsHeaderDropdownOpen(false);
                  }}
                  className="w-full px-3 py-2 border-none bg-transparent text-red-600 text-sm text-left cursor-pointer flex items-center gap-2 rounded-b-lg hover:bg-red-50"
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Schedule Content */}
        <div className="flex gap-5 items-stretch">
          {/* Time Column */}
          <div className="min-w-[120px] flex flex-col">
            {uniqueTimeSlots.length === 0 ? (
              <div className="p-5 text-center text-gray-400 text-sm">
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
                    style={{ height: `${currentHeight}px` }}
                    className={`flex flex-col items-center p-2.5 relative border border-gray-200 rounded-lg bg-gray-50 flex-shrink-0 ${
                      index < uniqueTimeSlots.length - 1 ? "mb-3" : "mb-0"
                    }`}
                  >
                    <span className="text-base text-black font-bold font-sans mb-2.5">
                      {timeSlot}
                    </span>

                    {parallelCount > 1 && (
                      <div className="absolute top-1/2 left-2.5 right-2.5 bg-blue-100 text-blue-800 px-2 py-1 rounded-xl text-xs font-medium text-center -translate-y-1/2">
                        {parallelCount} parallel session
                        {parallelCount > 1 ? "s" : ""}
                      </div>
                    )}

                    <span className="absolute bottom-2.5 text-base text-black font-bold font-sans">
                      {endTime}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Events Column */}
          <div className="flex-1 relative flex flex-col">
            {/* Vertical Line */}
            <div className="absolute -left-2.5 top-0 bottom-0 w-px bg-gray-200" />

            {uniqueTimeSlots.length === 0 ? (
              <div className="py-10 px-5 text-center text-gray-400 text-sm">
                Click "Add session" to create your first session
              </div>
            ) : (
              uniqueTimeSlots.map((timeSlot, index) => {
                const currentHeight = timeSlotHeights[timeSlot] || 80;

                return (
                  <div
                    key={timeSlot}
                    ref={createRefCallback(timeSlot)}
                    style={{ height: `${currentHeight}px` }}
                    className={`flex flex-col justify-start items-stretch flex-shrink-0 overflow-hidden ${
                      index < uniqueTimeSlots.length - 1 ? "mb-3" : "mb-0"
                    }`}
                  >
                    {getEventsForTime(timeSlot).map((event) => (
                      <div
                        key={event.id}
                        className="mb-2 flex-shrink-0"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
          <div
            className={`bg-white rounded-xl p-6 max-w-[90vw] max-h-[90vh] overflow-y-auto shadow-2xl relative ${
              showBlockTypeModal ? "w-[500px]" : "w-[600px]"
            }`}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-transparent border-none text-2xl text-gray-500 cursor-pointer w-8 h-8 flex items-center justify-center rounded-md transition-colors duration-200 hover:bg-gray-100"
            >
              ×
            </button>

            {showBlockTypeModal ? (
              <>
                {/* Block Type Selection */}
                <div className="mb-6">
                  <h2 className="m-0 mb-2 text-xl font-semibold text-gray-900">
                    Select block type
                  </h2>
                  <p className="m-0 text-sm text-gray-500">
                    Select a style for your block.
                  </p>
                </div>

                {/* Block Type Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {blockTypes.map((blockType) => (
                    <div
                      key={blockType}
                      onClick={() => handleBlockTypeSelect(blockType)}
                      className={`rounded-lg p-4 cursor-pointer bg-white flex items-center justify-between transition-all duration-200 ${
                        selectedBlockType === blockType
                          ? "border-2 border-purple-600"
                          : "border border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Icon */}
                        <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center relative">
                          <div className="w-5 h-5 relative">
                            {/* Colored dots */}
                            <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-yellow-400 rounded-full" />
                            <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-orange-500 rounded-full" />
                            <div className="absolute bottom-0.5 left-0.5 w-1 h-1 bg-green-500 rounded-full" />
                            <div className="absolute bottom-0.5 right-0.5 w-1 h-1 bg-purple-600 rounded-full" />
                            {/* Horizontal lines */}
                            <div className="absolute top-2 left-0.5 right-0.5 h-px bg-gray-300" />
                            <div className="absolute top-3 left-0.5 right-0.5 h-px bg-gray-300" />
                          </div>
                        </div>

                        {/* Text */}
                        <span className="text-sm font-medium text-gray-900 leading-snug">
                          {blockType}
                        </span>
                      </div>

                      {/* Radio Button */}
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          selectedBlockType === blockType
                            ? "border-2 border-purple-600 bg-purple-600"
                            : "border-2 border-gray-300 bg-transparent"
                        }`}
                      >
                        {selectedBlockType === blockType && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center">
                  <a
                    href="#"
                    className="text-sm text-gray-500 no-underline flex items-center gap-1.5"
                  >
                    <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-500">
                      ?
                    </div>
                    Need help?
                  </a>

                  <div className="flex gap-3">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSelect}
                      className="px-4 py-2 rounded-md border-none bg-purple-600 text-white text-sm font-medium cursor-pointer"
                    >
                      Select
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Session Form */}
                <div className="mb-6">
                  <h2 className="m-0 mb-2 text-xl font-semibold text-gray-900">
                    {isAddingChildSession
                      ? "Add Child Session"
                      : "Add New Session"}
                  </h2>
                  <p className="m-0 text-sm text-gray-500">
                    {isAddingChildSession
                      ? `Fill in the details for your child ${selectedBlockType.toLowerCase()}.`
                      : `Fill in the details for your ${selectedBlockType.toLowerCase()}.`}
                  </p>
                </div>

                <form onSubmit={handleFormSubmit}>
                  <div className="flex flex-col gap-4">
                    {/* Parent Session Indicator */}
                    {isAddingChildSession && formData.parentSessionId && (
                      <div className="p-3 bg-sky-50 border border-sky-200 rounded-md mb-2">
                        <div className="text-xs text-sky-700 font-medium mb-1">
                          Adding Child Session to:
                        </div>
                        <div className="text-sm text-sky-900 font-semibold mb-1">
                          {events.find((e) => e.id === formData.parentSessionId)
                            ?.title || "Parent Session"}
                        </div>
                        <div className="text-xs text-sky-700 italic">
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
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Session Title{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter session title"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm outline-none transition-colors duration-200 focus:border-purple-600"
                      />
                    </div>

                    {/* Time Fields */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Start Time <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="time"
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm outline-none bg-white text-gray-900 cursor-text transition-colors duration-200 focus:border-purple-600"
                        />
                        {isAddingChildSession && (
                          <p className="text-xs text-gray-500 mt-1 italic">
                            Child session time should be within parent session
                            period
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          End Time <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="time"
                          name="endTime"
                          value={formData.endTime}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm outline-none bg-white text-gray-900 cursor-text transition-colors duration-200 focus:border-purple-600"
                        />
                      </div>
                    </div>

                    {/* Location and Type */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Location <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g., Room A, Main Hall"
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm outline-none transition-colors duration-200 focus:border-purple-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm outline-none bg-white transition-colors duration-200 focus:border-purple-600"
                        >
                          <option value="In-Person">In-Person</option>
                          <option value="Virtual">Virtual</option>
                        </select>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter session description..."
                        rows={3}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm outline-none resize-y font-inherit transition-colors duration-200 focus:border-purple-600"
                      />
                    </div>

                    {/* Participants */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Participants
                      </label>
                      <input
                        type="text"
                        name="participants"
                        value={formData.participants}
                        onChange={handleInputChange}
                        placeholder="e.g., Chairman: Dr. Smith, Speaker: Dr. Johnson"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm outline-none transition-colors duration-200 focus:border-purple-600"
                      />
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Tags
                      </label>
                      <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        placeholder="Enter tags separated by commas"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm outline-none transition-colors duration-200 focus:border-purple-600"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Separate tags with commas (e.g., Workshop, Beginner, AI)
                      </p>
                    </div>

                    {/* Attachments */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Number of Attachments
                      </label>
                      <input
                        type="number"
                        name="attachments"
                        value={formData.attachments}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm outline-none transition-colors duration-200 focus:border-purple-600"
                      />
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-between items-center mt-2 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setShowBlockTypeModal(true)}
                        className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium cursor-pointer transition-colors duration-200 hover:bg-gray-50"
                      >
                        ← Back
                      </button>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={closeModal}
                          className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium cursor-pointer transition-colors duration-200 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 rounded-md border-none bg-purple-600 text-white text-sm font-medium cursor-pointer transition-colors duration-200 hover:bg-purple-700"
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
