import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { supabase } from './utils/supabase';
import './App.css';

// --- 1. หน้า Login ---
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert('เข้าสู่ระบบไม่สำเร็จ: ' + error.message);
    else navigate('/');
    setLoading(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-sm border-0 p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 className="text-center text-pastel-green mb-4 fw-bold">🌿 เข้าสู่ระบบ</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">อีเมล</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="form-label">รหัสผ่าน</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-pastel w-100 mb-3" disabled={loading}>
            {loading ? 'กำลังโหลด...' : 'เข้าสู่ระบบ'}
          </button>
          <div className="text-center">
            <span className="text-muted">ยังไม่มีบัญชี? </span>
            <Link to="/register" className="text-success text-decoration-none fw-bold">สมัครสมาชิก</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- 2. หน้า สมัครสมาชิก (Register) ---
const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert('สมัครสมาชิกไม่สำเร็จ: ' + error.message);
    } else {
      alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
      navigate('/login');
    }
    setLoading(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-sm border-0 p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 className="text-center text-pastel-green mb-4 fw-bold">🌿 สมัครสมาชิก</h3>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">อีเมล</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="form-label">รหัสผ่าน (ขั้นต่ำ 6 ตัว)</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="6" />
          </div>
          <button type="submit" className="btn btn-pastel w-100 mb-3" disabled={loading}>
            {loading ? 'กำลังโหลด...' : 'ยืนยันการสมัคร'}
          </button>
          <div className="text-center">
            <span className="text-muted">มีบัญชีอยู่แล้ว? </span>
            <Link to="/login" className="text-success text-decoration-none fw-bold">เข้าสู่ระบบ</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- 3. คอมโพเนนต์ Sidebar (เพิ่มปุ่ม Logout) ---
const Sidebar = ({ onLogout }) => {
  const location = useLocation();
  return (
    <nav className="col-md-3 col-lg-2 d-md-block sidebar collapse px-0">
      <div className="position-sticky pt-4 px-3 d-flex flex-column h-100">
        <div>
          <h5 className="text-pastel-green mb-4 fw-bold text-center mt-2">
            <span className="me-2 fs-4">🌿</span>สวนทุเรียน
          </h5>
          <hr className="text-muted opacity-25" />
          <ul className="nav flex-column mt-3">
            <li className="nav-item">
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                💧 บันทึกการให้น้ำ
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/history" className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}>
                🕒 ประวัติทั้งหมด
              </Link>
            </li>
          </ul>
        </div>
        <div className="mt-auto mb-4 px-2">
          <button onClick={onLogout} className="btn btn-sm btn-outline-danger w-100 rounded-pill">
            🚪 ออกจากระบบ
          </button>
        </div>
      </div>
    </nav>
  );
};

// --- 4. หน้า Dashboard (หน้าหลัก) ---
const Dashboard = ({ zones, logs, fetchLogs, reports, reportPeriod, setReportPeriod, editingId, setEditingId, formData, setFormData }) => {
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = {
      water_date: formData.water_date,
      water_time: formData.water_time.length === 5 ? formData.water_time + ':00' : formData.water_time,
      duration_minutes: parseInt(formData.duration_minutes, 10),
      zone_id: parseInt(formData.zone_id, 10),
      water_volume_liters: formData.water_volume_liters ? parseFloat(formData.water_volume_liters) : null,
      temperature_celsius: formData.temperature_celsius ? parseFloat(formData.temperature_celsius) : null,
      weather_condition: formData.weather_condition || null,
      user_id: 1 
    };

    if (editingId) {
      await supabase.from('water_logs').update(dataToSubmit).eq('log_id', editingId);
      alert('อัปเดตข้อมูลเรียบร้อย!');
      setEditingId(null);
    } else {
      await supabase.from('water_logs').insert([dataToSubmit]);
      alert('บันทึกข้อมูลเรียบร้อย!');
    }

    setFormData({ water_date: '', water_time: '', duration_minutes: '', zone_id: '', water_volume_liters: '', weather_condition: '', temperature_celsius: '' });
    fetchLogs();
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ water_date: '', water_time: '', duration_minutes: '', zone_id: '', water_volume_liters: '', weather_condition: '', temperature_celsius: '' });
  };

  return (
    <div className="row">
      <div className="col-lg-8 mb-4">
        <div className="card">
          <div className="card-header py-3">
            <h5 className="card-title mb-0 text-pastel-green fw-bold">
              {editingId ? '✏️ แก้ไขข้อมูลการให้น้ำ' : '💧 บันทึกการให้น้ำ'}
            </h5>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label className="form-label">วันที่</label>
                  <input type="date" name="water_date" className="form-control" value={formData.water_date} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">เวลา</label>
                  <input type="time" name="water_time" className="form-control" value={formData.water_time} onChange={handleChange} required />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label className="form-label">ระยะเวลา (นาที)</label>
                  <input type="number" name="duration_minutes" className="form-control" value={formData.duration_minutes} onChange={handleChange} required min="1" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">แปลง / โซน</label>
                  <select name="zone_id" className="form-select" value={formData.zone_id} onChange={handleChange} required>
                    <option value="">-- เลือกแปลง --</option>
                    {zones.map(z => <option key={z.zone_id} value={z.zone_id}>{z.zone_name}</option>)}
                  </select>
                </div>
              </div>
              <div className="row mb-4">
                <div className="col-md-4 mb-3 mb-md-0">
                  <label className="form-label">ปริมาณน้ำ (ลิตร)</label>
                  <input type="number" step="0.01" name="water_volume_liters" className="form-control" value={formData.water_volume_liters} onChange={handleChange} />
                </div>
                <div className="col-md-4 mb-3 mb-md-0">
                  <label className="form-label">อุณหภูมิ (°C)</label>
                  <input type="number" step="0.1" name="temperature_celsius" className="form-control" value={formData.temperature_celsius} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">สภาพอากาศ</label>
                  <input type="text" name="weather_condition" className="form-control" placeholder="เช่น แดดจัด" value={formData.weather_condition} onChange={handleChange} />
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-pastel w-100">
                  {editingId ? 'บันทึกการแก้ไข' : 'บันทึกข้อมูล'}
                </button>
                {editingId && (
                  <button type="button" className="btn btn-light w-100" onClick={handleCancel}>ยกเลิก</button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="col-lg-4 mb-4">
        <div className="card h-100">
          <div className="card-header py-3">
            <h5 className="card-title mb-0 fw-bold text-pastel-green">📊 สรุปรายงาน</h5>
          </div>
          <div className="card-body p-4">
            <select className="form-select mb-4" value={reportPeriod} onChange={(e) => setReportPeriod(e.target.value)}>
              <option value="weekly">รายสัปดาห์</option>
              <option value="monthly">รายเดือน</option>
              <option value="yearly">รายปี</option>
            </select>
            <ul className="list-group list-group-flush">
              {reports.length > 0 ? reports.map((r, idx) => (
                <li key={idx} className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                  <span className="text-secondary">{r.period}</span>
                  <span className="badge bg-pastel-green rounded-pill px-3 py-2 fs-6">{r.total_minutes} นาที</span>
                </li>
              )) : <li className="list-group-item text-center text-muted border-0 bg-transparent">ไม่มีข้อมูล</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 5. หน้า History (ตารางประวัติ) ---
const History = ({ logs, fetchLogs, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (log_id) => {
    if (window.confirm('ยืนยันการลบข้อมูลนี้?')) {
      await supabase.from('water_logs').delete().eq('log_id', log_id);
      fetchLogs();
    }
  };

  const filteredLogs = logs.filter(log => {
    const zoneName = log.zones?.zone_name || '';
    return zoneName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="card">
      <div className="card-header py-3 d-flex justify-content-between align-items-center flex-wrap gap-3">
        <h5 className="card-title mb-0 fw-bold text-pastel-green">🕒 ประวัติการให้น้ำทั้งหมด</h5>
        <input type="text" className="form-control w-auto" placeholder="🔍 ค้นหาชื่อแปลง..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-pastel table-hover align-middle mb-0 text-center">
            <thead>
              <tr>
                <th className="ps-4 text-start">วันที่</th>
                <th>เวลา</th>
                <th>แปลง</th>
                <th>ระยะเวลา</th>
                <th>ปริมาณน้ำ</th>
                <th className="text-end pe-4">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.log_id}>
                  <td className="ps-4 text-start">{log.water_date}</td>
                  <td>{log.water_time.substring(0, 5)}</td>
                  <td>{log.zones?.zone_name}</td>
                  <td>{log.duration_minutes} นาที</td>
                  <td>{log.water_volume_liters ? `${log.water_volume_liters} ลิตร` : '-'}</td>
                  <td className="text-end pe-4">
                    <button className="btn btn-sm btn-pastel-warning me-2 px-3" onClick={() => onEdit(log)}>แก้</button>
                    <button className="btn btn-sm btn-pastel-danger px-3" onClick={() => handleDelete(log.log_id)}>ลบ</button>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && <tr><td colSpan="6" className="text-center text-muted py-5">ไม่พบข้อมูล</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- 6. คอมโพเนนต์หลักที่จัดการ Auth และ Routing ---
function AppContent() {
  const [session, setSession] = useState(null); // ตัวแปรเก็บสถานะล็อกอิน
  const [loadingSession, setLoadingSession] = useState(true);

  const [logs, setLogs] = useState([]);
  const [zones, setZones] = useState([]);
  const [reports, setReports] = useState([]);
  const [reportPeriod, setReportPeriod] = useState('monthly');
  
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    water_date: '', water_time: '', duration_minutes: '', zone_id: '',
    water_volume_liters: '', weather_condition: '', temperature_celsius: ''
  });

  const navigate = useNavigate();

  // เช็คสถานะการล็อกอินตอนเปิดเว็บ
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingSession(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchZones();
      fetchLogs();
    }
  }, [session]);

  useEffect(() => {
    generateReports(logs, reportPeriod);
  }, [logs, reportPeriod]);

  const fetchZones = async () => {
    const { data } = await supabase.from('zones').select('*');
    if (data) setZones(data);
  };

  const fetchLogs = async () => {
    const { data } = await supabase.from('water_logs').select('*, zones(zone_name)').order('water_date', { ascending: false });
    if (data) setLogs(data);
  };

  const handleEditRequest = (log) => {
    setEditingId(log.log_id);
    setFormData({
      water_date: log.water_date,
      water_time: log.water_time.substring(0, 5),
      duration_minutes: log.duration_minutes,
      zone_id: log.zone_id,
      water_volume_liters: log.water_volume_liters || '',
      weather_condition: log.weather_condition || '',
      temperature_celsius: log.temperature_celsius || ''
    });
    navigate('/'); 
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const getWeekNumber = (dateString) => {
    const d = new Date(dateString);
    d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return `${d.getFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
  };

  const generateReports = (dataLogs, period) => {
    if (!dataLogs.length) return setReports([]);
    const grouped = dataLogs.reduce((acc, log) => {
      let key = period === 'yearly' ? log.water_date.substring(0, 4) : period === 'monthly' ? log.water_date.substring(0, 7) : getWeekNumber(log.water_date);
      acc[key] = (acc[key] || 0) + log.duration_minutes;
      return acc;
    }, {});
    const reportArray = Object.keys(grouped).map(key => ({ period: key, total_minutes: grouped[key] })).sort((a, b) => b.period.localeCompare(a.period));
    setReports(reportArray);
  };

  if (loadingSession) {
    return <div className="d-flex justify-content-center align-items-center vh-100">กำลังโหลด...</div>;
  }

  return (
    <Routes>
      {/* Route ที่ไม่ต้องล็อกอิน */}
      <Route path="/login" element={!session ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!session ? <Register /> : <Navigate to="/" />} />

      {/* Route ที่ต้องล็อกอิน (Protected Routes) */}
      <Route path="/*" element={
        session ? (
          <div className="container-fluid overflow-hidden">
            <div className="row">
              <Sidebar onLogout={handleLogout} />
              <main className="col-md-9 ms-sm-auto col-lg-10 px-md-5 py-5" style={{ minHeight: '100vh', overflowY: 'auto' }}>
                <Routes>
                  <Route path="/" element={<Dashboard zones={zones} logs={logs} fetchLogs={fetchLogs} reports={reports} reportPeriod={reportPeriod} setReportPeriod={setReportPeriod} editingId={editingId} setEditingId={setEditingId} formData={formData} setFormData={setFormData} />} />
                  <Route path="/history" element={<History logs={logs} fetchLogs={fetchLogs} onEdit={handleEditRequest} />} />
                </Routes>
              </main>
            </div>
          </div>
        ) : (
          <Navigate to="/login" />
        )
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;