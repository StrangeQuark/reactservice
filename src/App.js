import Home from './pages/Home';
import Login from './pages/Login'; // Integration line: Auth
import Register from './pages/Register'; // Integration line: Auth
import UserProfile from './pages/UserProfile'; // Integration line: Auth
import ResetPassword from './pages/ResetPassword'; // Integration line: Email
import ResetPasswordSearch from './pages/ResetPasswordSearch'; // Integration line: Auth - Integration line: Email
import ConfirmEmail from './pages/ConfirmEmail'; // Integration line: Auth - Integration line: Email
import {BrowserRouter, Route, Routes} from 'react-router-dom';

const App = () => {
  return (
        <BrowserRouter>
          <Routes>
            <Route path="/" Component={Home}/>
            <Route path="/login" Component={Login}/> {/* Integration line: Auth */}
            <Route path="/register" Component={Register}/> {/* Integration line: Auth */}
            <Route path="/password-reset" Component={ResetPasswordSearch}/> {/* Integration line: Auth */}
            <Route path="/new-password" Component={ResetPassword}/> {/* Integration line: Email */}
            <Route path="/user/:id" Component={UserProfile} /> {/* Integration line: Auth - Integration line: Email */}
            <Route path='/confirm-email' Component={ConfirmEmail}/> {/* Integration line: Auth - Integration line: Email */}
          </Routes>
        </BrowserRouter>
  );
}

export default App;
