import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VoiceInput from '../../components/VoiceInput';
import { analyzeSeverity } from '../../utils/symptomSeverity';
import { saveOffline } from '../../utils/offlineStorage';
import { useConsultations } from '../../context/ConsultationContext';
import { Send } from 'lucide-react';

const SYMPTOMS = [
  { id: 'fever',     emoji: '🌡️', label: 'Fever' },
  { id: 'cough',     emoji: '😮‍💨', label: 'Cough' },
  { id: 'headache',  emoji: '🤕', label: 'Headache' },
  { id: 'injury',    emoji: '🩹', label: 'Injury' },
  { id: 'vomiting',  emoji: '🤢', label: 'Vomiting' },
  { id: 'rash',      emoji: '🔴', label: 'Skin Rash' },
  { id: 'breathing', emoji: '😮', label: 'Breathing' },
  { id: 'weakness',  emoji: '😔', label: 'Weakness' },
  { id: 'chestpain', emoji: '💔', label: 'Chest Pain' },
  { id: 'diarrhea',  emoji: '🤧', label: 'Diarrhea' },
  { id: 'bodyache',  emoji: '🦴', label: 'Body Ache' },
  { id: 'stomach',   emoji: '🫄', label: 'Stomach Pain' },
];

// ── Rule-based AI guidance engine ────────────────────────────────────────────
function generateAIGuidance(selectedSymptoms, severity) {
  const s = selectedSymptoms;
  const isSevere   = severity === 'severe';
  const isModerate = severity === 'moderate';

  // High-risk combinations
  if (s.includes('chestpain') || s.includes('breathing')) {
    return {
      condition: 'Possible Cardiac / Respiratory Emergency',
      risk: 'High', color: '#ef4444', bg: '#fff7f7', border: '#fca5a5',
      emoji: '🚨',
      action: 'Seek emergency care IMMEDIATELY. Call 108 or go to the nearest hospital.',
      tips: ['Do not delay.', 'Sit upright and stay calm.', 'Call emergency: 108'],
      dotColor: '#ef4444',
    };
  }
  if ((s.includes('fever') && s.includes('breathing')) || (isSevere && s.includes('fever'))) {
    return {
      condition: 'Possible Severe Respiratory Infection',
      risk: 'High', color: '#ef4444', bg: '#fff7f7', border: '#fca5a5',
      emoji: '🔴',
      action: 'Consult a doctor URGENTLY within 2-4 hours.',
      tips: ['Monitor temperature every hour.', 'Keep hydrated.', 'Avoid crowded places.'],
      dotColor: '#ef4444',
    };
  }
  if (s.includes('fever') && s.includes('rash')) {
    return {
      condition: 'Possible Dengue / Viral Exanthem',
      risk: 'Moderate-High', color: '#f97316', bg: '#fff7ed', border: '#fed7aa',
      emoji: '🟠',
      action: 'Consult a doctor today. Get blood test done.',
      tips: ['Drink plenty of fluids.', 'Avoid Aspirin/Ibuprofen.', 'Rest and monitor rash.'],
      dotColor: '#f97316',
    };
  }

  // Moderate risk
  if (s.includes('fever') && (s.includes('headache') || s.includes('bodyache') || s.includes('vomiting'))) {
    return {
      condition: 'Viral Infection / Flu',
      risk: 'Moderate', color: '#eab308', bg: '#fefce8', border: '#fde68a',
      emoji: '🟡',
      action: 'Consult a doctor within 24 hours.',
      tips: ['Rest and stay hydrated.', 'Paracetamol for fever (as directed).', 'Avoid self-medication with antibiotics.'],
      dotColor: '#eab308',
    };
  }
  if (s.includes('vomiting') && s.includes('stomach')) {
    return {
      condition: 'Gastroenteritis / Food Poisoning',
      risk: 'Moderate', color: '#eab308', bg: '#fefce8', border: '#fde68a',
      emoji: '🟡',
      action: 'Stay hydrated with ORS. Consult doctor if worsening.',
      tips: ['Drink ORS every 15 mins.', 'Avoid solid food for 4-6 hours.', 'Seek care if blood in stool.'],
      dotColor: '#eab308',
    };
  }
  if (isModerate) {
    return {
      condition: 'General Health Concern',
      risk: 'Moderate', color: '#eab308', bg: '#fefce8', border: '#fde68a',
      emoji: '🟡',
      action: 'Consult a doctor within 24 hours for proper evaluation.',
      tips: ['Get adequate rest.', 'Stay hydrated.', 'Monitor your symptoms.'],
      dotColor: '#eab308',
    };
  }

  // Low risk
  if (s.includes('cough') || s.includes('headache') || s.includes('weakness')) {
    return {
      condition: 'Common Cold / Mild Viral',
      risk: 'Low', color: '#22c55e', bg: '#f0fdf4', border: '#86efac',
      emoji: '🟢',
      action: 'Rest and monitor. See a doctor if symptoms persist beyond 5 days.',
      tips: ['Drink warm fluids.', 'Get adequate sleep.', 'Honey + ginger tea helps.'],
      dotColor: '#22c55e',
    };
  }
  if (s.includes('rash')) {
    return {
      condition: 'Skin Irritation / Mild Allergy',
      risk: 'Low', color: '#22c55e', bg: '#f0fdf4', border: '#86efac',
      emoji: '🟢',
      action: 'Apply soothing lotion. Consult dermatologist if spreading.',
      tips: ['Avoid scratching.', 'Wear loose cotton clothes.', 'Keep skin moisturized.'],
      dotColor: '#22c55e',
    };
  }

  // Fallback
  return {
    condition: 'Health Concern Detected',
    risk: isSevere ? 'High' : isModerate ? 'Moderate' : 'Low',
    color: isSevere ? '#ef4444' : isModerate ? '#eab308' : '#22c55e',
    bg: isSevere ? '#fff7f7' : isModerate ? '#fefce8' : '#f0fdf4',
    border: isSevere ? '#fca5a5' : isModerate ? '#fde68a' : '#86efac',
    emoji: isSevere ? '🔴' : isModerate ? '🟡' : '🟢',
    action: isSevere ? 'Seek medical attention urgently.' : isModerate ? 'Consult a doctor within 24 hours.' : 'Monitor your symptoms. See a doctor if worsening.',
    tips: ['Rest and stay hydrated.', 'Avoid self-medication.'],
    dotColor: isSevere ? '#ef4444' : isModerate ? '#eab308' : '#22c55e',
  };
}

// ── Consultation status tracker ───────────────────────────────────────────────
const STATUS_STEPS = [
  { key: 'submitted', label: 'Request Submitted', emoji: '📤', done: true },
  { key: 'pending',   label: 'Pending Review', emoji: '⏳', done: true },
  { key: 'assigned',  label: 'Doctor Assigned', emoji: '👨‍⚕️', done: false },
  { key: 'completed', label: 'Consultation Completed', emoji: '✅', done: false },
];

function ConfirmationScreen({ consultationId, onReset }) {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: '5rem', marginBottom: '12px', animation: 'bounceIn 0.6s ease' }}>✅</div>
      <h2 style={{ fontWeight: 900, fontSize: '1.5rem', color: '#0f172a', marginBottom: '8px' }}>
        Consultation Request Sent!
      </h2>
      <p style={{ color: '#64748b', fontSize: '15px', lineHeight: 1.6, marginBottom: '28px' }}>
        Your consultation request has been sent successfully.<br />
        A doctor or health worker will review your case shortly.
      </p>

      {/* Status tracker */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', marginBottom: '24px', textAlign: 'left' }}>
        <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a', marginBottom: '16px' }}>📋 Request Status</div>
        {STATUS_STEPS.map((step, i) => (
          <div key={step.key} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: i < STATUS_STEPS.length - 1 ? '16px' : 0 }}>
            {/* Connector line */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: step.done ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
                {step.done ? '✓' : step.emoji}
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div style={{ width: '2px', height: '20px', background: step.done ? '#6366f1' : '#e2e8f0', margin: '3px 0' }} />
              )}
            </div>
            <div style={{ paddingTop: '6px' }}>
              <div style={{ fontWeight: 700, fontSize: '13px', color: step.done ? '#0f172a' : '#94a3b8' }}>{step.label}</div>
              {step.key === 'pending' && step.done && (
                <div style={{ fontSize: '11px', color: '#6366f1', fontWeight: 600, marginTop: '2px' }}>⏱ Estimated wait: 20-30 minutes</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Info box */}
      <div style={{ padding: '12px 16px', background: '#f0fdf4', borderRadius: '12px', fontSize: '13px', color: '#15803d', fontWeight: 600, marginBottom: '16px', textAlign: 'left' }}>
        📲 You will be notified as soon as a doctor reviews your case. Keep your phone with you.
      </div>

      {consultationId && (
        <div style={{ padding: '10px 16px', background: '#f0f4ff', borderRadius: '12px', fontSize: '12px', color: '#4338ca', fontWeight: 700, marginBottom: '16px', textAlign: 'center' }}>
          Your Request ID: <strong>#{consultationId}</strong> — save this for reference
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
        {consultationId && (
          <button className="btn btn-primary btn-lg" onClick={() => navigate(`/patient/consultation-details/${consultationId}`)}>
            📍 Track My Request
          </button>
        )}
        <button className="btn btn-ghost btn-lg" onClick={onReset}>
          + Report Another Symptom
        </button>
      </div>
    </div>
  );
}

export default function ReportSymptoms() {
  const { createConsultation } = useConsultations();
  const [consultationId, setConsultationId] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('');
  const [aiSeverity, setAiSeverity] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showGuidance, setShowGuidance] = useState(false);
  const fileRef = React.useRef();

  function toggleSymptom(id) {
    const next = selectedSymptoms.includes(id) ? selectedSymptoms.filter(s => s !== id) : [...selectedSymptoms, id];
    setSelectedSymptoms(next);
    // Recompute AI guidance when symptoms change
    if (next.length > 0 && severity) setShowGuidance(true);
  }

  function handleTextChange(e) {
    const val = e.target.value;
    setDescription(val);
    const result = analyzeSeverity(val);
    if (result) { setAiSeverity(result); setSeverity(result.level); }
  }

  function handleSeveritySelect(level) {
    setSeverity(level);
    if (selectedSymptoms.length > 0 || description) setShowGuidance(true);
  }

  function handleVoiceTranscript(text) { setDescription(text); }
  function handleVoiceSeverity(result) { setAiSeverity(result); setSeverity(result.level); }
  function handlePhotoChange(e) { const f = e.target.files?.[0]; if (f) setPhoto(f); }

  async function handleSubmit() {
    if (selectedSymptoms.length === 0 && !description) return;
    setSubmitting(true);
    const currentGuidance = (selectedSymptoms.length > 0 || description) && severity ? generateAIGuidance(selectedSymptoms, severity) : null;
    await saveOffline('symptom-report', { symptoms: selectedSymptoms, description, severity: severity || 'mild', photo: photo?.name });
    const id = createConsultation({ selectedSymptoms, description, severity: severity || 'mild', aiGuidance: currentGuidance ? { condition: currentGuidance.condition, risk: currentGuidance.risk } : null });
    await new Promise(r => setTimeout(r, 1200));
    setConsultationId(id);
    setSubmitted(true);
    setSubmitting(false);
  }

  if (submitted) return <ConfirmationScreen consultationId={consultationId} onReset={() => { setSubmitted(false); setConsultationId(null); setSelectedSymptoms([]); setDescription(''); setSeverity(''); setAiSeverity(null); setShowGuidance(false); setPhoto(null); }} />;

  // Compute AI guidance
  const guidance = (selectedSymptoms.length > 0 || description) && severity ? generateAIGuidance(selectedSymptoms, severity) : null;

  return (
    <div>
      <div className="page-header">
        <h2>🤒 Report Symptoms</h2>
        <p>Tell us how you're feeling. Use voice or text.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        <div>
          {/* Symptom Icons */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="card-header">
              <div className="card-title">Select Symptoms</div>
              {selectedSymptoms.length > 0 && <span className="badge badge-purple">{selectedSymptoms.length} selected</span>}
            </div>
            <div className="symptom-grid">
              {SYMPTOMS.map(s => (
                <button key={s.id} className={`symptom-btn ${selectedSymptoms.includes(s.id) ? 'selected' : ''}`} onClick={() => toggleSymptom(s.id)}>
                  <div className="symptom-btn-emoji">{s.emoji}</div>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Voice + Text */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="card-header"><div className="card-title">🎤 Voice or Text Description</div></div>
            <VoiceInput onTranscript={handleVoiceTranscript} onSeverityDetected={handleVoiceSeverity} />
            <div className="form-group">
              <label className="form-label">Describe your symptoms <span>*</span></label>
              <textarea className="form-textarea" placeholder="e.g., I have high fever since yesterday, body aches..." value={description} onChange={handleTextChange} rows={4} />
            </div>
          </div>

          {/* Existing AI severity (from text analysis) */}
          {aiSeverity && (
            <div className={`severity-alert ${aiSeverity.level}`} style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '24px' }}>{aiSeverity.emoji}</div>
              <div className="severity-alert-content">
                <div className="severity-alert-title">AI Detected: {aiSeverity.level.charAt(0).toUpperCase() + aiSeverity.level.slice(1)} ({aiSeverity.confidence}% confidence)</div>
                <div className="severity-alert-msg">{aiSeverity.message}</div>
                <div className="severity-keywords">
                  {aiSeverity.keywords.map((kw, i) => <span key={i} className="severity-keyword">{kw.word}</span>)}
                </div>
                <div className="confidence-bar" style={{ marginTop: '8px' }}>
                  <div className="confidence-fill" style={{ width: `${aiSeverity.confidence}%`, background: aiSeverity.color }} />
                </div>
              </div>
            </div>
          )}

          {/* ── AI GUIDANCE PANEL ────────────────────────────── */}
          {showGuidance && guidance && (
            <div style={{ marginBottom: '20px', border: `2px solid ${guidance.border}`, borderRadius: '16px', overflow: 'hidden', background: guidance.bg }}>
              {/* Header */}
              <div style={{ padding: '14px 18px', background: `${guidance.color}15`, borderBottom: `1px solid ${guidance.border}`, display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '28px' }}>{guidance.emoji}</span>
                <div>
                  <div style={{ fontWeight: 900, fontSize: '15px', color: '#0f172a' }}>🤖 AI Symptom Guidance</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Based on your selected symptoms and severity</div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <span style={{ padding: '4px 12px', borderRadius: '100px', background: guidance.color, color: '#fff', fontSize: '12px', fontWeight: 800 }}>
                    {guidance.risk} Risk
                  </span>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '16px 18px' }}>
                {/* Possible condition */}
                <div style={{ marginBottom: '14px', padding: '12px 14px', background: '#fff', borderRadius: '12px', border: `1px solid ${guidance.border}` }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Possible Condition</div>
                  <div style={{ fontWeight: 800, fontSize: '15px', color: '#0f172a' }}>🩺 {guidance.condition}</div>
                </div>

                {/* Risk level visual */}
                <div style={{ marginBottom: '14px', padding: '12px 14px', background: '#fff', borderRadius: '12px', border: `1px solid ${guidance.border}` }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Risk Level</div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {['Low', 'Moderate', 'High'].map(r => (
                      <div key={r} style={{ flex: 1, height: '8px', borderRadius: '4px', background: guidance.risk === r || (guidance.risk === 'Moderate-High' && (r === 'Moderate' || r === 'High')) ? guidance.color : '#e2e8f0', transition: 'all 300ms' }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>
                    <span>🟢 Low</span><span>🟡 Moderate</span><span>🔴 High</span>
                  </div>
                </div>

                {/* Suggested action */}
                <div style={{ marginBottom: '14px', padding: '12px 14px', background: '#fff', borderRadius: '12px', border: `1px solid ${guidance.border}` }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Suggested Action</div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: guidance.color }}>⚡ {guidance.action}</div>
                </div>

                {/* Tips */}
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>💡 Quick Tips:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {guidance.tips.map((tip, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#374151', padding: '6px 10px', background: '#fff', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                        <span style={{ color: guidance.color, flexShrink: 0 }}>✓</span> {tip}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: '12px', padding: '10px 12px', background: '#f8fafc', borderRadius: '10px', fontSize: '11px', color: '#64748b', textAlign: 'center' }}>
                  ⚠️ This is AI assistance only. Always consult a qualified doctor for medical advice.
                </div>
              </div>
            </div>
          )}

          {/* Photo Upload */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="card-header"><div className="card-title">📷 Upload Photo (Optional)</div></div>
            <div className={`upload-zone ${photo ? 'has-file' : ''}`} onClick={() => fileRef.current?.click()}>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
              <div className="upload-icon">{photo ? '✅' : '📸'}</div>
              <div className="upload-text">{photo ? photo.name : 'Tap to upload a photo of the affected area'}</div>
            </div>
          </div>

          <button className={`btn btn-lg btn-full ${submitting ? 'btn-ghost' : 'btn-danger'}`} onClick={handleSubmit} disabled={submitting}>
            {submitting ? <>⏳ Sending...</> : <><Send size={20} /> Send Consultation Request</>}
          </button>
        </div>

        {/* Sidebar */}
        <div>
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="card-header"><div className="card-title">⚠️ How Severe?</div></div>
            <div className="severity-group" style={{ flexDirection: 'column' }}>
              {[
                { id: 'mild',     label: '🟢 Mild',     sub: 'Slight discomfort' },
                { id: 'moderate', label: '🟡 Moderate', sub: 'Affecting daily life' },
                { id: 'severe',   label: '🔴 Severe',   sub: 'Needs urgent care' },
              ].map(s => (
                <button key={s.id} className={`severity-btn ${s.id} ${severity === s.id ? 'selected' : ''}`} onClick={() => handleSeveritySelect(s.id)}>
                  <div><div style={{ fontWeight: 700 }}>{s.label}</div><div style={{ fontSize: '11px', opacity: 0.7 }}>{s.sub}</div></div>
                </button>
              ))}
            </div>
            {severity && (
              <div style={{ marginTop: '8px', padding: '8px 12px', background: severity === 'severe' ? '#fee2e2' : severity === 'moderate' ? '#fef9c3' : '#dcfce7', borderRadius: '10px', fontSize: '12px', fontWeight: 600, color: severity === 'severe' ? '#b91c1c' : severity === 'moderate' ? '#a16207' : '#15803d', textAlign: 'center' }}>
                {severity === 'severe' ? '🚨 Priority routing to doctor' : severity === 'moderate' ? '⚡ Expedited consultation' : '📋 Scheduled review'}
              </div>
            )}
            {/* Show guidance button */}
            {(selectedSymptoms.length > 0 || description) && severity && (
              <button onClick={() => setShowGuidance(!showGuidance)} className="btn btn-ghost" style={{ width: '100%', marginTop: '10px', fontSize: '13px' }}>
                {showGuidance ? '🙈 Hide AI Guidance' : '🤖 Show AI Guidance'}
              </button>
            )}
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: '12px' }}>🆘 Emergency Signs</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {["Chest pain / pressure", "Can't breathe", "Fainting / unconscious", "Severe bleeding", "Convulsions / seizure"].map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', color: '#b91c1c', fontWeight: 600 }}>
                  <span>🔴</span> {s}
                </div>
              ))}
            </div>
            <div style={{ marginTop: '12px', padding: '10px', background: '#fee2e2', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#b91c1c' }}>Emergency Helpline</div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#ef4444', letterSpacing: '-0.02em' }}>108</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
