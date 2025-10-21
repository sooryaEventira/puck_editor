import React, { useState, useEffect, useRef } from 'react'

interface Message {
  id: string
  text: string
  timestamp: Date
  sender: 'user' | 'agent'
}

interface LiveChatProps {
  title?: string
  height?: string
  backgroundColor?: string
  headerColor?: string
  headerTextColor?: string
  messageUserBg?: string
  messageAgentBg?: string
  inputBorderColor?: string
  buttonColor?: string
  buttonTextColor?: string
  placeholderText?: string
}

const LiveChat: React.FC<LiveChatProps> = ({
  title = 'Live Chat',
  height = '500px',
  backgroundColor = '#ffffff',
  headerColor = '#8b5cf6',
  headerTextColor = '#ffffff',
  messageUserBg = '#3b82f6',
  messageAgentBg = '#e5e7eb',
  inputBorderColor = '#d1d5db',
  buttonColor = '#3b82f6',
  buttonTextColor = '#ffffff',
  placeholderText = 'Type your message...'
}) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const STORAGE_KEY = 'livechat_messages'

  // Load messages from localStorage on mount
  useEffect(() => {
    try {
      const storedMessages = localStorage.getItem(STORAGE_KEY)
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages)
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
        setMessages(messagesWithDates)
      }
    } catch (error) {
      console.error('Error loading messages from localStorage:', error)
    }
  }, [])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    } catch (error) {
      console.error('Error saving messages to localStorage:', error)
    }
  }, [messages])

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (inputValue.trim() === '') return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      timestamp: new Date(),
      sender: 'user'
    }

    setMessages(prev => [...prev, newMessage])
    setInputValue('')
  }

  const handleClearChat = () => {
    setMessages([])
    localStorage.removeItem(STORAGE_KEY)
  }

  const handleAgentReply = () => {
    const agentResponses = [
      "Hello! How can I help you today?",
      "I'm here to assist you with any questions.",
      "Thank you for your message. Let me help you with that.",
      "That's a great question! Let me provide some information.",
      "I understand. Is there anything specific you'd like to know?",
      "Thanks for reaching out! I'm happy to help."
    ]
    
    const randomResponse = agentResponses[Math.floor(Math.random() * agentResponses.length)]
    
    const agentMessage: Message = {
      id: Date.now().toString(),
      text: randomResponse,
      timestamp: new Date(),
      sender: 'agent'
    }

    setMessages(prev => [...prev, agentMessage])
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  // Container styles
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: height,
    backgroundColor: backgroundColor,
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    margin: '16px 0'
  }

  // Header styles
  const headerStyle: React.CSSProperties = {
    backgroundColor: headerColor,
    color: headerTextColor,
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
  }

  const headerTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '600',
    margin: 0
  }

  const headerButtonsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px'
  }

  const headerButtonStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    color: headerTextColor,
    border: `1px solid ${headerTextColor}`,
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontWeight: '500'
  }

  // Messages area styles
  const messagesAreaStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    backgroundColor: '#f9fafb'
  }

  // Message styles
  const messageStyle = (sender: 'user' | 'agent'): React.CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: sender === 'user' ? 'flex-end' : 'flex-start',
    maxWidth: '70%',
    alignSelf: sender === 'user' ? 'flex-end' : 'flex-start'
  })

  const messageBubbleStyle = (sender: 'user' | 'agent'): React.CSSProperties => ({
    backgroundColor: sender === 'user' ? messageUserBg : messageAgentBg,
    color: sender === 'user' ? '#ffffff' : '#1f2937',
    padding: '10px 14px',
    borderRadius: sender === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
    wordWrap: 'break-word',
    fontSize: '14px',
    lineHeight: '1.5'
  })

  const timestampStyle: React.CSSProperties = {
    fontSize: '11px',
    color: '#9ca3af',
    marginTop: '4px',
    padding: '0 4px'
  }

  // Input area styles
  const inputAreaStyle: React.CSSProperties = {
    padding: '16px',
    backgroundColor: backgroundColor,
    borderTop: `1px solid ${inputBorderColor}`,
    position: 'relative'
  }

  const inputContainerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  }

  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: '12px 48px 12px 14px',
    border: `1px solid ${inputBorderColor}`,
    borderRadius: '24px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    backgroundColor: '#f9fafb'
  }

  const sendIconButtonStyle: React.CSSProperties = {
    position: 'absolute',
    right: '8px',
    backgroundColor: buttonColor,
    color: buttonTextColor,
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    padding: 0
  }

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: '14px',
    padding: '40px 20px'
  }

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h3 style={headerTitleStyle}>{title}</h3>
        <div style={headerButtonsStyle}>
          <button
            style={headerButtonStyle}
            onClick={handleAgentReply}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            Agent Reply
          </button>
          <button
            style={headerButtonStyle}
            onClick={handleClearChat}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            Clear Chat
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div style={messagesAreaStyle}>
        {messages.length === 0 ? (
          <div style={emptyStateStyle}>
            No messages yet. Start a conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} style={messageStyle(message.sender)}>
              <div style={messageBubbleStyle(message.sender)}>
                {message.text}
              </div>
              <div style={timestampStyle}>
                {formatTime(message.timestamp)}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} style={inputAreaStyle}>
        <div style={inputContainerStyle}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholderText}
            style={inputStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = buttonColor
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = inputBorderColor
            }}
          />
          <button
            type="submit"
            disabled={inputValue.trim() === ''}
            style={{
              ...sendIconButtonStyle,
              opacity: inputValue.trim() === '' ? 0.4 : 1,
              cursor: inputValue.trim() === '' ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={(e) => {
              if (inputValue.trim() !== '') {
                e.currentTarget.style.transform = 'scale(1.1)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </form>
    </div>
  )
}

export default LiveChat

