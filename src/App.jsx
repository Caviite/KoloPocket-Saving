import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Authpage from './pages/AuthPage';
import Landingpage from './pages/Landingpage';
import Notfoundpage from './pages/Notfoundpage';
import Setting from './pages/Setting';
import Dashboard from './pages/AlajoDashboard';
import Createajogroup from './pages/Createajogroup';
import AllAjoGroups from './pages/AllAjoGroups';
import AjoGroupDetails from './pages/AjoGroupDetails';
import AuthProvider from './Context/authprovider';
import { setupLogoutInterceptor } from "./api/api";
import { useContext, useEffect } from 'react';
import { authContext } from './Context/authcontext';
import { useNavigate } from 'react-router-dom';
import NextPayout from './pages/NextPayout';
import Transactions from './pages/Transaction';
import CommissionDashboard from './pages/Commission';
import SendPayout from './pages/Sendpayout';
import ContributorsPage from './pages/Contributor';

function App() {

  const navigate = useNavigate();
  const { logOut } = useContext(authContext);

  // ── Setup automatic logout interceptor ────────────────────────────────
  useEffect(() => {
    console.log("⚙️ Setting up logout interceptor...");
    setupLogoutInterceptor(navigate, logOut);
  }, [navigate, logOut]);

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landingpage />} /> 
        <Route path="/auth" element={<Authpage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/creategroup" element={<Createajogroup />} />
        <Route path="/all-ajo-groups" element={<AllAjoGroups />} />
        <Route path="/ajo-group-details/:groupId" element={<AjoGroupDetails />} />
        <Route path="*" element={<Notfoundpage />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="/payout" element={<NextPayout />} />
        <Route path="/transaction" element={<Transactions />} />
        <Route path="/commission" element={<CommissionDashboard />} />
        <Route path="/sendpayout" element={<SendPayout />} />
        <Route path="/contributor" element={<ContributorsPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;