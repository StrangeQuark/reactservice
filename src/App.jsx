import Home from './pages/Home'
import Login from './pages/Login' // Integration line: Auth
import Register from './pages/Register' // Integration line: Auth
import UserProfile from './pages/UserProfile' // Integration line: Auth
import ResetPassword from './pages/ResetPassword' // Integration line: Email
import ResetPasswordSearch from './pages/ResetPasswordSearch' // Integration line: Auth - Integration line: Email
import ConfirmEmail from './pages/ConfirmEmail' // Integration line: Auth - Integration line: Email
import Settings from './pages/Settings' // Integration line: Auth
import Files from './pages/Files' // Integration line: Files
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

const router = createBrowserRouter(
  [
    { path: "/", element: <Home /> },
    { path: "/login", element: <Login /> }, // Integration line: Auth
    { path: "/register", element: <Register /> }, // Integration line: Auth
    { path: "/password-reset", element: <ResetPasswordSearch /> }, // Integration line: Auth
    { path: "/new-password", element: <ResetPassword /> }, // Integration line: Email
    { path: "/user/:id", element: <UserProfile /> }, // Integration line: Auth - Integration line: Email
    { path: "/confirm-email", element: <ConfirmEmail /> }, // Integration line: Auth - Integration line: Email
    { path: "/settings", element: <Settings /> }, // Integration line: Auth
    { path: "/files", element: <Files /> } // Integration line: Files
  ],
  {
    future: {
      v7_startTransition: true
    },
  }
)

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
