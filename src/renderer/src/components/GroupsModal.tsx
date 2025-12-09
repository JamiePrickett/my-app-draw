import { useEffect, useRef, useState } from 'react'
import electronLogo from '../assets/electron.svg'
import Modal from './Modal'
import { Group } from '../../../shared/types/app'
import { v4 as uuidv4 } from 'uuid'

type GroupModalProps = {
  open: boolean
  onClose: () => void
  group: Group | null
  onGroupsUpdated: (groups: Group[]) => void
}

const EMPTY_FORM = {
  id: '',
  title: '',
  icon: ''
}

export default function GroupsModal({ open, onClose, group, onGroupsUpdated }: GroupModalProps) {
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)

  // Clear error load form data
  useEffect(() => {
    if (!open) {
      setError(null)
      setForm(EMPTY_FORM)
    }

    if (group) setForm(group)
    else setForm(EMPTY_FORM)
  }, [open, group])

  // Save updated / new group
  const handleSubmit = async () => {
    try {
      if (form.title.length < 1) return setError('Title Missing')

      let updatedGroups: Group[]

      if (group) {
        updatedGroups = await window.api.updateGroup(form)
      } else {
        const newGroup = { ...form, id: uuidv4() }
        updatedGroups = await window.api.addGroup(newGroup)
      }

      onGroupsUpdated(updatedGroups)
      onClose()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error occurred')
    }
  }

  // Delete group
  const handleDelete = async () => {
    if (!group) return
    console.log(group)
    const updated = await window.api.deleteGroup(group.id)
    onGroupsUpdated(updated)
    onClose()
  }

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => setForm({ ...form, icon: reader.result as string })
    reader.readAsDataURL(file)
  }

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="modal-title">{!group ? 'Add Group' : 'Edit Group'}</h2>
      {error && <p className="error">{error}</p>}
      <input
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
      <div className="modal-app-btn-row">
        <button onClick={handleSubmit} className="add-btn prim">
          Save
        </button>
        {group && group.id && (
          <button className="modal-app-del-btn" onClick={handleDelete}>
            Delete
          </button>
        )}
      </div>
    </Modal>
  )
}
