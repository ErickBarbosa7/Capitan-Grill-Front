import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './contexts/AuthContext'
import { MenuProvider } from './contexts/MenuContext'
import AppRoutes from './router'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MenuProvider>
          <AppRoutes />
        </MenuProvider>
        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar
          closeOnClick
          pauseOnFocusLoss={false}
          pauseOnHover
          theme="dark"
          style={{ '--toastify-color-success': '#C9A87C' }}
          toastStyle={{
            borderRadius: 12,
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.85rem',
            background: '#2C2A29',
            color: '#F7F5F0',
            border: '1px solid #C9A87C',
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  )
}
