import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, FileText, CheckSquare, LogOut, Upload, CreditCard, 
  Briefcase, HelpCircle, FolderOpen, Download, User, 
  ChevronRight, Save, ArrowLeft, Clock, Shield, Trash2, Loader2, CheckCircle, Menu, X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

// --- SUB-COMPONENTS ---
const StatusBadge = ({ status }) => {
  const styles = {
    'New': 'bg-blue-100 text-blue-700',
    'In Progress': 'bg-purple-100 text-purple-700',
    'Review': 'bg-amber-100 text-amber-700',
    'Completed': 'bg-emerald-100 text-emerald-700',
  };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${styles[status] || 'bg-slate-100'}`}>{status}</span>;
};

// --- PROJECT WORKSPACE (THE FULL WORKFLOW) ---
const ProjectWorkspace = ({ project, onBack }) => {
  const [step, setStep] = useState(1); 
  
  // FORM STATE - FULL CHECKLIST
  const [formData, setFormData] = useState({
    // A. Basic Details
    companyType: 'Private Limited',
    nameOption1: '', nameOption2: '', nameOption3: '',
    activity: '', nicCode: '', state: '', city: '',
    
    // B. Capital
    authCapital: '100000', paidCapital: '100000', shares: '10000', faceValue: '10',
    shareholdingPattern: '',

    // C. Directors (Dynamic Array)
    directors: [{ id: 1, name: '', fatherName: '', dob: '', gender: '', nationality: '', resStatus: 'Resident', occupation: '', pan: '', aadhaar: '', din: '', mobile: '', email: '' }],

    // E. Registered Office
    address1: '', address2: '', officeCity: '', officeState: '', pin: '', premisesType: 'Rented',

    // F. Statutory
    gstRequired: 'Yes', gstType: 'Regular', shopsEst: 'No', bankPref: ''
  });

  const [uploads, setUploads] = useState({}); 
  const [uploading, setUploading] = useState(null); 

  // --- LOGIC: DIRECTOR MANAGEMENT ---
  const handleDirectorChange = (id, field, value) => {
    const updated = formData.directors.map(d => d.id === id ? { ...d, [field]: value } : d);
    setFormData({ ...formData, directors: updated });
  };

  const addDirector = () => {
    const newId = formData.directors.length + 1;
    setFormData({ ...formData, directors: [...formData.directors, { id: newId, name: '', fatherName: '', dob: '', gender: '', nationality: '', resStatus: 'Resident', occupation: '', pan: '', aadhaar: '', din: '', mobile: '', email: '' }] });
  };

  const removeDirector = (id) => {
    if (formData.directors.length === 1) return; 
    setFormData({ ...formData, directors: formData.directors.filter(d => d.id !== id) });
  };

  // --- LOGIC: FILE UPLOAD ---
  const handleFileUpload = async (event, docName) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploading(docName); 
    const data = new FormData();
    data.append('file', file);

    try {
      const res = await fetch('http://localhost:5001/api/upload', { method: 'POST', body: data });
      const response = await res.json();
      if (response.success) {
        setUploads(prev => ({ ...prev, [docName]: response.filePath }));
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading file");
    } finally {
      setUploading(null);
    }
  };

  // MOCK DELIVERABLES
  const deliverables = [
    { name: 'Certificate of Incorporation (COI)', status: 'Pending' },
    { name: 'PAN Allotment Letter', status: 'Pending' },
    { name: 'TAN Allotment Letter', status: 'Pending' },
    { name: 'MoA & AoA', status: 'Pending' },
    { name: 'DIN Allocation', status: 'Pending' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full animate-in slide-in-from-right">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full transition"><ArrowLeft size={20} className="text-slate-500"/></button>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-800">{project.title}</h2>
            <p className="text-xs text-slate-500">Service Workflow</p>
          </div>
        </div>
        {/* Steps */}
        <div className="flex bg-slate-200 p-1 rounded-lg w-full md:w-auto overflow-x-auto">
           {[1, 2, 3].map(i => (
             <button key={i} onClick={() => setStep(i)} className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${step === i ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                {i}. {i === 1 ? 'Data' : i === 2 ? 'Uploads' : 'Deliverables'}
             </button>
           ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50">
        {/* STEP 1: FULL DATA ENTRY FORM */}
        {step === 1 && (
          <div className="space-y-6 max-w-5xl mx-auto">
             
             {/* A. Basic Details */}
             <div className="checklist-section">
                <h4 className="checklist-title">A. Company Basic Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input className="input-field" placeholder="Name Option 1 (Preferred)" value={formData.nameOption1} onChange={e => setFormData({...formData, nameOption1: e.target.value})} />
                      <input className="input-field" placeholder="Name Option 2" value={formData.nameOption2} onChange={e => setFormData({...formData, nameOption2: e.target.value})} />
                      <input className="input-field" placeholder="Name Option 3" value={formData.nameOption3} onChange={e => setFormData({...formData, nameOption3: e.target.value})} />
                   </div>
                   <input className="input-field md:col-span-2" placeholder="Main Business Activity" value={formData.activity} onChange={e => setFormData({...formData, activity: e.target.value})} />
                   <input className="input-field" placeholder="NIC Code" value={formData.nicCode} onChange={e => setFormData({...formData, nicCode: e.target.value})} />
                   <input className="input-field" placeholder="State" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                   <input className="input-field" placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                </div>
             </div>

             {/* B. Capital */}
             <div className="checklist-section">
                <h4 className="checklist-title">B. Capital & Shareholding</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   <div className="col-span-2 md:col-span-1"><label className="label">Auth Capital (₹)</label><input className="input-field" value={formData.authCapital} onChange={e => setFormData({...formData, authCapital: e.target.value})} /></div>
                   <div className="col-span-2 md:col-span-1"><label className="label">Paid-up Capital (₹)</label><input className="input-field" value={formData.paidCapital} onChange={e => setFormData({...formData, paidCapital: e.target.value})} /></div>
                   <div className="col-span-2 md:col-span-1"><label className="label">No. of Shares</label><input className="input-field" value={formData.shares} onChange={e => setFormData({...formData, shares: e.target.value})} /></div>
                   <div className="col-span-2 md:col-span-1"><label className="label">Face Value (₹)</label><input className="input-field" value={formData.faceValue} onChange={e => setFormData({...formData, faceValue: e.target.value})} /></div>
                   <div className="col-span-2 md:col-span-4"><label className="label">Shareholding Pattern (%)</label><input className="input-field" placeholder="e.g. Director 1: 50%, Director 2: 50%" value={formData.shareholdingPattern} onChange={e => setFormData({...formData, shareholdingPattern: e.target.value})} /></div>
                </div>
             </div>

             {/* C. Directors */}
             <div className="checklist-section">
                <h4 className="checklist-title">C. Director Details</h4>
                <div className="space-y-6">
                   {formData.directors.map((director, index) => (
                       <div key={director.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 relative">
                          <div className="flex justify-between items-center mb-4">
                              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Director #{index + 1}</p>
                              {formData.directors.length > 1 && <button onClick={() => removeDirector(director.id)} className="text-rose-500"><Trash2 size={16}/></button>}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <input className="input-field" placeholder="Full Name" value={director.name} onChange={e => handleDirectorChange(director.id, 'name', e.target.value)} />
                             <input className="input-field" placeholder="Father's Name" value={director.fatherName} onChange={e => handleDirectorChange(director.id, 'fatherName', e.target.value)} />
                             <input className="input-field" type="date" value={director.dob} onChange={e => handleDirectorChange(director.id, 'dob', e.target.value)} />
                             <select className="input-field" value={director.gender} onChange={e => handleDirectorChange(director.id, 'gender', e.target.value)}>
                                <option value="">Gender</option><option>Male</option><option>Female</option>
                             </select>
                             <input className="input-field" placeholder="Nationality" value={director.nationality} onChange={e => handleDirectorChange(director.id, 'nationality', e.target.value)} />
                             <input className="input-field" placeholder="PAN" value={director.pan} onChange={e => handleDirectorChange(director.id, 'pan', e.target.value)} />
                             <input className="input-field" placeholder="Aadhaar" value={director.aadhaar} onChange={e => handleDirectorChange(director.id, 'aadhaar', e.target.value)} />
                             <input className="input-field" placeholder="Mobile" value={director.mobile} onChange={e => handleDirectorChange(director.id, 'mobile', e.target.value)} />
                             <input className="input-field" placeholder="Email" value={director.email} onChange={e => handleDirectorChange(director.id, 'email', e.target.value)} />
                          </div>
                       </div>
                   ))}
                   <button onClick={addDirector} className="w-full py-3 border-2 border-dashed border-indigo-200 text-indigo-600 rounded-lg font-bold hover:bg-indigo-50 transition flex items-center justify-center">
                       <User size={16} className="mr-2"/> Add Another Director
                   </button>
                </div>
             </div>

             {/* E. Registered Office */}
             <div className="checklist-section">
                <h4 className="checklist-title">E. Registered Office</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <input className="input-field md:col-span-2" placeholder="Address Line 1" value={formData.address1} onChange={e => setFormData({...formData, address1: e.target.value})} />
                   <input className="input-field md:col-span-2" placeholder="Address Line 2" value={formData.address2} onChange={e => setFormData({...formData, address2: e.target.value})} />
                   <input className="input-field" placeholder="City" value={formData.officeCity} onChange={e => setFormData({...formData, officeCity: e.target.value})} />
                   <input className="input-field" placeholder="PIN Code" value={formData.pin} onChange={e => setFormData({...formData, pin: e.target.value})} />
                   <select className="input-field" value={formData.premisesType} onChange={e => setFormData({...formData, premisesType: e.target.value})}>
                      <option>Rented</option><option>Owned</option><option>Leased</option>
                   </select>
                </div>
             </div>

             {/* F. Statutory */}
             <div className="checklist-section">
                <h4 className="checklist-title">F. Statutory & Optional</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div>
                       <label className="label">GST Reg Required?</label>
                       <select className="input-field" value={formData.gstRequired} onChange={e => setFormData({...formData, gstRequired: e.target.value})}><option>Yes</option><option>No</option></select>
                   </div>
                   {formData.gstRequired === 'Yes' && (
                       <div>
                           <label className="label">Nature of GST</label>
                           <select className="input-field" value={formData.gstType} onChange={e => setFormData({...formData, gstType: e.target.value})}><option>Regular</option><option>Composition</option></select>
                       </div>
                   )}
                   <div>
                       <label className="label">Shops & Est. Reg?</label>
                       <select className="input-field" value={formData.shopsEst} onChange={e => setFormData({...formData, shopsEst: e.target.value})}><option>Yes</option><option>No</option></select>
                   </div>
                </div>
             </div>

             <div className="flex justify-end pt-4 pb-10">
                <button onClick={() => setStep(2)} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex items-center justify-center">Next: Uploads <ChevronRight size={18} className="ml-2"/></button>
             </div>
          </div>
        )}

        {/* STEP 2: UPLOADS */}
        {step === 2 && (
           <div className="space-y-6 max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* A. Director Docs */}
                 <div className="checklist-section">
                    <h4 className="checklist-title">A. Director Documents</h4>
                    <div className="space-y-3">
                       {['PAN Card', 'Aadhaar / Voter ID', 'Address Proof', 'Bank Statement', 'Photo'].map((doc, i) => (
                          <div key={i} className="upload-row">
                             <div className="flex-1">
                                <p className="text-sm font-medium text-slate-700">{doc}</p>
                                {uploads[doc] && <a href={`http://localhost:5001${uploads[doc]}`} target="_blank" className="text-[10px] text-emerald-600 font-bold flex items-center mt-1"><CheckCircle size={10} className="mr-1"/> View File</a>}
                             </div>
                             <div className="relative">
                                 <input type="file" id={`file-A-${i}`} className="hidden" onChange={(e) => handleFileUpload(e, doc)}/>
                                 <label htmlFor={`file-A-${i}`} className={`upload-btn ${uploads[doc] ? 'uploaded' : ''}`}>
                                     {uploading === doc ? <Loader2 size={14} className="animate-spin"/> : uploads[doc] ? <CheckCircle size={14}/> : <Upload size={14}/>}
                                     <span className="ml-2 hidden md:inline">{uploading === doc ? '...' : uploads[doc] ? 'Done' : 'Upload'}</span>
                                 </label>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>

                 {/* B. Office Docs */}
                 <div className="checklist-section">
                    <h4 className="checklist-title">B. Office Documents</h4>
                    <div className="space-y-3">
                       {['Sale Deed / Rent Agreement', 'NOC', 'Utility Bill'].map((doc, i) => (
                          <div key={i} className="upload-row">
                             <div className="flex-1">
                                <p className="text-sm font-medium text-slate-700">{doc}</p>
                                {uploads[doc] && <a href={`http://localhost:5001${uploads[doc]}`} target="_blank" className="text-[10px] text-emerald-600 font-bold flex items-center mt-1"><CheckCircle size={10} className="mr-1"/> View File</a>}
                             </div>
                             <div className="relative">
                                 <input type="file" id={`file-B-${i}`} className="hidden" onChange={(e) => handleFileUpload(e, doc)}/>
                                 <label htmlFor={`file-B-${i}`} className={`upload-btn ${uploads[doc] ? 'uploaded' : ''}`}>
                                     {uploading === doc ? <Loader2 size={14} className="animate-spin"/> : uploads[doc] ? <CheckCircle size={14}/> : <Upload size={14}/>}
                                     <span className="ml-2 hidden md:inline">{uploading === doc ? '...' : uploads[doc] ? 'Done' : 'Upload'}</span>
                                 </label>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
              <div className="flex justify-between pt-4 pb-10">
                <button onClick={() => setStep(1)} className="text-slate-500 font-bold hover:text-slate-800">Back</button>
                <button onClick={() => setStep(3)} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex items-center justify-center">Submit <ChevronRight size={18} className="ml-2"/></button>
             </div>
           </div>
        )}

        {/* STEP 3: DELIVERABLES */}
        {step === 3 && (
           <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl flex items-start">
                 <Shield className="text-indigo-600 mt-1 mr-4 shrink-0" />
                 <div>
                    <h3 className="font-bold text-indigo-900">Submitted for Review</h3>
                    <p className="text-sm text-indigo-700 mt-1">Our team is verifying your details.</p>
                 </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                 <div className="p-4 bg-slate-50 border-b border-slate-200"><h3 className="font-bold text-slate-700">Deliverables</h3></div>
                 <div className="divide-y divide-slate-100">
                    {deliverables.map((item, i) => (
                       <div key={i} className="p-4 flex justify-between items-center">
                          <span className="font-medium text-slate-700 text-sm">{item.name}</span>
                          <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded font-bold flex items-center"><Clock size={12} className="mr-1"/> Pending</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        )}
      </div>

      <style>{`
        .checklist-section { background: white; padding: 1.5rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        .checklist-title { font-size: 0.875rem; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 1rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.5rem; }
        .input-field { width: 100%; padding: 0.75rem; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.5rem; outline: none; transition: all; font-size: 0.875rem; color: #1e293b; }
        .input-field:focus { border-color: #6366f1; background-color: white; box-shadow: 0 0 0 2px #e0e7ff; }
        .label { display: block; font-size: 0.75rem; font-weight: 700; color: #94a3b8; margin-bottom: 0.25rem; }
        .upload-row { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.5rem; }
        .upload-btn { cursor: pointer; display: flex; align-items: center; padding: 0.5rem 1rem; font-size: 0.75rem; font-weight: 700; border-radius: 0.375rem; transition: all; background: white; border: 1px solid #cbd5e1; color: #475569; }
        .upload-btn:hover { background: #f1f5f9; color: #6366f1; border-color: #c7d2fe; }
        .upload-btn.uploaded { background: #d1fae5; color: #047857; border-color: #6ee7b7; }
      `}</style>
    </div>
  );
};

// --- MAIN DASHBOARD SHELL ---
export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedProject, setSelectedProject] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [clientData, setClientData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const email = location.state?.email || 'doraswamyraju.ca@gmail.com'; 
        const res = await fetch(`http://localhost:5001/api/client-dashboard/${email}`);
        const data = await res.json();
        if (res.ok) { setClientData(data.user); setProjects(data.projects); }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchData();
  }, [location.state]);

  if (loading) return <div className="flex h-screen items-center justify-center text-slate-500">Loading...</div>;

  const menuItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Projects', label: 'My Projects', icon: CheckSquare },
    { id: 'Documents', label: 'Documents', icon: FileText },
    { id: 'Invoices', label: 'Invoices', icon: CreditCard },
    { id: 'Support', label: 'Support', icon: HelpCircle },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden relative">
      <Sidebar 
        title="Client Portal"
        menuItems={menuItems}
        activeTab={activeTab}
        setActiveTab={(tab) => { setActiveTab(tab); setSelectedProject(null); }}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <main className="flex-1 flex flex-col h-full overflow-hidden w-full">
         <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
            <div className="flex items-center gap-3">
                <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"><Menu size={24}/></button>
                <h1 className="text-lg lg:text-xl font-bold truncate max-w-[200px] lg:max-w-none">{selectedProject ? 'Workflow' : activeTab}</h1>
            </div>
            <div className="flex items-center gap-3">
               <div className="text-right hidden md:block"><p className="text-sm font-bold text-slate-700">{clientData?.name}</p><p className="text-xs text-slate-500">{clientData?.role}</p></div>
               <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">{clientData?.name?.charAt(0)}</div>
            </div>
         </header>

         <div className="flex-1 overflow-y-auto p-4 lg:p-8">
            {selectedProject ? (
               <ProjectWorkspace project={selectedProject} onBack={() => setSelectedProject(null)} />
            ) : (
               <div className="space-y-6 animate-in fade-in">
                  <div className="bg-indigo-600 rounded-2xl p-6 lg:p-8 text-white shadow-lg">
                      <h1 className="text-2xl lg:text-3xl font-bold mb-2">Welcome, {clientData?.name}</h1>
                      <p className="text-indigo-100 opacity-90 text-sm lg:text-base">Track your applications and upload documents securely.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                     {projects.map(proj => (
                        <div key={proj._id} className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow">
                           <div>
                               <h4 className="font-bold text-lg text-slate-800">{proj.title}</h4>
                               <p className="text-sm text-slate-500 mt-1 flex items-center"><Clock size={14} className="mr-1"/> Started: {new Date(proj.createdAt).toLocaleDateString()}</p>
                           </div>
                           <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                               <StatusBadge status={proj.status}/>
                               <button onClick={() => setSelectedProject(proj)} className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm shadow hover:bg-indigo-700 transition">Open Checklist</button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}
         </div>
      </main>
    </div>
  );
}