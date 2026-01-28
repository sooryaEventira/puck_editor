import React, { useEffect, useMemo, useState } from 'react'
import { fetchAllFolders, fetchFiles, type FileData, type FolderData } from '../../services/resourceService'

type Snapshot = {
  folderUuid?: string
  folderName?: string
  assets?: FileData[]
}

interface ResourceFolderAssetsFieldProps {
  value?: Snapshot
  onChange?: (value: Snapshot) => void
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  fontSize: '14px',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  backgroundColor: '#ffffff',
  color: '#111827',
  outline: 'none'
}

const btnStyle: React.CSSProperties = {
  padding: '8px 10px',
  fontSize: 13,
  fontWeight: 600,
  borderRadius: 8,
  border: '1px solid #d1d5db',
  backgroundColor: '#ffffff',
  color: '#111827',
  cursor: 'pointer'
}

const ResourceFolderAssetsField: React.FC<ResourceFolderAssetsFieldProps> = ({ value, onChange }) => {
  const eventUuid = useMemo(() => localStorage.getItem('currentEventUuid') || '', [])
  const [folders, setFolders] = useState<FolderData[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState<string>('')
  const [selectedFolderUuid, setSelectedFolderUuid] = useState<string>(() => value?.folderUuid || '')
  const [assetsCount, setAssetsCount] = useState<number>(() => (Array.isArray(value?.assets) ? value!.assets!.length : 0))

  useEffect(() => {
    setSelectedFolderUuid(value?.folderUuid || '')
    setAssetsCount(Array.isArray(value?.assets) ? value!.assets!.length : 0)
  }, [value?.assets, value?.folderUuid])

  const loadFolders = async () => {
    if (!eventUuid) return
    setStatus('loading')
    setError('')
    try {
      const all = await fetchAllFolders(eventUuid)
      setFolders(all)
      setStatus('idle')
    } catch (e) {
      setStatus('error')
      setError(e instanceof Error ? e.message : 'Failed to load folders.')
    }
  }

  useEffect(() => {
    void loadFolders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventUuid])

  const loadAssets = async () => {
    if (!selectedFolderUuid) {
      onChange?.({ folderUuid: '', folderName: '', assets: [] })
      setAssetsCount(0)
      return
    }
    setStatus('loading')
    setError('')
    try {
      const files = await fetchFiles(selectedFolderUuid)
      const folderName = folders.find((f) => f.uuid === selectedFolderUuid)?.name || ''
      onChange?.({ folderUuid: selectedFolderUuid, folderName, assets: files })
      setAssetsCount(files.length)
      setStatus('idle')
    } catch (e) {
      setStatus('error')
      setError(e instanceof Error ? e.message : 'Failed to load assets.')
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500, color: '#374151' }}>
        Resource folder
      </label>

      <select
        value={selectedFolderUuid}
        onChange={(e) => setSelectedFolderUuid(e.target.value)}
        style={inputStyle}
      >
        <option value="">-- Select a folder</option>
        {folders.map((f) => (
          <option key={f.uuid} value={f.uuid}>
            {f.name}
          </option>
        ))}
      </select>

      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button type="button" onClick={loadAssets} style={btnStyle} disabled={status === 'loading'}>
          {status === 'loading' ? 'Loading…' : 'Load assets'}
        </button>
        <button type="button" onClick={loadFolders} style={btnStyle} disabled={status === 'loading'}>
          Refresh folders
        </button>
      </div>

      <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
        Loaded assets: {assetsCount}
      </div>

      {error ? (
        <div style={{ marginTop: 8, fontSize: 12, color: '#b91c1c' }}>
          {error}
        </div>
      ) : null}

      {!eventUuid ? (
        <div style={{ marginTop: 8, fontSize: 12, color: '#b45309' }}>
          Event UUID not found. Open the editor from an event context first.
        </div>
      ) : null}
    </div>
  )
}

export default ResourceFolderAssetsField

