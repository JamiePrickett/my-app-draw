import Modal from './Modal'
import electronLogo from '../assets/electron.svg'
import '../css/addApp.css'
import { AppItem } from '../types/app'
import React, { useRef, useState } from 'react'

type AddAppProps = {
  open: boolean
  onClose: () => void
  onSubmit: (item: AppItem) => void
}

export default function AddApp({ open, onClose, onSubmit }: AddAppProps) {
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [form, setForm] = useState({
    id: '2',
    title: '',
    icon: '',
    source: ''
  })

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

      setForm({
        id: '2',
        title: '',
        icon: '',
        source: ''
      })

      setError(null)
      onClose()
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
    reader.onload = () => {
      setForm({ ...form, icon: reader.result as string })
    }

    reader.readAsDataURL(file)
  }

  return (
    <Modal open={open} onClose={onClose} title="Add App">
      {error && <p>{error}</p>}
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
      <button onClick={handleSubmit} className="add-btn prim">
        Add
      </button>
    </Modal>
  )
}
