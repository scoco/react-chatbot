import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import Home from './components/Home';
import Error404 from './components/Error404';
import ChatPage from './components/ChatPage';
import SettingsPage from './components/SettingsPage';
import GlobalLayout from './components/Layout';

const RoutesConfig = () => (
  <Router>
    <GlobalLayout>
      <Routes>
        <Route index element={<Home />} />
        <Route path="*" element={<Error404 />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/options" element={<SettingsPage />} />
      </Routes>
    </GlobalLayout>
  </Router>
);

export default RoutesConfig;
