import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { AuthProvider } from './contexts/AuthContext';
import NotificationToast from './components/NotificationToast';
import './App.css';

function App() {
  return (
    <WebSocketProvider>
      <Router>
        <AuthProvider>
          <div className="App">
            <Header />
            <NotificationToast />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/user" element={<UserDashboard />} />
              <Route path="/store-owner" element={<StoreOwnerDashboard />} />
            </Routes>
            <Footer />
          </div>
        </AuthProvider>
      </Router>
    </WebSocketProvider>
  );
}

export default App;