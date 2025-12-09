import { createFileRoute } from '@tanstack/react-router'
import electronLogo from '../assets/electron.svg'
import '../styles/index.css'
import { Edit, LibraryIcon, Plus, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import AddApp from '../components/AddApp'
import { AppItem } from '../../../shared/types'
import GroupsModal from '../components/GroupsModal'
import { Group } from '../../../shared/types/app'

export const Route = createFileRoute('/')({
  component: Home
})

function Home() {
  const [groups, setGroups] = useState<Group[]>([])
  const [apps, setApps] = useState<AppItem[]>([])
  const [launchFails, setLaunchFails] = useState<Record<string, boolean>>({})
  const [editMode, setEditMode] = useState(false)
  const [editingApp, setEditingApp] = useState<AppItem | null>(null)
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)
  const [addAppModal, setAddAppModal] = useState(false)
  const [groupsModal, setGroupsModal] = useState(false)
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)

  // Load apps once on page load
  useEffect(() => {
    window.api.loadApps().then(setApps)
    window.api.loadGroups().then(setGroups)
  }, [])

  // changes apps shown based on selected group
  const visibleApps = selectedGroupId ? apps.filter((app) => app.groupId === selectedGroupId) : apps

  // Open Group modal for edit / new
  const openGroupModal = (group?: Group) => {
    setEditingGroup(group || null)
    setGroupsModal(true)
  }

  // Open Add App modal for edit / new
  const openAddApp = (app?: AppItem) => {
    setEditingApp(app || null)
    setAddAppModal(true)
  }

  // launch App
  const handleLaunchApp = async (app: AppItem) => {
    const success = await window.api.launchApp(app.source)

    setLaunchFails((prev) => {
      const out = { ...prev }
      if (!success) out[app.id] = true
      else delete out[app.id]
      return out
    })
  }

  return (
    <>
      <div className="base-container">
        {/* Right Menu */}
        <div className="right-menu">
          <button
            className={`menu-item ${!selectedGroupId && 'menu-item-selected'}`}
            onClick={() => setSelectedGroupId(null)}
          >
            <LibraryIcon className="icon" />
          </button>
          {groups.map((Group) => (
            <button
              key={Group.id}
              className={`menu-item ${selectedGroupId === Group.id && 'menu-item-selected'}`}
              onClick={() => (!editMode ? setSelectedGroupId(Group.id) : openGroupModal(Group))}
            >
              <img src={Group.icon || electronLogo} alt="menu-item" />
            </button>
          ))}
          <button
            className="menu-item"
            onClick={() => {
              setEditingGroup(null)
              setGroupsModal(true)
            }}
          >
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
            {visibleApps.map((app) => (
              <button
                key={app.id}
                className="app-item"
                onClick={() => (editMode ? openAddApp(app) : handleLaunchApp(app))}
              >
                {launchFails[app.id] && <p className="error">Launch Failed</p>}
                <img src={app.icon || electronLogo} alt={app.title} />
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
        groups={groups}
        open={addAppModal}
        onClose={() => setAddAppModal(false)}
        app={editingApp}
        onAppsUpdated={setApps}
      />

      {/* Groups Modal */}
      <GroupsModal
        open={groupsModal}
        onClose={() => setGroupsModal(false)}
        group={editingGroup}
        onGroupsUpdated={setGroups}
      />
    </>
  )
}
