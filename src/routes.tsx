import { Navigate, createBrowserRouter } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout.tsx'
import { ContactPage } from './pages/ContactPage.tsx'
import { HomePage } from './pages/HomePage.tsx'
import { LoginPage } from './pages/LoginPage.tsx'
import { PropertiesPage } from './pages/PropertiesPage.tsx'
import { RegisterPage } from './pages/RegisterPage.tsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'propiedades',
        element: <PropertiesPage />,
      },
      {
        path: 'contacto',
        element: <ContactPage />,
      },
      {
        path: 'iniciar-sesion',
        element: <LoginPage />,
      },
      {
        path: 'registrarse',
        element: <RegisterPage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
])
