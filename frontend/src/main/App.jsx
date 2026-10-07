import { Routes, Route } from 'react-router-dom';

import LoginPage from '../Pages/AuthPage/LoginPage.jsx';

/* 

import RegisterPage from '../Pages/AuthPages/RegisterPage.jsx';
import ConfirmRegister from '../Pages/AuthPages/ConfirmRegister.jsx';
import RecoverPage from '../Pages/AuthPages/RecoverPage.jsx';

import DashboardPage from '../Pages/Dashboard/DashboardPage.jsx';

*/

function App() {
  return (
    <main className='App'>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route path="/login" element={<LoginPage />} />

        {/*
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/confirm-register" element={<ConfirmRegister />} />
        <Route path="/forgot-password" element={<RecoverPage />}/>

        <Route path="/dashboard" element={<DashboardPage />} />
        */}
        
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </main>
  )
}

export default App;