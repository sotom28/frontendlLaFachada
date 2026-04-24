import { Navigate, createBrowserRouter } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout.tsx'
import { ContactPage } from './pages/ContactPage.tsx'
import { HomePage } from './pages/HomePage.tsx'
import { LoginPage } from './pages/LoginPage.tsx'
import { RecoverPasswordPage } from './pages/RecoverPasswordPage'
import { PropertiesPage } from './pages/PropertiesPage.tsx'
import { RegisterPage } from './pages/RegisterPage.tsx'
import { TermsPage } from './pages/TermsPage'

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
        path: 'recuperar-contrasena',
        element: <RecoverPasswordPage />,
      },
      {
        path: 'registrarse',
        element: <RegisterPage />,
      },
      {
        path: 'terminos-y-condiciones',
        element: <TermsPage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
])
