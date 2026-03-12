import React, { createContext, useContext, useState, useCallback } from 'react';

// ── Status configuration ─────────────────────────────────────────────────────
export const CONSULTATION_STATUSES = [
  { key: 'submitted',         label: 'Submitted',              emoji: '📤', color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
  { key: 'hw_reviewing',      label: 'Health Worker Reviewing', emoji: '👩‍⚕️', color: '#eab308', bg: '#fefce8', border: '#fde68a' },
  { key: 'doctor_assigned',   label: 'Doctor Assigned',         emoji: '👨‍⚕️', color: '#f97316', bg: '#fff7ed', border: '#fed7aa' },
  { key: 'in_progress',       label: 'Consultation in Progress',emoji: '🩺', color: '#8b5cf6', bg: '#f5f3ff', border: '#c4b5fd' },
  { key: 'prescription',      label: 'Prescription Provided',   emoji: '💊', color: '#0ea5e9', bg: '#f0f9ff', border: '#bae6fd' },
  { key: 'completed',         label: 'Completed',               emoji: '✅', color: '#22c55e', bg: '#f0fdf4', border: '#86efac' },
];

export function getStatusConfig(key) {
  return CONSULTATION_STATUSES.find(s => s.key === key) || CONSULTATION_STATUSES[0];
}

// ── Mock consultation records (seeded with realistic data) ───────────────────
const MOCK_CONSULTATIONS = [
  {
    id: 'C001',
    symptoms: ['fever', 'headache', 'bodyache'],
    symptomsText: 'High fever since yesterday, body aches, and mild headache',
    severity: 'moderate',
    status: 'completed',
    submittedAt: '2026-03-11 09:15 AM',
    assignedDoctor: 'Dr. Priya Sharma',
    doctorSpecialty: 'General Physician',
    doctorNotes: 'Patient presents with viral fever. Advised rest and increased fluid intake.',
    prescription: { id: 1, diagnosis: 'Viral Fever', medicines: ['Paracetamol 500mg', 'Cetirizine 10mg', 'ORS Sachet'] },
    updates: [
      { status: 'submitted',       time: '2026-03-11 09:15 AM', note: 'Consultation request submitted' },
      { status: 'hw_reviewing',    time: '2026-03-11 09:30 AM', note: 'Kavita ASHA Worker is reviewing your request' },
      { status: 'doctor_assigned', time: '2026-03-11 10:00 AM', note: 'Dr. Priya Sharma has been assigned to your consultation' },
      { status: 'in_progress',     time: '2026-03-11 10:30 AM', note: 'Consultation started via SwasthyaSetu connect' },
      { status: 'prescription',    time: '2026-03-11 11:00 AM', note: 'Prescription uploaded: Paracetamol, Cetirizine, ORS' },
      { status: 'completed',       time: '2026-03-11 11:15 AM', note: 'Consultation marked complete. Get well soon!' },
    ],
    aiGuidance: { condition: 'Viral Infection / Flu', risk: 'Moderate' },
  },
  {
    id: 'C002',
    symptoms: ['breathing', 'chestpain'],
    symptomsText: 'Difficulty breathing and mild chest tightness after exertion',
    severity: 'severe',
    status: 'doctor_assigned',
    submittedAt: '2026-03-12 11:00 AM',
    assignedDoctor: 'Dr. Arjun Mehta',
    doctorSpecialty: 'General Physician',
    doctorNotes: null,
    prescription: null,
    updates: [
      { status: 'submitted',       time: '2026-03-12 11:00 AM', note: 'Consultation request submitted — marked URGENT' },
      { status: 'hw_reviewing',    time: '2026-03-12 11:05 AM', note: 'Request escalated to doctor due to severity' },
      { status: 'doctor_assigned', time: '2026-03-12 11:10 AM', note: 'Dr. Arjun Mehta has been assigned to your consultation' },
    ],
    aiGuidance: { condition: 'Possible Cardiac / Respiratory Emergency', risk: 'High' },
  },
  {
    id: 'C003',
    symptoms: ['rash', 'vomiting'],
    symptomsText: 'Skin rash spreading on arms, mild itching and nausea',
    severity: 'mild',
    status: 'hw_reviewing',
    submittedAt: '2026-03-12 02:30 PM',
    assignedDoctor: null,
    doctorSpecialty: null,
    doctorNotes: null,
    prescription: null,
    updates: [
      { status: 'submitted',    time: '2026-03-12 02:30 PM', note: 'Consultation request submitted' },
      { status: 'hw_reviewing', time: '2026-03-12 02:45 PM', note: 'Your request is being reviewed by health worker team' },
    ],
    aiGuidance: { condition: 'Dengue / Viral Exanthem', risk: 'Moderate-High' },
  },
  {
    id: 'C004',
    symptoms: ['cough', 'weakness'],
    symptomsText: 'Persistent cough and body weakness since 3 days',
    severity: 'mild',
    status: 'submitted',
    submittedAt: '2026-03-12 04:10 PM',
    assignedDoctor: null,
    doctorSpecialty: null,
    doctorNotes: null,
    prescription: null,
    updates: [
      { status: 'submitted', time: '2026-03-12 04:10 PM', note: 'Consultation request submitted successfully' },
    ],
    aiGuidance: { condition: 'Common Cold / Mild Viral', risk: 'Low' },
  },
];

// ── Dashboard notification feed ──────────────────────────────────────────────
export function buildNotifications(consultations) {
  const notes = [];
  consultations.forEach(c => {
    const latest = c.updates[c.updates.length - 1];
    const statusCfg = getStatusConfig(latest.status);
    notes.push({
      id: `${c.id}-${latest.status}`,
      consultationId: c.id,
      emoji: statusCfg.emoji,
      type: latest.status === 'completed' ? 'success' : latest.status === 'submitted' ? 'info' : 'warning',
      text: latest.note,
      time: latest.time,
      status: latest.status,
    });
  });
  return notes.sort((a, b) => b.time.localeCompare(a.time)).slice(0, 5);
}

// ── Context ──────────────────────────────────────────────────────────────────
const ConsultationContext = createContext(null);

export function ConsultationProvider({ children }) {
  const [consultations, setConsultations] = useState(MOCK_CONSULTATIONS);

  /** Create a new consultation request from the Report Symptoms page */
  const createConsultation = useCallback((data) => {
    const id = `C${String(Date.now()).slice(-4)}`;
    const now = new Date().toLocaleString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
    const record = {
      id,
      symptoms: data.selectedSymptoms || [],
      symptomsText: data.description || data.selectedSymptoms?.join(', ') || 'Not described',
      severity: data.severity || 'mild',
      status: 'submitted',
      submittedAt: now,
      assignedDoctor: null,
      doctorNotes: null,
      prescription: null,
      updates: [{ status: 'submitted', time: now, note: 'Consultation request submitted successfully' }],
      aiGuidance: data.aiGuidance || null,
    };
    setConsultations(prev => [record, ...prev]);
    return id;
  }, []);

  /** Cancel a consultation (only for submitted / hw_reviewing stages) */
  const cancelConsultation = useCallback((id) => {
    setConsultations(prev => prev.filter(c => c.id !== id));
  }, []);

  const getById = useCallback((id) => consultations.find(c => c.id === id), [consultations]);

  return (
    <ConsultationContext.Provider value={{ consultations, createConsultation, cancelConsultation, getById }}>
      {children}
    </ConsultationContext.Provider>
  );
}

export function useConsultations() {
  const ctx = useContext(ConsultationContext);
  if (!ctx) throw new Error('useConsultations must be used inside ConsultationProvider');
  return ctx;
}
