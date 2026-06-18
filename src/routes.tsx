import { Navigate, createBrowserRouter } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout.tsx'
import { CreatePropertyPage } from './pages/CreatePropertyPage.tsx'
import { HomePage } from './pages/HomePage.tsx'
import { LoginPage } from './pages/LoginPage.tsx'
import { RecoverPasswordPage } from './pages/RecoverPasswordPage.tsx'
import { PropertiesPage } from './pages/PropertiesPage.tsx'
import { PropertyDetailPage } from './pages/PropertyDetailPage.tsx'
import { RegisterPage } from './pages/RegisterPage.tsx'
import { TermsPage } from './pages/TermsPage'
import { PaymentsPage } from './pages/PaymentsPage.tsx'
import { AgendasPage } from './pages/AgendasPage.tsx'

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
        path: 'propiedades/:id',
        element: <PropertyDetailPage />,
      },
      {
        path: 'crear-propiedad',
        element: <CreatePropertyPage />,
      },
      {
        path: 'agendas',
        element: <AgendasPage />,
      },
      {
        path: 'pagar/:idPublicacion',
        element: <PaymentsPage />,
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
