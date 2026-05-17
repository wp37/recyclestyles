import React, { useState, useEffect } from 'react';
import { adminLogin, adminLogout, isAdminLoggedIn, createLicenseKey, getAllLicenses, toggleLicense, deleteLicense, extendLicense, getPlanLabel } from '../services/licenseService';
import type { LicenseKey } from '../services/licenseService';
import { showToast } from '../components/Toast';

const AdminModule: React.FC = () => {
  const [authed, setAuthed] = useState(isAdminLoggedIn());
  const [pw, setPw] = useState('');
  const [licenses, setLicenses] = useState<LicenseKey[]>([]);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPlan, setNewPlan] = useState<LicenseKey['plan']>('monthly');
  const [newNote, setNewNote] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'expired' | 'disabled'>('all');
  const [search, setSearch] = useState('');

  const refresh = () => setLicenses(getAllLicenses());
  useEffect(() => { if (authed) refresh(); }, [authed]);

  const handleLogin = () => {
    if (adminLogin(pw)) { setAuthed(true); showToast('🔓 Đăng nhập Admin thành công!', 'success'); }
    else showToast('❌ Sai mật khẩu!', 'error');
    setPw('');
  };

  const handleCreate = () => {
    if (!newName.trim()) return showToast('Nhập tên user!');
    const lic = createLicenseKey(newName, newEmail, newPlan, newNote);
    showToast(`✅ Tạo key: ${lic.key}`, 'success');
    navigator.clipboard.writeText(lic.key);
    setNewName(''); setNewEmail(''); setNewNote('');
    refresh();
  };

  const handleToggle = (key: string) => { toggleLicense(key); refresh(); showToast('Đã đổi trạng thái!', 'info'); };
  const handleDelete = (key: string) => { if (confirm('Xóa license này?')) { deleteLicense(key); refresh(); showToast('Đã xóa!', 'info'); } };
  const handleExtend = (key: string, days: number) => { extendLicense(key, days); refresh(); showToast(`+${days} ngày!`, 'success'); };

  // Filter licenses
  const now = new Date();
  const filtered = licenses.filter(l => {
    if (filter === 'active') return l.isActive && new Date(l.expiresAt) > now;
    if (filter === 'expired') return new Date(l.expiresAt) <= now;
    if (filter === 'disabled') return !l.isActive;
    return true;
  }).filter(l => !search || l.key.includes(search.toUpperCase()) || l.userName.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase()));

  const stats = {
    total: licenses.length,
    active: licenses.filter(l => l.isActive && new Date(l.expiresAt) > now).length,
    expired: licenses.filter(l => new Date(l.expiresAt) <= now).length,
    disabled: licenses.filter(l => !l.isActive).length,
  };

  // === LOGIN SCREEN ===
  if (!authed) return (
    <div className="max-w-md mx-auto mt-20 animate-[slideIn_0.4s_ease-out]">
      <div className="bg-[#0f0f11] border border-white/10 rounded-2xl p-8 text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]">
        <div className="text-4xl mb-3">🔐</div>
        <h2 className="text-xl font-bold text-white mb-1">Admin Panel</h2>
        <p className="text-xs text-slate-500 mb-6">Nhập mật khẩu để quản lý license</p>
        <input type="password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()}
          placeholder="Mật khẩu Admin" className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm text-white text-center outline-none focus:border-red-500/50 mb-4" />
        <button onClick={handleLogin} className="w-full py-3 bg-red-900/50 hover:bg-red-800/50 border border-red-500/30 text-red-100 font-bold rounded-xl transition-all">
          <i className="fa-solid fa-right-to-bracket mr-2" />ĐĂNG NHẬP
        </button>
      </div>
    </div>
  );

  // === ADMIN DASHBOARD ===
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-[slideIn_0.4s_ease-out]">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div><h2 className="text-xl font-bold text-white flex items-center gap-2"><i className="fa-solid fa-shield-halved text-red-500" /> Admin — Quản Lý License</h2></div>
        <button onClick={() => { adminLogout(); setAuthed(false); }} className="text-xs px-3 py-1.5 bg-red-900/20 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-800/30">
          <i className="fa-solid fa-right-from-bracket mr-1" />Đăng xuất
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Tổng', value: stats.total, color: 'text-white', bg: 'border-white/10' },
          { label: 'Đang hoạt động', value: stats.active, color: 'text-green-400', bg: 'border-green-500/30' },
          { label: 'Hết hạn', value: stats.expired, color: 'text-amber-400', bg: 'border-amber-500/30' },
          { label: 'Vô hiệu hóa', value: stats.disabled, color: 'text-red-400', bg: 'border-red-500/30' },
        ].map(s => (
          <div key={s.label} className={`bg-[#0f0f11] border ${s.bg} rounded-xl p-4 text-center`}>
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-[10px] text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Create New License */}
      <div className="bg-[#0f0f11] border border-white/10 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><i className="fa-solid fa-plus-circle text-green-400" /> Tạo License Mới</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Tên khách hàng *" className="bg-black border border-white/10 rounded-lg p-3 text-sm text-white outline-none focus:border-green-500/50" />
          <input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Email / SĐT" className="bg-black border border-white/10 rounded-lg p-3 text-sm text-white outline-none focus:border-green-500/50" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <select value={newPlan} onChange={e => setNewPlan(e.target.value as any)} className="bg-black border border-white/10 rounded-lg p-3 text-sm text-white outline-none cursor-pointer">
            <option value="trial">🆓 Dùng thử (7 ngày)</option>
            <option value="monthly">💎 PRO Tháng (30 ngày)</option>
            <option value="yearly">👑 GOLD Năm (365 ngày)</option>
            <option value="lifetime">🏆 VIP Trọn đời</option>
          </select>
          <input value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Ghi chú (tùy chọn)" className="bg-black border border-white/10 rounded-lg p-3 text-sm text-white outline-none focus:border-green-500/50" />
        </div>
        <button onClick={handleCreate} className="w-full py-3 bg-green-900/40 hover:bg-green-800/40 border border-green-500/30 text-green-100 font-bold rounded-xl transition-all flex items-center justify-center gap-2">
          <i className="fa-solid fa-key" /> TẠO LICENSE KEY
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'active', 'expired', 'disabled'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`text-[10px] px-3 py-1.5 rounded-lg border font-bold transition-all ${filter === f ? 'bg-white/10 border-white/20 text-white' : 'border-white/5 text-slate-500 hover:text-white'}`}>
            {f === 'all' ? 'Tất cả' : f === 'active' ? '✅ Hoạt động' : f === 'expired' ? '⏰ Hết hạn' : '🚫 Vô hiệu'}
          </button>
        ))}
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Tìm key, tên, email..." className="flex-1 bg-black border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none min-w-[200px]" />
      </div>

      {/* License List */}
      <div className="space-y-2">
        {filtered.length === 0 && <div className="text-center text-slate-600 py-10 text-sm">Chưa có license nào</div>}
        {filtered.map(lic => {
          const info = getPlanLabel(lic.plan);
          const expired = new Date(lic.expiresAt) <= now;
          const days = Math.ceil((new Date(lic.expiresAt).getTime() - now.getTime()) / 86400000);
          return (
            <div key={lic.key} className={`bg-[#0f0f11] border rounded-xl p-4 transition-all ${!lic.isActive ? 'border-red-500/20 opacity-60' : expired ? 'border-amber-500/20' : 'border-white/10 hover:border-green-500/20'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <code className="text-sm font-bold text-white bg-black/50 px-2 py-0.5 rounded font-mono tracking-wider">{lic.key}</code>
                    <span className={`text-[10px] font-bold ${info.color}`}>{info.icon} {info.label}</span>
                    {!lic.isActive && <span className="text-[9px] bg-red-900/30 text-red-400 px-1.5 py-0.5 rounded font-bold">VÔ HIỆU</span>}
                    {expired && lic.isActive && <span className="text-[9px] bg-amber-900/30 text-amber-400 px-1.5 py-0.5 rounded font-bold">HẾT HẠN</span>}
                    {!expired && lic.isActive && <span className="text-[9px] bg-green-900/30 text-green-400 px-1.5 py-0.5 rounded font-bold">ACTIVE — {days} ngày</span>}
                  </div>
                  <div className="text-[10px] text-slate-500 flex gap-3 flex-wrap">
                    <span><i className="fa-solid fa-user mr-1" />{lic.userName}</span>
                    {lic.email && <span><i className="fa-solid fa-envelope mr-1" />{lic.email}</span>}
                    <span><i className="fa-solid fa-calendar mr-1" />{new Date(lic.createdAt).toLocaleDateString('vi-VN')}</span>
                    <span>→ {new Date(lic.expiresAt).toLocaleDateString('vi-VN')}</span>
                    {lic.note && <span className="text-slate-600 italic">({lic.note})</span>}
                  </div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button onClick={() => { navigator.clipboard.writeText(lic.key); showToast('Đã copy key!', 'success'); }} className="text-[10px] px-2 py-1 bg-slate-800 text-slate-300 rounded hover:bg-slate-700" title="Copy key"><i className="fa-solid fa-copy" /></button>
                  <button onClick={() => handleExtend(lic.key, 30)} className="text-[10px] px-2 py-1 bg-blue-900/30 text-blue-400 rounded hover:bg-blue-800/30 border border-blue-500/20" title="+30 ngày"><i className="fa-solid fa-plus mr-1" />30d</button>
                  <button onClick={() => handleToggle(lic.key)} className={`text-[10px] px-2 py-1 rounded border ${lic.isActive ? 'bg-amber-900/20 text-amber-400 border-amber-500/20' : 'bg-green-900/20 text-green-400 border-green-500/20'}`} title={lic.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}>
                    <i className={`fa-solid ${lic.isActive ? 'fa-ban' : 'fa-check'}`} />
                  </button>
                  <button onClick={() => handleDelete(lic.key)} className="text-[10px] px-2 py-1 bg-red-900/20 text-red-400 rounded hover:bg-red-800/30 border border-red-500/20" title="Xóa"><i className="fa-solid fa-trash" /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminModule;
