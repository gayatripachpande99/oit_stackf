import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SharedLayout from './components/SharedLayout';

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceSoftware from './pages/ServiceSoftware';
import ServiceAnalytics from './pages/ServiceAnalytics';
import ServiceCampaign from './pages/ServiceCampaign';
import ServiceSurveys from './pages/ServiceSurveys';
import ServiceTraining from './pages/ServiceTraining';
import ServiceDetail from './pages/ServiceDetail';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Maharashtra from './pages/Maharashtra';
import Division from './pages/Division';
import District from './pages/District';
import ConstituencyDetails from './pages/ConstituencyDetails';
import VotersList from './pages/VotersList';
import DataEntry from './pages/DataEntry';
import SearchData from './pages/SearchData';
import AdityaKirana from './pages/AdityaKirana';
import OitService from './pages/OitService';
import ConstituencyLogin from './pages/ConstituencyLogin';
import CampaignDashboard from './pages/CampaignDashboard';

function App() {
  return (
    <Router>
      <SharedLayout>
        <Routes>
          {/* Main Landing & Contact */}
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />

          {/* Services routes */}
          <Route path="/services" element={<Services />} />
          <Route path="/services/software" element={<ServiceSoftware />} />
          <Route path="/services/analytics" element={<ServiceAnalytics />} />
          <Route path="/services/campaign" element={<ServiceCampaign />} />
          <Route path="/services/surveys" element={<ServiceSurveys />} />
          <Route path="/services/training" element={<ServiceTraining />} />
          <Route path="/services/detail" element={<ServiceDetail />} />
          <Route path="/services/:serviceId" element={<ServiceDetail />} />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Regional Analytics Hierarchy */}
          <Route path="/maharashtra" element={<Maharashtra />} />
          <Route path="/division/:divisionId" element={<Division />} />
          <Route path="/district/:districtId" element={<District />} />
          <Route path="/constituency/:id" element={<ConstituencyDetails />} />
          <Route path="/voters-list" element={<VotersList />} />

          {/* Special Districts Redirects */}
          <Route path="/nandurbar-district" element={<Navigate to="/district/nandurbar" replace />} />

          {/* CRUD portals */}
          <Route path="/data-entry" element={<DataEntry />} />
          <Route path="/search-data" element={<SearchData />} />

          {/* Special Dashboards and client pages */}
          <Route path="/aditya-kirana" element={<AdityaKirana />} />
          <Route path="/oit-services" element={<OitService />} />
          <Route path="/constituency-login/:dashboardId" element={<ConstituencyLogin />} />
          <Route path="/dashboard/:dashboardId" element={<CampaignDashboard />} />

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SharedLayout>
    </Router>
  );
}

export default App;
