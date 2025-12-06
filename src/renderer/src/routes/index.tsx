import { createFileRoute } from '@tanstack/react-router'
import electronLogo from '../assets/electron.svg'
import '../css/index.css'
import { LibraryIcon, Plus, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import AddApp from '@renderer/components/AddApp'
import { AppItem } from '@renderer/types/app'
import { loadApps, saveApps } from '@renderer/lib/appStorage'

export const Route = createFileRoute('/')({
  component: Home
})

function Home() {
  const [apps, setApps] = useState<AppItem[]>([])
  const [addAppModal, setAddAppModal] = useState(false)

  useEffect(() => {
    setApps(loadApps())
  }, [])

  function handleAddApp(newApp: AppItem) {
    const updated = [...apps, newApp]
    setApps(updated)
    saveApps(updated)
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
              <button key={app.id} className="app-item" onClick={() => console.log('Click')}>
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
