import Modal from './Modal'
import electronLogo from '../assets/electron.svg'
import '../css/addApp.css'

export default function AddApp({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Add App">
      <button className="browse-btn">Browse</button>
      <input className="title-input" placeholder="Title" />
      <img src={electronLogo} className="icon-btn" />
      <div className="source-container">
        <input placeholder="user/me/app.exe" />
        <button onMouseDown={(e) => e.preventDefault()}>Browse</button>
      </div>
      <button className="add-btn prim">Add</button>
    </Modal>
  )
}
