import React from 'react'

interface PageNameDialogProps {
  isVisible: boolean
  pageName: string
  onPageNameChange: (name: string) => void
  onConfirm: (name: string) => void
  onCancel: () => void
}

const PageNameDialog: React.FC<PageNameDialogProps> = ({ 
  isVisible, 
  pageName, 
  onPageNameChange, 
  onConfirm, 
  onCancel 
}) => {
  if (!isVisible) return null

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onConfirm(pageName)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        minWidth: '400px',
        maxWidth: '500px'
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>📝 Name Your New Page</h3>
        <p style={{ margin: '0 0 15px 0', color: '#666' }}>
          Give your page a descriptive name (e.g., "Home", "About Us", "Contact")
        </p>
        <input
          type="text"
          value={pageName}
          onChange={(e) => onPageNameChange(e.target.value)}
          placeholder="Enter page name..."
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            marginBottom: '20px'
          }}
          onKeyPress={handleKeyPress}
          autoFocus
        />
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(pageName)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Create Page
          </button>
        </div>
      </div>
    </div>
  )
}

export default PageNameDialog
