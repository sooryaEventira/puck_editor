import React from 'react'

interface PdfOption {
  label: string
  value: string
}

interface PdfSelectFieldProps {
  name?: string
  value?: string
  onChange?: (value: string) => void
  field?: any
}

// Hard-coded PDF options
const PDF_OPTIONS: PdfOption[] = [
  { label: 'Select a PDF...', value: '' },
  { 
    label: 'Sample PDF (Mozilla)', 
    value: 'https://www.maricopa.gov/DocumentCenter/View/7469/Sample-Floor-Plan-PDF' 
  },
  { 
    label: 'Sample PDF (W3C)', 
    value: 'https://www.africau.edu/images/default/sample.pdf' 
  },
  { 
    label: 'Local PDF (test.pdf)', 
    value: '/pdfs/test.pdf' 
  }
]

const PdfSelectField: React.FC<PdfSelectFieldProps> = ({
  value = '',
  onChange
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(event.target.value)
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <label
        style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: 500,
          color: '#374151'
        }}
      >
        Select PDF
      </label>
      <select
        value={value}
        onChange={handleChange}
        style={{
          width: '100%',
          padding: '8px 12px',
          fontSize: '14px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          backgroundColor: '#ffffff',
          color: '#111827',
          cursor: 'pointer',
          outline: 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#6366f1'
          e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#d1d5db'
          e.target.style.boxShadow = 'none'
        }}
      >
        {PDF_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default PdfSelectField

