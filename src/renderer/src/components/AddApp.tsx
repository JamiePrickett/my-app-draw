import '../styles/addApp.css'
import Modal from './Modal'
import electronLogo from '../assets/electron.svg'
import React, { useEffect, useRef, useState } from 'react'
import { AppItem } from '../../../shared/types'

type AddAppProps = {
  open: boolean
  onClose: () => void
  onSubmit: (item: AppItem) => void
  app: AppItem | null
  onDelete: (appId: string) => void
}

const emptyForm = {
  id: '',
  title: '',
  icon: '',
  source: ''
}

export default function AddApp({ open, onClose, onSubmit, app, onDelete }: AddAppProps) {
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [form, setForm] = useState(emptyForm)

  // Clear errors
  useEffect(() => {
    if (!open) {
      setError(null)
      setForm(emptyForm)
      return
    }

    if (app) {
      setForm({ ...app })
    } else {
      setForm(emptyForm)
    }
  }, [open, app])

  async function handleSubmit() {
    try {
      if (form.title.length < 1) {
        setError('Title missing')
        return
      }
      if (form.source === '') {
        setError('Source missing')
        return
      }

      await onSubmit(form)

      setForm(emptyForm)
      setError(null)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error occurred')
    }
  }

  async function handleBrowseApp() {
    const result = await window.api.pickApp()
    if (!result) return
    setForm({ ...form, title: result.title, source: result.source, icon: result.icon || '' })
  }

  function handleIconClick() {
    fileInputRef.current?.click()
  }

  function handleIconChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => setForm({ ...form, icon: reader.result as string })
    reader.readAsDataURL(file)
  }

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="modal-title">{!app ? 'Add App' : 'Edit App'}</h2>
      {error && <p className="error">{error}</p>}
      <button className="browse-btn" onClick={handleBrowseApp}>
        Browse
      </button>
      <input
        className="title-input"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <>
        <img src={form.icon || electronLogo} className="icon-btn" onClick={handleIconClick} />
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
      <div className="modal-app-btn-row">
        <button onClick={handleSubmit} className="add-btn prim">
          Save
        </button>
        {app && app.id && (
          <button className="modal-app-del-btn" onClick={() => onDelete(app.id)}>
            Delete
          </button>
        )}
      </div>
    </Modal>
  )
}
