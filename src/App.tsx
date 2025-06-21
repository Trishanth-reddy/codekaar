import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { DataProvider } from './contexts/DataContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import AIAssistant from './pages/AIAssistant';
import ImageAnalysis from './pages/ImageAnalysis';
import Weather from './pages/Weather';
import Markets from './pages/Markets';
import Schemes from './pages/Schemes';
import Finance from './pages/Finance';
import Forum from './pages/Forum';
import Profile from './pages/Profile';
import PlantCareGuides from './pages/PlantCareGuides';
import GardenJournal from './pages/GardenJournal';
import WateringSchedules from './pages/WateringSchedules';
import ProduceMarketplace from './pages/ProduceMarketplace';
import './index.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!user.onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }
  
  if (user && user.onboardingComplete) {
    return <Navigate to="/" replace />;
  }
  
  if (user && !user.onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <DataProvider>
            <div className="App">
              <Routes>
                <Route path="/login" element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } />
                <Route path="/signup" element={
                  <PublicRoute>
                    <Signup />
                  </PublicRoute>
                } />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Dashboard />} />
                  <Route path="assistant" element={<AIAssistant />} />
                  <Route path="analysis" element={<ImageAnalysis />} />
                  <Route path="weather" element={<Weather />} />
                  <Route path="markets" element={<Markets />} />
                  <Route path="schemes" element={<Schemes />} />
                  <Route path="finance" element={<Finance />} />
                  <Route path="forum" element={<Forum />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="plant-care" element={<PlantCareGuides />} />
                  <Route path="garden-journal" element={<GardenJournal />} />
                  <Route path="watering-schedules" element={<WateringSchedules />} />
                  <Route path="produce-marketplace" element={<ProduceMarketplace />} />
                </Route>
              </Routes>
            </div>
          </DataProvider>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;