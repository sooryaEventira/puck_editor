import React, { useState, useRef, useEffect } from 'react'
import {
  Bold01,
  Italic01,
  Underline01,
  AlignLeft,
  AlignCenter,
  Attachment01,
  Image01,
  List,
  Send01,
  Calendar,
  Plus,
  XClose,
  AlertCircle
} from '@untitled-ui/icons-react'
import type { Macro } from './communicationTypes'
import BroadcastPreviewModal from './BroadcastPreviewModal'
import { ScheduleBroadcastModal } from './ScheduleBroadcastModal'

interface BroadcastComposerProps {
  onCancel: () => void
  onSave: (data: { subject: string; message: string; templateType?: string }) => void
  onSend?: (data: { subject: string; message: string }) => void
  macros?: Macro[]
  initialSubject?: string
  initialMessage?: string
  templateType?: string
  type?: 'email' | 'push-notification'
}

const BroadcastComposer: React.FC<BroadcastComposerProps> = ({
  onCancel,
  onSave,
  onSend,
  macros = [],
  initialSubject = '',
  initialMessage = '',
  type = 'email'
}) => {
  const [activeTab, setActiveTab] = useState<'late-message' | 'settings'>('late-message')
  const [subject, setSubject] = useState(initialSubject || 'Title of your message')
  const [message, setMessage] = useState(initialMessage)
  const [isEditing, setIsEditing] = useState(true)
  const [selectedMacro, setSelectedMacro] = useState<string>('')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [selectedColor, setSelectedColor] = useState('#000000')
  const [showContextualToolbar, setShowContextualToolbar] = useState(false)
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 })
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  
  // Settings Tab State
  const [matchLogic, setMatchLogic] = useState<'ANY' | 'ALL'>('ANY')
  const [filters, setFilters] = useState([
    { id: '1', field: 'Group', operator: 'is', value: 'Speakers' }
  ])

  const colorPickerButtonRef = useRef<HTMLButtonElement>(null)
  const contextualToolbarRef = useRef<HTMLDivElement>(null)

  const editorRef = useRef<HTMLDivElement>(null)

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && initialMessage && editorRef.current.innerHTML !== initialMessage) {
      editorRef.current.innerHTML = initialMessage
    }
  }, []) // Only run once on mount

  const colors = [
    ['#000000', '#1E3A8A', '#166534', '#374151', '#6B7280', '#9CA3AF', '#FFFFFF'],
    ['#10B981', '#3B82F6', '#7F56D9', '#EC4899', '#EF4444', '#F59E0B']
  ]

  const handleInsertMacro = () => {
    if (selectedMacro && editorRef.current) {
      const macroText = `{{${selectedMacro}}}`
      
      editorRef.current.focus()
      
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        
        // Ensure selection is inside the editor
        if (editorRef.current.contains(range.commonAncestorContainer)) {
          range.deleteContents()
          const textNode = document.createTextNode(macroText)
          range.insertNode(textNode)
          
          // Move cursor after inserted text
          range.setStartAfter(textNode)
          range.setEndAfter(textNode)
          selection.removeAllRanges()
          selection.addRange(range)
        } else {
          // If selection is outside, append to end
          editorRef.current.innerHTML += macroText
        }
      } else {
        // No selection, append to end
        editorRef.current.innerHTML += macroText
      }

      setMessage(editorRef.current.innerHTML)
      setSelectedMacro('')
    }
  }

  const handleFormat = (command: string, value?: string) => {
    if (!editorRef.current) return

    // Focus the editor first if it's not active
    if (document.activeElement !== editorRef.current) {
        editorRef.current.focus()
    }

    // Get current selection
    const selection = window.getSelection()
    
    // For foreColor command, if no selection, we need to handle it differently
    if (command === 'foreColor' && (!selection || selection.rangeCount === 0 || selection.toString().length === 0)) {
      // If no text is selected, create a span at cursor position or wrap next typed text
      // For now, we'll apply it to the current position and it will affect next typed text
      const range = document.createRange()
      const sel = window.getSelection()
      
      if (sel && editorRef.current) {
        // Try to find cursor position
        if (sel.anchorNode) {
          const node = sel.anchorNode.nodeType === Node.TEXT_NODE 
            ? sel.anchorNode 
            : editorRef.current
        
          if (node) {
            const offset = sel.anchorOffset || 0
            try {
              range.setStart(node, Math.min(offset, node.textContent?.length || 0))
              range.setEnd(node, Math.min(offset, node.textContent?.length || 0))
              sel.removeAllRanges()
              sel.addRange(range)
            } catch (e) {
              // Fallback: select end of editor
              range.selectNodeContents(editorRef.current)
              range.collapse(false)
              sel.removeAllRanges()
              sel.addRange(range)
            }
          }
        } else {
          // No anchor node, select end of editor
          range.selectNodeContents(editorRef.current)
          range.collapse(false)
          sel.removeAllRanges()
          sel.addRange(range)
        }
      }
    }
    
    // For alignment commands, if no selection, select the current paragraph/line
    if ((command === 'justifyLeft' || command === 'justifyCenter' || command === 'justifyRight' || command === 'justifyFull') && 
        (!selection || selection.rangeCount === 0 || selection.toString().length === 0)) {
      // Select the current line/paragraph
      const range = document.createRange()
      const sel = window.getSelection()
      if (sel && editorRef.current) {
        // Try to find the current block element
        let node: HTMLElement | null = editorRef.current
        if (sel.anchorNode) {
          node = sel.anchorNode.nodeType === Node.TEXT_NODE 
            ? (sel.anchorNode.parentElement as HTMLElement) || editorRef.current
            : (sel.anchorNode as HTMLElement)
        }
        
        // Find the block element (p, div, etc.) or use the editor itself
        while (node && node !== editorRef.current && !['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI'].includes(node.tagName)) {
          node = (node.parentElement as HTMLElement) || editorRef.current
        }
        
        if (node) {
          range.selectNodeContents(node)
          sel.removeAllRanges()
          sel.addRange(range)
        }
      }
    }

    // Execute the command
    try {
      const success = document.execCommand(command, false, value)
      if (success) {
        // Update message content
        if (editorRef.current) {
          setMessage(editorRef.current.innerHTML)
        }
        // Update format state
        setTimeout(() => {
          updateFormatState()
        }, 10)
      } else {
        console.warn(`Command ${command} failed to execute`)
      }
    } catch (error) {
      console.error('Format command failed:', error)
    }
  }

  const updateFormatState = () => {
    if (editorRef.current) {
      // Ensure editor is focused before checking command state
      const wasFocused = document.activeElement === editorRef.current
      if (!wasFocused) {
        editorRef.current.focus()
      }
      
      try {
        setIsBold(document.queryCommandState('bold'))
        setIsItalic(document.queryCommandState('italic'))
        setIsUnderline(document.queryCommandState('underline'))
      } catch (error) {
        console.error('Error updating format state:', error)
      }
      
      // If editor wasn't focused, don't change focus (selection might be lost)
      // But we need to restore selection if there was one
      if (!wasFocused) {
        // Try to restore selection
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          // Selection should be preserved, but if not, we'll let the user continue
        }
      }
    }
  }

  const handleTextSelection = () => {
    // Small delay to ensure selection is complete
    setTimeout(() => {
      const selection = window.getSelection()
      const editor = editorRef.current
      if (!editor) return
      
      // Always update format state when selection changes (even if empty)
      // This ensures buttons reflect the format at cursor position
      updateFormatState()
      
      if (selection && selection.toString().length > 0) {
        const anchorNode = selection.anchorNode
        const focusNode = selection.focusNode
        
        // Check if selection is within the editor
        if (editor && (
          editor.contains(anchorNode) || 
          editor.contains(focusNode) ||
          anchorNode === editor ||
          focusNode === editor
        )) {
          const range = selection.getRangeAt(0)
          const rect = range.getBoundingClientRect()
          const editorRect = editor.getBoundingClientRect()
          
          setToolbarPosition({
            top: rect.top - editorRect.top - 40,
            left: rect.left - editorRect.left + rect.width / 2
          })
          setShowContextualToolbar(true)
        } else {
          // Only hide if we're not interacting with the toolbar
          // This check is handled by the click outside listener mostly, 
          // but we need to be careful not to hide it aggressively here if selection is still valid but maybe lost focus momentarily
          // For now, we'll rely on the selection check. If selection is gone, toolbar should go.
          // But clicking the toolbar might cause temporary selection loss? No, mousedown preventDefault handles that.
        }
      } else {
        setShowContextualToolbar(false)
      }
    }, 10)
  }

  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return

    editor.addEventListener('mouseup', handleTextSelection)
    editor.addEventListener('keyup', handleTextSelection)
    editor.addEventListener('selectionchange', handleTextSelection)

    return () => {
      editor.removeEventListener('mouseup', handleTextSelection)
      editor.removeEventListener('keyup', handleTextSelection)
      editor.removeEventListener('selectionchange', handleTextSelection)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showColorPicker && colorPickerButtonRef.current && !colorPickerButtonRef.current.contains(event.target as Node)) {
        const colorPicker = document.querySelector('.color-picker-popup')
        if (colorPicker && !colorPicker.contains(event.target as Node)) {
          setShowColorPicker(false)
        }
      }
      
      // Fix: Don't close if clicking inside the contextual toolbar
      if (showContextualToolbar && 
          !editorRef.current?.contains(event.target as Node) && 
          !contextualToolbarRef.current?.contains(event.target as Node)) {
        setShowContextualToolbar(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showColorPicker, showContextualToolbar])

  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
    
    if (!editorRef.current) {
      setShowColorPicker(false)
      return
    }

    // Restore focus to editor
    editorRef.current.focus()
    
    // Small delay to ensure focus is restored
    setTimeout(() => {
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) {
        setShowColorPicker(false)
        return
      }

      const range = selection.getRangeAt(0)
      
      // Check if selection is within the editor
      if (!editorRef.current?.contains(range.commonAncestorContainer)) {
        setShowColorPicker(false)
        return
      }

      try {
        // If there's selected text, wrap it in a span with color
        if (range.toString().trim().length > 0) {
          // Create a span element with the color
          const span = document.createElement('span')
          span.style.color = color
          
          // Extract the selected content and wrap it
          const contents = range.extractContents()
          span.appendChild(contents)
          range.insertNode(span)
          
          // Select the newly inserted span
          const newRange = document.createRange()
          newRange.selectNodeContents(span)
          selection.removeAllRanges()
          selection.addRange(newRange)
        } else {
          // No text selected - insert a zero-width space wrapped in span for future text
          const span = document.createElement('span')
          span.style.color = color
          span.innerHTML = '\u200B' // Zero-width space
          range.insertNode(span)
          
          // Move cursor after the span
          range.setStartAfter(span)
          range.collapse(true)
          selection.removeAllRanges()
          selection.addRange(range)
        }

        // Update message content
        if (editorRef.current) {
          setMessage(editorRef.current.innerHTML)
        }
      } catch (error) {
        console.error('Error applying color:', error)
        // Fallback to execCommand
        try {
          handleFormat('foreColor', color)
        } catch (e) {
          console.error('Fallback execCommand also failed:', e)
        }
      }
      
      setShowColorPicker(false)
    }, 10)
  }

  const handleSave = () => {
    onSave({
      subject,
      message,
      templateType: activeTab === 'late-message' ? 'late-message' : undefined
    })
    setIsEditing(false)
  }

  const handleToolbarAction = (e: React.MouseEvent, command: string, value?: string) => {
    e.preventDefault() // Prevent focus loss
    handleFormat(command, value)
  }

  return (
    <div className="space-y-6 px-4 pb-12 pt-28 md:px-10 lg:px-16 -mt-24">
      <style>{`
        .broadcast-editor-content ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1em; }
        .broadcast-editor-content ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 1em; }
        .broadcast-editor-content b, .broadcast-editor-content strong { font-weight: bold; }
        .broadcast-editor-content i, .broadcast-editor-content em { font-style: italic; }
        .broadcast-editor-content u { text-decoration: underline; }
        .broadcast-editor-content p { margin-bottom: 0.5em; }
      `}</style>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ">
        <h1 className="text-[26px] font-semibold  text-primary-dark mb-4 ">Communication</h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <span>Send</span>
            <Send01 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowScheduleModal(true)}
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <span>Schedule</span>
            <Calendar className="h-4 w-4" />
          </button>
        </div>
      </div>
      {/* Tabs and Content Container */}
      <div className="rounded-xl  bg-white overflow-hidden ">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-slate-200 ">
          <button
            type="button"
            onClick={() => setActiveTab('late-message')}
            className={`pb-3 px-1 text-[15px] font-medium font-semibold transition-colors relative whitespace-nowrap ${
              activeTab === 'late-message'
                ? 'text-primary border-b-2 border-primary'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Late Message
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`pb-3 px-1 text-[15px] font-medium font-semibold transition-colors relative whitespace-nowrap ${
              activeTab === 'settings'
                ? 'text-primary border-b-2 border-primary'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 border border-slate-200">
        {activeTab === 'late-message' ? (
          <div className="space-y-4">
            {isEditing ? (
              <>
                {/* Subject Line */}
                <div 
                  className={`group relative flex flex-col w-full rounded-md border ${
                    type === 'email' && subject.length > 60 ? 'border-orange-300' : 'border-slate-300'
                  } bg-slate-50 transition-all`}
                  onClick={() => document.getElementById('subject')?.focus()}
                >
                  <div className="flex items-center px-3 pt-2.5">
                    <label htmlFor="subject" className="text-sm font-semibold text-slate-700 mr-2 cursor-text shrink-0">
                      {type === 'push-notification' ? 'Title:' : 'Subject:'}
                    </label>
                    <input
                      id="subject"
                      type="text"
                      value={subject}
                      onChange={(e) => {
                        const limit = type === 'push-notification' ? 50 : 120
                        if (e.target.value.length <= limit) {
                          setSubject(e.target.value)
                        }
                      }}
                      className="flex-1 bg-transparent border-none p-0 text-sm text-slate-900 focus:ring-0 focus:outline-none placeholder-slate-400"
                    />
                  </div>
                  
                  {/* Warning and Counter */}
                  <div className="px-3 pb-1.5 flex items-center gap-2 min-h-[20px]">
                    {type === 'email' && subject.length > 60 && (
                      <div className="group/warning relative flex items-center">
                        <AlertCircle className="h-3 w-3 text-orange-500" />
                        <div className="absolute bottom-full left-0 mb-2 hidden w-max rounded bg-slate-900 px-2 py-1 text-xs text-white shadow-lg group-hover/warning:block z-10">
                          May be truncated on mobile
                          <div className="absolute -bottom-1 left-1 h-2 w-2 rotate-45 bg-slate-900"></div>
                        </div>
                      </div>
                    )}
                    <span className={`text-[10px] ${
                      (type === 'email' && subject.length > 60) || (type === 'push-notification' && subject.length >= 50)
                        ? 'text-orange-500 font-medium' 
                        : 'text-slate-400'
                    }`}>
                      {type === 'push-notification' 
                        ? `${50 - subject.length} characters left`
                        : `${120 - subject.length} characters left`
                      }
                    </span>
                  </div>
                </div>

                {/* Formatting Toolbar */}
                <div className="flex flex-wrap items-center gap-1.5  border-slate-200 pb-3">
                  {/* Insert Macro Dropdown */}
                  <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault()
                        // Toggle dropdown - in real implementation, this would show a dropdown menu
                        const macro = macros[0]
                        if (macro) {
                            setSelectedMacro(macro.macro.replace(/[{}]/g, ''))
                            handleInsertMacro()
                        }
                    }}
                    className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm hover:bg-slate-50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <span>{'{ }'}</span>
                    <span>Insert</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Font Selection */}
                  <select
                    className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    defaultValue="Inter"
                  >
                    <option value="Inter">T Inter</option>
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times">Times New Roman</option>
                  </select>

                  <div className="h-5 w-px bg-slate-300" />

                  {/* Text Formatting */}
                  <button
                    type="button"
                    onMouseDown={(e) => handleToolbarAction(e, 'bold')}
                    className={`flex h-8 w-8 items-center justify-center rounded transition ${
                      isBold 
                        ? 'bg-slate-200 text-slate-900' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                    title="Bold"
                  >
                    <Bold01 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => handleToolbarAction(e, 'italic')}
                    className={`flex h-8 w-8 items-center justify-center rounded transition ${
                      isItalic 
                        ? 'bg-slate-200 text-slate-900' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                    title="Italic"
                  >
                    <Italic01 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => handleToolbarAction(e, 'underline')}
                    className={`flex h-8 w-8 items-center justify-center rounded transition ${
                      isUnderline 
                        ? 'bg-slate-200 text-slate-900' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                    title="Underline"
                  >
                    <Underline01 className="h-4 w-4" />
                  </button>

                  <div className="h-5 w-px bg-slate-300" />

                  {/* Text Color - Black Circle */}
                  <div className="relative">
                    <button
                      ref={colorPickerButtonRef}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        // Save current selection before opening color picker
                        if (editorRef.current) {
                          editorRef.current.focus()
                        }
                      }}
                      onClick={() => {
                        // Ensure editor has focus before opening color picker
                        if (editorRef.current) {
                          editorRef.current.focus()
                        }
                        setShowColorPicker(!showColorPicker)
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded hover:bg-slate-100"
                      title="Text Color"
                    >
                      <div className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: selectedColor }} />
                    </button>
                    {showColorPicker && (
                      <div className="color-picker-popup absolute left-0 top-full z-50 mt-1 rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
                        <div className="grid grid-cols-7 gap-2">
                          {colors[0].map((color, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleColorSelect(color)
                              }}
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleColorSelect(color)
                              }}
                              className={`h-8 w-8 rounded border-2 transition ${
                                selectedColor === color ? 'border-primary ring-2 ring-primary/20' : 'border-slate-300'
                              }`}
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                        <div className="mt-2 grid grid-cols-6 gap-2">
                          {colors[1].map((color, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleColorSelect(color)
                              }}
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleColorSelect(color)
                              }}
                              className={`h-8 w-8 rounded border-2 transition ${
                                selectedColor === color ? 'border-primary ring-2 ring-primary/20' : 'border-slate-300'
                              }`}
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            type="button"
                            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                          >
                            Custom
                          </button>
                          <input
                            type="text"
                            value={selectedColor}
                            onChange={(e) => setSelectedColor(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                handleColorSelect(selectedColor)
                              }
                            }}
                            onBlur={() => {
                              // Validate color format before applying
                              const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
                              if (colorRegex.test(selectedColor)) {
                                handleColorSelect(selectedColor)
                              }
                            }}
                            className="flex-1 rounded-md border border-slate-300 px-2 py-1.5 text-xs text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="#7F56D9"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="h-5 w-px bg-slate-300" />

                  {/* Alignment */}
                  <button
                    type="button"
                    onMouseDown={(e) => handleToolbarAction(e, 'justifyLeft')}
                    className="flex h-8 w-8 items-center justify-center rounded text-slate-600 hover:bg-slate-100"
                    title="Align Left"
                  >
                    <AlignLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => handleToolbarAction(e, 'justifyCenter')}
                    className="flex h-8 w-8 items-center justify-center rounded text-slate-600 hover:bg-slate-100"
                    title="Align Center"
                  >
                    <AlignCenter className="h-4 w-4" />
                  </button>
                  <div className="h-5 w-px bg-slate-300" />

                  {/* Lists */}
                  <button
                    type="button"
                    onMouseDown={(e) => handleToolbarAction(e, 'insertUnorderedList')}
                    className="flex h-8 w-8 items-center justify-center rounded text-slate-600 hover:bg-slate-100"
                    title="Bullet List"
                  >

                    <List className="h-4 w-4"/>
                  </button>


                  <div className="h-5 w-px bg-slate-300" />

                  {/* Link (Attachment) and Image */}
                  <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault()
                        const url = prompt('Enter URL:')
                        if (url) handleFormat('createLink', url)
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded text-slate-600 hover:bg-slate-100"
                    title="Insert Link"
                  >
                    <Attachment01 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault()
                        const url = prompt('Enter image URL:')
                        if (url) handleFormat('insertImage', url)
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded text-slate-600 hover:bg-slate-100"
                    title="Insert Image"
                  >
                    <Image01 className="h-4 w-4" />
                  </button>
                </div>

                {/* Message Body */}
                <div className="relative mt-2">
                  <div
                    ref={editorRef}
                    contentEditable
                    onInput={(e) => {
                      const html = e.currentTarget.innerHTML
                      setMessage(html)
                      // Update format state after input to reflect current formatting
                      setTimeout(() => updateFormatState(), 10)
                    }}
                    onKeyUp={() => {
                      // Update format state on key up to catch cursor movements
                      updateFormatState()
                    }}
                    onBlur={() => {
                      // Update format state when editor loses focus
                      updateFormatState()
                    }}
                    onFocus={() => {
                      // Update format state when editor gains focus
                      updateFormatState()
                    }}
                    className="broadcast-editor-content min-h-[400px] w-full -mt-2 rounded-md border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}
                    data-placeholder=""
                    suppressContentEditableWarning
                  />
                  
                  {/* Contextual Toolbar */}
                  {showContextualToolbar && (
                    <div
                      ref={contextualToolbarRef}
                      className="absolute z-50 flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-900 p-1.5 shadow-lg"
                      style={{
                        top: `${toolbarPosition.top}px`,
                        left: `${toolbarPosition.left}px`,
                        transform: 'translateX(-50%)'
                      }}
                      onMouseDown={(e) => e.preventDefault()} // Prevent focus loss when clicking toolbar background
                    >
                      <button
                        type="button"
                        onMouseDown={(e) => handleToolbarAction(e, 'bold')}
                        className={`flex h-7 w-7 items-center justify-center rounded text-white transition hover:bg-slate-700 ${
                          isBold ? 'bg-slate-700' : ''
                        }`}
                        title="Bold"
                      >
                        <Bold01 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => handleToolbarAction(e, 'italic')}
                        className={`flex h-7 w-7 items-center justify-center rounded text-white transition hover:bg-slate-700 ${
                          isItalic ? 'bg-slate-700' : ''
                        }`}
                        title="Italic"
                      >
                        <Italic01 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => handleToolbarAction(e, 'underline')}
                        className={`flex h-7 w-7 items-center justify-center rounded text-white transition hover:bg-slate-700 ${
                          isUnderline ? 'bg-slate-700' : ''
                        }`}
                        title="Underline"
                      >
                        <Underline01 className="h-3.5 w-3.5" />
                      </button>
                      <div className="h-5 w-px bg-slate-600" />
                      <button
                        type="button"
                        onMouseDown={(e) => handleToolbarAction(e, 'justifyLeft')}
                        className="flex h-7 w-7 items-center justify-center rounded text-white transition hover:bg-slate-700"
                        title="Align Left"
                      >
                        <AlignLeft className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => handleToolbarAction(e, 'justifyCenter')}
                        className="flex h-7 w-7 items-center justify-center rounded text-white transition hover:bg-slate-700"
                        title="Align Center"
                      >
                        <AlignCenter className="h-3.5 w-3.5" />
                      </button>
                      <div className="h-5 w-px bg-slate-600" />
                      <button
                        type="button"
                        onMouseDown={(e) => handleToolbarAction(e, 'insertUnorderedList')}
                        className="flex h-7 w-7 items-center justify-center rounded text-white transition hover:bg-slate-700"
                        title="Bullet List"
                      >
                        <List className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-6">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    Save changes
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div className='border-b border-slate-200 pb-2 flex items-center justify-between'>
                  <div>
                    <span className="font-bold text-slate-900">{type === 'push-notification' ? 'Title: ' : 'Subject: '}</span>
                    <span className="font-medium text-slate-900">{subject}</span>
                  </div>
                  {type === 'email' && subject.length > 60 && (
                    <div className="group relative flex items-center cursor-help">
                      <div className="flex items-center gap-1 rounded bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700 border border-orange-200">
                        May be truncated on mobile
                        <AlertCircle className="h-3 w-3" />
                      </div>
                    </div>
                  )}
                </div>
                <div 
                  className="broadcast-editor-content text-slate-600"
                  dangerouslySetInnerHTML={{ __html: message }}
                />
                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 h-[calc(100vh-200px)] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h2 className="text-base font-semibold text-slate-900">Recipients</h2>
              <button
                type="button"
                onClick={() => setFilters([...filters, { id: Date.now().toString(), field: 'Group', operator: 'is', value: '' }])}
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <Plus className="h-4 w-4" />
                <span>New filter</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
                  <span>Matching</span>
                  <select
                    value={matchLogic}
                    onChange={(e) => setMatchLogic(e.target.value as 'ANY' | 'ALL')}
                    className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm font-medium text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="ANY">ANY</option>
                    <option value="ALL">ALL</option>
                  </select>
                  <span>of the following filters</span>
                </div>
                <div className="text-sm font-medium text-primary self-end sm:self-auto">
                  400/500
                </div>
              </div>

              <div className="space-y-3">
                {filters.map((filter, index) => (
                  <div key={filter.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-slate-50 rounded-lg sm:bg-transparent sm:p-0">
                    <select
                      value={filter.field}
                      onChange={(e) => {
                        const newFilters = [...filters]
                        newFilters[index].field = e.target.value
                        setFilters(newFilters)
                      }}
                      className="w-full sm:w-auto sm:min-w-[140px] rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="Group">Group</option>
                      <option value="Status">Message Status</option>                
                    </select>

                    <select
                      value={filter.operator}
                      onChange={(e) => {
                        const newFilters = [...filters]
                        newFilters[index].operator = e.target.value
                        setFilters(newFilters)
                      }}
                      className="w-full sm:w-[80px] rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="is">is</option>
                      <option value="is_not">is not</option>
                    </select>

                    <select
                      value={filter.value}
                      onChange={(e) => {
                        const newFilters = [...filters]
                        newFilters[index].value = e.target.value
                        setFilters(newFilters)
                      }}
                      className="w-full sm:flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="Speakers">Speakers</option>
                      <option value="Attendees">Attendees</option>
                      <option value="Sponsors">Sponsors</option>
                      <option value="VIP">VIP</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => {
                        const newFilters = filters.filter(f => f.id !== filter.id)
                        setFilters(newFilters)
                      }}
                      className="self-end sm:self-auto rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                      <XClose className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
      
      <BroadcastPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        onSend={() => {
            if (onSend) {
                onSend({ subject, message })
            }
            setShowPreviewModal(false)
        }}
        subject={subject}
        message={message}
      />

      <ScheduleBroadcastModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSchedule={(date) => {
          console.log('Scheduled for:', date)
          setShowScheduleModal(false)
          // In a real app, you would probably call an onSchedule prop here
        }}
      />
    </div>
  )
}
export default BroadcastComposer
