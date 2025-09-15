import Home from './pages/Home'
import Login from './pages/Login' // Integration line: Auth
import Register from './pages/Register' // Integration line: Auth
import UserProfile from './pages/UserProfile' // Integration line: Auth
import ResetPassword from './pages/ResetPassword' // Integration line: Auth - Integration line: Email
import ResetPasswordSearch from './pages/ResetPasswordSearch' // Integration line: Auth - Integration line: Email
import ConfirmEmail from './pages/ConfirmEmail' // Integration line: Auth - Integration line: Email
import Settings from './pages/Settings' // Integration line: Auth
import Files from './pages/Files' // Integration line: File
import Vault from './pages/Vault' // Integration line: Vault
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext' // Integration line: Auth

const router = createBrowserRouter(
  [
    { path: "/", element: <Home /> },
    { path: "/login", element: <Login /> }, // Integration line: Auth
    { path: "/register", element: <Register /> }, // Integration line: Auth
    { path: "/password-reset", element: <ResetPasswordSearch /> }, // Integration line: Auth - Integration line: Email
    { path: "/new-password", element: <ResetPassword /> }, // Integration line: Auth - Integration line: Email
    { path: "/user/:id", element: <UserProfile /> }, // Integration line: Auth - Integration line: Email
    { path: "/confirm-email", element: <ConfirmEmail /> }, // Integration line: Auth - Integration line: Email
    { path: "/settings", element: <Settings /> }, // Integration line: Auth
    { path: "/files", element: <Files /> }, // Integration line: File
    { path: "/vault", element: <Vault /> } // Integration line: Vault
  ],
  {
    future: {
      v7_startTransition: true
    },
  }
)

const App = () => {
  return (
    <AuthProvider> {/* Integration line: Auth */}
      <RouterProvider router={router} />
    </AuthProvider> // Integration line: Auth
  )
}

export default App
