// Mock data for all panels

export const mockConsultations = [
  { id: 1, doctor: 'Dr. Priya Sharma', specialty: 'General Physician', date: '2026-03-11', status: 'completed', symptoms: 'Fever, headache, body ache', village: 'Rampur', priority: 'moderate', patientName: 'Ramesh Kumar', age: 42 },
  { id: 2, doctor: 'Dr. Arjun Mehta', specialty: 'Pediatrician', date: '2026-03-12', status: 'pending', symptoms: 'Chest pain, difficulty breathing', village: 'Bhagalpur', priority: 'severe', patientName: 'Sunita Devi', age: 35 },
  { id: 3, doctor: 'Dr. Kavitha Nair', specialty: 'Dermatologist', date: '2026-03-10', status: 'completed', symptoms: 'Skin rash, itching', village: 'Chandpur', priority: 'mild', patientName: 'Mohan Lal', age: 28 },
  { id: 4, doctor: 'Dr. Priya Sharma', specialty: 'General Physician', date: '2026-03-12', status: 'pending', symptoms: 'Cold, runny nose, mild fever', village: 'Kota Gaon', priority: 'mild', patientName: 'Geeta Bai', age: 55 },
];

export const mockPrescriptions = [
  {
    id: 1, doctor: 'Dr. Priya Sharma', date: '2026-03-11', diagnosis: 'Viral Fever',
    medicines: [
      { name: 'Paracetamol 500mg', dosage: '1 tablet', frequency: 'Three times a day', duration: '5 days' },
      { name: 'Cetirizine 10mg', dosage: '1 tablet', frequency: 'Once at night', duration: '3 days' },
      { name: 'ORS Sachet', dosage: '1 sachet in 1L water', frequency: 'As needed', duration: '5 days' },
    ]
  },
  {
    id: 2, doctor: 'Dr. Kavitha Nair', date: '2026-03-10', diagnosis: 'Allergic Dermatitis',
    medicines: [
      { name: 'Hydrocortisone Cream 1%', dosage: 'Apply thin layer', frequency: 'Twice a day', duration: '7 days' },
      { name: 'Levocetirizine 5mg', dosage: '1 tablet', frequency: 'Once at night', duration: '5 days' },
    ]
  },
];

export const mockPharmacies = [
  { id: 1, name: 'Jan Aushadhi Kendra', distance: '0.8 km', address: 'Main Road, Rampur', phone: '9876543210', open: true, medicines: ['Paracetamol', 'Amoxicillin', 'ORS', 'Metformin'] },
  { id: 2, name: 'Shree Medical Store', distance: '1.2 km', address: 'Market Square, Rampur', phone: '9812345678', open: true, medicines: ['Paracetamol', 'Cetirizine', 'Azithromycin'] },
  { id: 3, name: 'Govt. PHC Pharmacy', distance: '2.1 km', address: 'PHC Campus, Sector 3', phone: '9898765432', open: false, medicines: ['Paracetamol', 'Iron tablets', 'ORS', 'Vitamins'] },
];

export const mockMedicines = [
  { id: 1, name: 'Paracetamol 500mg', stock: 450, expiry: '2027-06', price: 2.5, category: 'Analgesic', lowStock: false },
  { id: 2, name: 'Amoxicillin 250mg', stock: 12, expiry: '2026-03', price: 8.0, category: 'Antibiotic', lowStock: true }, // Expires soon
  { id: 3, name: 'ORS Sachet', stock: 200, expiry: '2027-12', price: 5.0, category: 'Rehydration', lowStock: false },
  { id: 4, name: 'Metformin 500mg', stock: 8, expiry: '2026-11', price: 6.5, category: 'Antidiabetic', lowStock: true },
  { id: 5, name: 'Azithromycin 500mg', stock: 95, expiry: '2027-03', price: 45.0, category: 'Antibiotic', lowStock: false },
  { id: 6, name: 'Cetirizine 10mg', stock: 5, expiry: '2026-04', price: 3.0, category: 'Antihistamine', lowStock: true }, // Expires soon
  { id: 7, name: 'Iron + Folic Acid', stock: 300, expiry: '2027-10', price: 4.0, category: 'Supplement', lowStock: false },
  { id: 8, name: 'Omeprazole 20mg', stock: 180, expiry: '2027-05', price: 7.5, category: 'Antacid', lowStock: false },
];

export const mockPatients = [
  { id: 'P001', name: 'Ramesh Kumar', age: 42, village: 'Rampur', phone: '9876543210', bloodGroup: 'B+', healthId: 'ABHA-123456' },
  { id: 'P002', name: 'Sunita Devi', age: 35, village: 'Bhagalpur', phone: '9812345678', bloodGroup: 'O+', healthId: 'ABHA-234567' },
  { id: 'P003', name: 'Mohan Lal', age: 28, village: 'Chandpur', phone: '9898765432', bloodGroup: 'A+', healthId: 'ABHA-345678' },
];

export const mockVitals = [
  { id: 1, patient: 'Ramesh Kumar', temperature: '99.2°F', bp: '130/85', pulse: 88, oxygen: 97, date: '2026-03-12', worker: 'Kavita ASW' },
  { id: 2, patient: 'Sunita Devi', temperature: '101.5°F', bp: '145/95', pulse: 102, oxygen: 94, date: '2026-03-12', worker: 'Kavita ASW' },
];

export const mockAdminStats = {
  totalVillages: 247,
  activeConsultations: 38,
  registeredWorkers: 124,
  registeredPharmacies: 89,
  dailyPatients: 156,
  weeklyTrend: [
    { day: 'Mon', patients: 120, consultations: 28 },
    { day: 'Tue', patients: 145, consultations: 35 },
    { day: 'Wed', patients: 132, consultations: 31 },
    { day: 'Thu', patients: 168, consultations: 42 },
    { day: 'Fri', patients: 156, consultations: 38 },
    { day: 'Sat', patients: 198, consultations: 52 },
    { day: 'Sun', patients: 89, consultations: 21 },
  ],
  diseaseData: [
    { name: 'Fever', count: 342, color: '#ef4444' },
    { name: 'Respiratory', count: 218, color: '#f97316' },
    { name: 'Diarrhea', count: 156, color: '#eab308' },
    { name: 'Skin', count: 98, color: '#22c55e' },
    { name: 'Diabetes', count: 87, color: '#6366f1' },
    { name: 'Hypertension', count: 76, color: '#8b5cf6' },
  ],
  outbreakAlerts: [
    { village: 'Rampur', disease: 'Dengue', cases: 12, status: 'alert', lat: 35, lng: 45 },
    { village: 'Bhagalpur', disease: 'Cholera', cases: 5, status: 'watch', lat: 55, lng: 65 },
    { village: 'Chandpur', disease: 'Malaria', cases: 8, status: 'alert', lat: 25, lng: 75 },
  ],
  villages: [
    { name: 'Rampur', x: 35, y: 45, status: 'alert', cases: 12 },
    { name: 'Bhagalpur', x: 55, y: 30, status: 'watch', cases: 5 },
    { name: 'Chandpur', x: 70, y: 55, status: 'alert', cases: 8 },
    { name: 'Kota Gaon', x: 20, y: 65, status: 'clear', cases: 0 },
    { name: 'Nandpur', x: 80, y: 40, status: 'clear', cases: 0 },
    { name: 'Devgaon', x: 45, y: 70, status: 'watch', cases: 3 },
  ],
};

export const mockPrescriptionRequests = [
  { id: 1, patient: 'Ramesh Kumar', doctor: 'Dr. Priya Sharma', date: '2026-03-12', medicines: ['Paracetamol 500mg x30', 'ORS Sachet x5'], status: 'pending', priority: 'moderate' },
  { id: 2, patient: 'Sunita Devi', doctor: 'Dr. Arjun Mehta', date: '2026-03-12', medicines: ['Amoxicillin 250mg x21', 'Cetirizine 10mg x10'], status: 'confirmed', priority: 'severe', isEmergency: true },
  { id: 3, patient: 'Mohan Lal', doctor: 'Dr. Kavitha Nair', date: '2026-03-12', medicines: ['Omeprazole 20mg x14'], status: 'ready', priority: 'mild' },
];
