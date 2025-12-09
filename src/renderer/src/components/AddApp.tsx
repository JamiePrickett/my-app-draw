import '../styles/addApp.css'
import Select, { SingleValue } from 'react-select'
import Modal from './Modal'
import electronLogo from '../assets/electron.svg'
import React, { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { AppItem } from '../../../shared/types'
import { Group } from '../../../shared/types/app'

type AddAppProps = {
  open: boolean
  onClose: () => void
  app: AppItem | null
  onAppsUpdated: (apps: AppItem[]) => void
  groups: Group[]
}

const EMPTY_FORM: AppItem = {
  id: '',
  title: '',
  icon: '',
  source: '',
  groupId: ''
}

export default function AddApp({ open, onClose, app, onAppsUpdated, groups }: AddAppProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<AppItem>(EMPTY_FORM)
  const titleRef = useRef<HTMLInputElement>(null)

  // Reset and preload form
  useEffect(() => {
    if (!open) {
      setError(null)
      setForm(EMPTY_FORM)
      return
    }

    if (app) setForm(app)
    else setForm(EMPTY_FORM)
  }, [open, app])

  useEffect(() => {
    if (open) {
      setTimeout(() => titleRef.current?.focus(), 0)
    }
  }, [open])

  // Save Updated / New App
  const handleSubmit = async () => {
    try {
      setError(null)

      if (!form.title) return setError('Title Missing')
      if (!form.source) return setError('Source Missing')

      let updatedApps: AppItem[]

      if (app) {
        updatedApps = await window.api.updateApp(form)
      } else {
        updatedApps = await window.api.addApp({ ...form, id: uuidv4() })
      }

      onAppsUpdated(updatedApps)
      onClose()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error occurred')
    }
  }

  // Delete App
  const handleDelete = async () => {
    if (!app) return
    const updated = await window.api.deleteApp(app.id)
    onAppsUpdated(updated)
    onClose()
  }

  const handleBrowseApp = async () => {
    const result = await window.api.pickApp()
    if (!result) return
    setForm({ ...form, title: result.title, source: result.source, icon: result.icon || '' })
  }

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => setForm({ ...form, icon: reader.result as string })
    reader.readAsDataURL(file)
  }

  const groupOptions = groups.map((c) => ({
    value: c.id,
    label: c.title
  }))

  const selectGroup = groupOptions.find((o) => o.value === form.groupId) || null

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="modal-title">{!app ? 'Add App' : 'Edit App'}</h2>
      {error && <p className="error">{error}</p>}

      <button className="browse-btn" onClick={handleBrowseApp}>
        Browse
      </button>
      <input
        ref={titleRef}
        className="title-input"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <>
        <img
          src={form.icon || electronLogo}
          className="icon-btn"
          onClick={() => fileInputRef.current?.click()}
        />
        <input type="file" accept="image/*" onChange={handleIconChange} hidden ref={fileInputRef} />
      </>
      <div className="source-container">
        <input
          placeholder="user/me/app.exe"
          value={form.source}
          onChange={(e) => setForm({ ...form, source: e.target.value })}
        />
        <button onMouseDown={(e) => e.preventDefault()}>Browse</button> {/* TODO: add this */}
      </div>

      {/* Group dropdown box */}
      <Select
        unstyled
        options={groupOptions}
        value={selectGroup}
        onChange={(option: SingleValue<{ value: string; label: string }>) =>
          setForm({ ...form, groupId: option?.value || '' })
        }
        isClearable
        placeholder="Select Group..."
        className="group-select"
        classNamePrefix="group"
      />

      <div className="modal-app-btn-row">
        <button onClick={handleSubmit} className="add-btn prim">
          Save
        </button>
        {app && (
          <button className="modal-app-del-btn" onClick={handleDelete}>
            Delete
          </button>
        )}
      </div>
    </Modal>
  )
}
