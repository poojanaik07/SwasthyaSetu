import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth, ROLE_HOME } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleLayout from './components/RoleLayout';
import { ConsultationProvider } from './context/ConsultationContext';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PendingVerification from './pages/auth/PendingVerification';

// Patient pages
import PatientDashboard from './pages/patient/PatientDashboard';
import ReportSymptoms from './pages/patient/ReportSymptoms';
import MyConsultations from './pages/patient/MyConsultations';
import Prescriptions from './pages/patient/Prescriptions';
import NearbyPharmacy from './pages/patient/NearbyPharmacy';
import HealthProfile from './pages/patient/HealthProfile';
import ConsultationDetails from './pages/patient/ConsultationDetails';

// Health Worker pages
import HWDashboard from './pages/healthworker/HWDashboard';
import RegisterPatient from './pages/healthworker/RegisterPatient';
import RecordVitals from './pages/healthworker/RecordVitals';
import ConsultationRequests from './pages/healthworker/ConsultationRequests';
import PatientList from './pages/healthworker/PatientList';
import HealthCamp from './pages/healthworker/HealthCamp';

// Doctor pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import IncomingConsultations from './pages/doctor/IncomingConsultations';
import DiagnosisForm from './pages/doctor/DiagnosisForm';

// Pharmacy pages
import PharmacyDashboard from './pages/pharmacy/PharmacyDashboard';
import MedicineInventory from './pages/pharmacy/MedicineInventory';
import PrescriptionRequests from './pages/pharmacy/PrescriptionRequests';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import DiseaseTrends from './pages/admin/DiseaseTrends';
import OutbreakAlerts from './pages/admin/OutbreakAlerts';
import UserVerification from './pages/admin/UserVerification';

import './index.css';

/** Wraps a page in the role layout + access guard */
function RolePage({ role, children }) {
  return (
    <ProtectedRoute allowedRole={role}>
      <RoleLayout>{children}</RoleLayout>
    </ProtectedRoute>
  );
}

/** Root: send logged-in users to their dashboard, otherwise to /login */
function RootRedirect() {
  const { user } = useAuth();
  if (user) {
    if (user.status === 'pending_verification') return <Navigate to="/pending-verification" replace />;
    return <Navigate to={ROLE_HOME[user.role]} replace />;
  }
  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <ConsultationProvider>
      <BrowserRouter>
        <Routes>
          {/* Root */}
          <Route path="/" element={<RootRedirect />} />

          {/* Public auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pending-verification" element={<PendingVerification />} />

          {/* ── Patient ── */}
          <Route path="/patient/dashboard" element={<RolePage role="patient"><PatientDashboard /></RolePage>} />
          <Route path="/patient/report-symptoms" element={<RolePage role="patient"><ReportSymptoms /></RolePage>} />
          <Route path="/patient/consultations" element={<RolePage role="patient"><MyConsultations /></RolePage>} />
          <Route path="/patient/prescriptions" element={<RolePage role="patient"><Prescriptions /></RolePage>} />
          <Route path="/patient/nearby-pharmacy" element={<RolePage role="patient"><NearbyPharmacy /></RolePage>} />
          <Route path="/patient/profile" element={<RolePage role="patient"><HealthProfile /></RolePage>} />
          <Route path="/patient/consultation-details/:id" element={<RolePage role="patient"><ConsultationDetails /></RolePage>} />

          {/* ── Health Worker ── */}
          <Route path="/healthworker/dashboard" element={<RolePage role="healthworker"><HWDashboard /></RolePage>} />
          <Route path="/healthworker/patients" element={<RolePage role="healthworker"><PatientList /></RolePage>} />
          <Route path="/healthworker/register-patient" element={<RolePage role="healthworker"><RegisterPatient /></RolePage>} />
          <Route path="/healthworker/record-vitals" element={<RolePage role="healthworker"><RecordVitals /></RolePage>} />
          <Route path="/healthworker/consultation-requests" element={<RolePage role="healthworker"><ConsultationRequests /></RolePage>} />
          <Route path="/healthworker/health-camp" element={<RolePage role="healthworker"><HealthCamp /></RolePage>} />

          {/* ── Doctor ── */}
          <Route path="/doctor/dashboard" element={<RolePage role="doctor"><DoctorDashboard /></RolePage>} />
          <Route path="/doctor/incoming-consultations" element={<RolePage role="doctor"><IncomingConsultations /></RolePage>} />
          <Route path="/doctor/diagnosis" element={<RolePage role="doctor"><DiagnosisForm /></RolePage>} />

          {/* ── Pharmacy ── */}
          <Route path="/pharmacy/dashboard" element={<RolePage role="pharmacy"><PharmacyDashboard /></RolePage>} />
          <Route path="/pharmacy/medicine-inventory" element={<RolePage role="pharmacy"><MedicineInventory /></RolePage>} />
          <Route path="/pharmacy/prescription-requests" element={<RolePage role="pharmacy"><PrescriptionRequests /></RolePage>} />

          {/* ── Admin ── */}
          <Route path="/admin/dashboard" element={<RolePage role="admin"><AdminDashboard /></RolePage>} />
          <Route path="/admin/disease-trends" element={<RolePage role="admin"><DiseaseTrends /></RolePage>} />
          <Route path="/admin/outbreak-alerts" element={<RolePage role="admin"><OutbreakAlerts /></RolePage>} />
          <Route path="/admin/user-verification" element={<RolePage role="admin"><UserVerification /></RolePage>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </ConsultationProvider>
    </AuthProvider>
  );
}
