import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

// Status values:
//   'approved'            – can log in normally
//   'pending_verification' – login blocked, show pending screen
//   'rejected'            – login blocked, show rejected message

// Admin users are NOT in the public registration list.
// They are pre-seeded here by the system owner.
let MOCK_USERS = [
  {
    id: 1, name: 'Ramesh Kumar', mobile: '9876543210', password: 'ramesh123',
    role: 'patient', village: 'Rampur', age: 42, gender: 'Male',
    status: 'approved',
  },
  {
    id: 2, name: 'Kavita Devi', mobile: '9812345678', password: 'kavita123',
    role: 'healthworker', village: 'Rampur', age: 30, gender: 'Female',
    govtId: 'ASHA-UP-001', status: 'approved',
  },
  {
    id: 3, name: 'Dr. Priya Sharma', mobile: '9898765432', password: 'doctor123',
    role: 'doctor', village: 'District Hospital', age: 35, gender: 'Female',
    mcRegistration: 'MCI-12345', specialization: 'General Physician',
    hospitalName: 'District Hospital Rampur', status: 'approved',
  },
  {
    id: 4, name: 'Jan Aushadhi Kendra', mobile: '9811111111', password: 'pharma123',
    role: 'pharmacy', village: 'Rampur', age: null, gender: null,
    ownerName: 'Suresh Gupta', drugLicense: 'DL-UP-2024-001',
    address: 'Main Road, Rampur', status: 'approved',
  },
  // System-seeded admin (not publicly registerable)
  {
    id: 5, name: 'System Admin', mobile: '9800000000', password: 'admin123',
    role: 'admin', village: 'HQ', age: null, gender: null, status: 'approved',
  },
  // Pending accounts for admin verification demo
  {
    id: 6, name: 'Dr. Rahul Verma', mobile: '9777777777', password: 'rahul123',
    role: 'doctor', village: 'Allahabad', age: 40, gender: 'Male',
    mcRegistration: 'MCI-99001', specialization: 'Pediatrics',
    hospitalName: 'City Clinic', status: 'pending_verification',
    submittedAt: '2026-03-11',
  },
  {
    id: 7, name: 'Meera ASHA Worker', mobile: '9666666666', password: 'meera123',
    role: 'healthworker', village: 'Lucknow', age: 28, gender: 'Female',
    govtId: 'ASHA-UP-099', status: 'pending_verification', submittedAt: '2026-03-10',
  },
  {
    id: 8, name: 'City Pharmacy', mobile: '9555555555', password: 'city123',
    role: 'pharmacy', village: 'Varanasi', age: null, gender: null,
    ownerName: 'Anil Mishra', drugLicense: 'DL-UP-2024-088',
    address: '45 MG Road, Varanasi', status: 'pending_verification', submittedAt: '2026-03-12',
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem('ss_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [authError, setAuthError] = useState('');

  // Login: mobile + password only (no role selector)
  const login = useCallback(async (mobile, password) => {
    setAuthError('');
    await new Promise(r => setTimeout(r, 700));

    const found = MOCK_USERS.find(u => u.mobile === mobile && u.password === password);

    if (!found) {
      setAuthError('Invalid mobile number or password. Please try again.');
      return { ok: false };
    }

    if (found.status === 'rejected') {
      setAuthError('Your registration has been rejected. Please contact support.');
      return { ok: false };
    }

    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    sessionStorage.setItem('ss_user', JSON.stringify(safeUser));
    return { ok: true, status: found.status, role: found.role };
  }, []);

  const register = useCallback(async (formData) => {
    setAuthError('');
    await new Promise(r => setTimeout(r, 900));

    const exists = MOCK_USERS.find(u => u.mobile === formData.mobile);
    if (exists) {
      setAuthError('This mobile number is already registered. Please login.');
      return false;
    }

    // Patients auto-approved; others pending
    const status = formData.role === 'patient' ? 'approved' : 'pending_verification';

    const newUser = {
      id: MOCK_USERS.length + 1,
      name: formData.fullName || formData.pharmacyName,
      mobile: formData.mobile,
      role: formData.role,
      village: formData.village || formData.address || '',
      age: formData.age ? parseInt(formData.age) : null,
      gender: formData.gender || null,
      status,
      submittedAt: new Date().toISOString().slice(0, 10),
      // role-specific extras
      ...(formData.govtId && { govtId: formData.govtId }),
      ...(formData.mcRegistration && { mcRegistration: formData.mcRegistration }),
      ...(formData.specialization && { specialization: formData.specialization }),
      ...(formData.hospitalName && { hospitalName: formData.hospitalName }),
      ...(formData.ownerName && { ownerName: formData.ownerName }),
      ...(formData.drugLicense && { drugLicense: formData.drugLicense }),
      ...(formData.address && { address: formData.address }),
    };

    MOCK_USERS.push({ ...newUser, password: formData.password });
    const { password: _, ...safeUser } = { ...newUser };
    setUser(safeUser);
    sessionStorage.setItem('ss_user', JSON.stringify(safeUser));
    return { ok: true, status };
  }, []);

  // Admin approval/rejection (mutates MOCK_USERS in memory)
  const approveUser = useCallback((userId) => {
    MOCK_USERS = MOCK_USERS.map(u =>
      u.id === userId ? { ...u, status: 'approved' } : u
    );
  }, []);

  const rejectUser = useCallback((userId) => {
    MOCK_USERS = MOCK_USERS.map(u =>
      u.id === userId ? { ...u, status: 'rejected' } : u
    );
  }, []);

  const getPendingUsers = useCallback(() =>
    MOCK_USERS.filter(u => u.status === 'pending_verification').map(({ password: _, ...u }) => u),
  []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('ss_user');
  }, []);

  return (
    <AuthContext.Provider value={{
      user, login, register, logout, authError, setAuthError,
      approveUser, rejectUser, getPendingUsers,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export const ROLE_HOME = {
  patient: '/patient/dashboard',
  healthworker: '/healthworker/dashboard',
  doctor: '/doctor/dashboard',
  pharmacy: '/pharmacy/dashboard',
  admin: '/admin/dashboard',
};
