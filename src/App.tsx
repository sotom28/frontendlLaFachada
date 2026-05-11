import { RouterProvider } from 'react-router-dom'
import './App.css'
import { router } from './routes.tsx'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
