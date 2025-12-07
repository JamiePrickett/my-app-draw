import { createFileRoute } from '@tanstack/react-router'
import electronLogo from '../assets/electron.svg'
import '../css/index.css'
import { LibraryIcon, Plus, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import AddApp from '../components/AddApp'
import { AppItem } from '../../../shared/types'
import { v4 as uuidv4 } from 'uuid'

export const Route = createFileRoute('/')({
  component: Home
})

function Home() {
  const [apps, setApps] = useState<AppItem[]>([])
  const [addAppModal, setAddAppModal] = useState(false)
  const [launchFails, setLaunchFails] = useState<Record<string, boolean>>({})

  useEffect(() => {
    async function fetchApps() {
      const loaded = await window.api.loadApps()
      setApps(loaded)
    }
    fetchApps()
  }, [])

  async function handleAddApp(newApp: Omit<AppItem, 'id'>) {
    const appWithId: AppItem = { ...newApp, id: uuidv4() }
    const updated = await window.api.addApp(appWithId)
    setApps(updated)
  }

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
        <div className="main-container">
          <div className="search-box">
            <Search color="#fff" className="searchIcon" />
            <input placeholder="Search.." />
          </div>
          <div className="app-list">
            {apps.map((app) => (
              <button key={app.id} className="app-item" onClick={() => handleLaunchApp(app)}>
                {launchFails[app.id] && <p className="fail-text">Launch Failed</p>}
                <img src={app.icon} alt={app.title} />
                <span>{app.title}</span>
              </button>
            ))}

            <button className="app-item add-app-btn" onClick={() => setAddAppModal(true)}>
              <Plus className="icon" />
            </button>
          </div>
        </div>
      </div>
      <AddApp onSubmit={handleAddApp} open={addAppModal} onClose={() => setAddAppModal(false)} />
    </>
  )
}
