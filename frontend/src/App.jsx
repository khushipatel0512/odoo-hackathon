import { useState } from 'react'
import Login from './pages/Login'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [activePage, setActivePage] = useState('dashboard')

  const handleLogout = () => {
    localStorage.removeItem('user')
    setLoggedIn(false)
  }

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-auto">
        {activePage === 'dashboard' && <Dashboard />}
      </main>
    </div>
  )
}

export default App