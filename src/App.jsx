import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomNavbar from './components/Navbar';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import NewFlashback from './pages/NewFlashback'; // Assuming you have this component
//import Profile from './pages/Profile'; // Assuming you have this component
//import Account from './pages/Account'; // Assuming you have this component
import { initializeTheme } from './utils/theme';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/theme.css'; // Import custom theme styles

function App() {
  useEffect(() => {
    initializeTheme();
  }, []);

  return (
      <Routes>
        <Route path="/signup" element={<SignUp /> } />
        <Route path="/login" element={<SignIn /> } />
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<NewFlashback />} />
        {/* <Route path="/profile" element={<Profile />} /> */}
        {/* <Route path="/account" element={<Account />} /> */}
        {/* Add other routes as needed */}
      </Routes>
  );
}

export default App;


// import { Routes, Route, Navigate } from 'react-router-dom'
// import { useContext, useEffect } from 'react'
// import { AuthContext } from './auth/AuthContext'
// import '@fontsource/roboto/300.css';
// import '@fontsource/roboto/400.css';
// import '@fontsource/roboto/500.css';
// import '@fontsource/roboto/700.css';
// import { Home, NewFlashback, SignIn, SignUp } from './pages/Directory'
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './styles/theme.css';
// import { initializeTheme } from './utils/theme';

// function App() {
//     const { user, loading } = useContext(AuthContext)

//     useEffect(() => {
//         initializeTheme();
//     }, []);

//     if (loading) {
//         return <div>Loading...</div>
//     }

//     return (
//         <Routes>
//             <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
//             <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/" />} />
//             <Route path="/login" element={!user ? <SignIn /> : <Navigate to="/" />} />
//             <Route path="/add" element={user ? <NewFlashback /> : <Navigate to="/login" />} />
//         </Routes>
//     )
// }

// export default App
