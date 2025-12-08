import { createFileRoute } from '@tanstack/react-router'
import electronLogo from '../assets/electron.svg'
import '../styles/index.css'
import { Edit, LibraryIcon, Plus, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import AddApp from '../components/AddApp'
import { AppItem } from '../../../shared/types'
import { v4 as uuidv4 } from 'uuid'

export const Route = createFileRoute('/')({
  component: Home
})

function Home() {
  const [apps, setApps] = useState<AppItem[]>([])
  const [editMode, setEditMode] = useState(false)
  const [addAppModal, setAddAppModal] = useState(false)
  const [editingApp, setEditingApp] = useState<AppItem | null>(null)
  const [launchFails, setLaunchFails] = useState<Record<string, boolean>>({})

  useEffect(() => {
    async function fetchApps() {
      const loaded = await window.api.loadApps()
      setApps(loaded)
    }
    fetchApps()
  }, [])

  // Add new app
  async function handleAddApp(newApp: AppItem) {
    const appWithId: AppItem = { ...newApp, id: uuidv4() }
    const updated = await window.api.addApp(appWithId)
    setApps(updated)
  }

  // Update app
  async function handleUpdateApp(app: AppItem) {
    const updatedApps = await window.api.updateApp(app)
    setApps(updatedApps)
    setEditingApp(null)
    setAddAppModal(false)
  }

  // Delete app
  async function handleDelete(appId: string) {
    const updated = await window.api.deleteApp(appId)
    setApps(updated)
    setEditingApp(null)
    setAddAppModal(false)
  }

  // Closes modal and clears state
  function handleCloseModal() {
    setAddAppModal(false)
    setEditingApp(null)
  }

  // launch App or edit app
  function handleAppClick(app: AppItem) {
    if (!editMode) {
      handleLaunchApp(app)
    } else {
      setEditingApp(app)
      setAddAppModal(true)
    }
  }

  // Launch app
  async function handleLaunchApp(app: AppItem) {
    const success = await window.api.launchApp(app.source)
    setLaunchFails((prev) => ({
      ...prev,
      [app.id]: !success
    }))
  }

  return (
    <>
      <div className="base-container">
        {/* Right Menu */}
        <div className="right-menu">
          <button className="menu-item">
            <LibraryIcon className="icon" />
          </button>
          <button className="menu-item">
            <img src={electronLogo} alt="menu-item" />
          </button>
          <button className="menu-item">
            <img src={electronLogo} alt="menu-item" />
          </button>
          <button className="menu-item">
            <Plus className="icon" />
          </button>
        </div>

        {/* Main Content */}
        <div className="main-container">
          {/* Search Row */}
          <div className="search-row">
            <div className="search-box">
              <Search color="#fff" className="search-icon" />
              <input placeholder="Search.." />
            </div>
            <button
              className={`edit-toggle-btn ${editMode && 'edit-toggle-btn-on'}`}
              onClick={() => setEditMode(!editMode)}
            >
              <Edit className={`edit-icon ${editMode && 'edit-icon-on'}`} />
            </button>
          </div>

          {/* App List */}
          <div className="app-list">
            {apps.map((app) => (
              <button key={app.id} className="app-item" onClick={() => handleAppClick(app)}>
                {launchFails[app.id] && <p className="error">Launch Failed</p>}
                <img src={app.icon} alt={app.title} />
                <span>{app.title}</span>
              </button>
            ))}

            {/* Add App Button */}
            <button
              className="app-item add-app-btn"
              onClick={() => {
                setEditingApp(null)
                setAddAppModal(true)
              }}
            >
              <Plus className="icon" />
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit App Modal */}
      <AddApp
        onSubmit={!editingApp ? handleAddApp : handleUpdateApp}
        open={addAppModal}
        onClose={handleCloseModal}
        app={editingApp}
        onDelete={handleDelete}
      />
    </>
  )
}
