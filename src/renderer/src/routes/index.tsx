import { createFileRoute } from '@tanstack/react-router'
import electronLogo from '../assets/electron.svg'
import '../css/index.css'
import { LibraryIcon, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import AddApp from '@renderer/components/AddApp'

export const Route = createFileRoute('/')({
  component: Home
})

function Home() {
  const [addAppModal, setAddAppModal] = useState(false)

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
            <button className="app-item" onClick={() => console.log('Click')}>
              <img src={electronLogo} alt="app-item" />
              <span>Button</span>
            </button>
            <button className="app-item" onClick={() => console.log('Click')}>
              <img src={electronLogo} alt="app-item" />
              <span>Button</span>
            </button>
            <button className="app-item" onClick={() => console.log('Click')}>
              <img src={electronLogo} alt="app-item" />
              <span>Button</span>
            </button>
            <button className="app-item" onClick={() => console.log('Click')}>
              <img src={electronLogo} alt="app-item" />
              <span>Button</span>
            </button>
            <button className="app-item" onClick={() => console.log('Click')}>
              <img src={electronLogo} alt="app-item" />
              <span>Button</span>
            </button>
            <button className="app-item" onClick={() => console.log('Click')}>
              <img src={electronLogo} alt="app-item" />
              <span>Button</span>
            </button>
            <button className="app-item add-app-btn" onClick={() => setAddAppModal(true)}>
              <Plus className="icon" />
            </button>
          </div>
        </div>
      </div>
      <AddApp open={addAppModal} onClose={() => setAddAppModal(false)} />
    </>
  )
}
