import React, { useState, useEffect, useCallback } from 'react';
import { adminLogin, adminLogout, isAdminLoggedIn, createLicenseKey, getAllLicenses, toggleLicense, deleteLicense, extendLicense, getPlanLabel } from '../services/licenseService';
import type { LicenseKey } from '../services/licenseService';
import { showToast } from '../components/Toast';

interface AdminModuleProps {
  standalone?: boolean; // When accessed via /admin URL directly
}

const AdminModule: React.FC<AdminModuleProps> = ({ standalone = false }) => {
  const [authed, setAuthed] = useState(isAdminLoggedIn());
  const [pw, setPw] = useState('');
  const [licenses, setLicenses] = useState<LicenseKey[]>([]);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPlan, setNewPlan] = useState<LicenseKey['plan']>('yearly');
  const [newNote, setNewNote] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'expired' | 'disabled'>('all');
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [quickKey, setQuickKey] = useState('');
  const [activeView, setActiveView] = useState<'dashboard' | 'users' | 'create'>('dashboard');

  const refresh = useCallback(() => setLicenses(getAllLicenses()), []);
  useEffect(() => { if (authed) refresh(); }, [authed, refresh]);

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
    setShowCreate(false);
    setActiveView('users');
    refresh();
  };

  const handleToggle = (key: string) => { toggleLicense(key); refresh(); showToast('Đã đổi trạng thái!', 'info'); };
  const handleDelete = (key: string) => { if (confirm('Xóa license này?')) { deleteLicense(key); refresh(); showToast('Đã xóa!', 'info'); } };
  const handleExtend = (key: string, days: number) => { extendLicense(key, days); refresh(); showToast(`+${days} ngày!`, 'success'); };

  // Quick activate by key
  const handleQuickActivate = () => {
    if (!quickKey.trim()) return;
    const db = getAllLicenses();
    const found = db.find(l => l.key === quickKey.trim().toUpperCase());
    if (found) {
      if (!found.isActive) {
        toggleLicense(found.key);
        refresh();
        showToast(`✅ Đã kích hoạt: ${found.userName}`, 'success');
      } else {
        showToast(`ℹ️ Key đã active: ${found.userName}`, 'info');
      }
    } else {
      showToast('❌ Không tìm thấy key!', 'error');
    }
    setQuickKey('');
  };

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
    trial: licenses.filter(l => l.plan === 'trial').length,
    yearly: licenses.filter(l => l.plan === 'yearly').length,
    lifetime: licenses.filter(l => l.plan === 'lifetime').length,
  };

  const wrapperClass = standalone
    ? 'admin-standalone min-h-screen bg-[#050a08]'
    : '';

  // === LOGIN SCREEN ===
  if (!authed) return (
    <div className={wrapperClass}>
      <div className="admin-login-screen">
        <div className="admin-login-card">
          {/* Animated background */}
          <div className="admin-login-bg" />

          <div className="admin-login-content">
            <div className="admin-login-logo">
              <div className="admin-login-icon">
                <i className="fa-solid fa-shield-halved" />
              </div>
              <h1>ADMIN PANEL</h1>
              <p>TUAI Recycle Styles Master</p>
            </div>

            <div className="admin-login-form">
              <div className="admin-input-group">
                <i className="fa-solid fa-lock" />
                <input
                  type="password"
                  value={pw}
                  onChange={e => setPw(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="Mật khẩu Admin"
                  autoFocus
                />
              </div>
              <button onClick={handleLogin} className="admin-login-btn">
                <i className="fa-solid fa-right-to-bracket" />
                <span>ĐĂNG NHẬP</span>
              </button>
            </div>

            <div className="admin-login-footer">
              <i className="fa-solid fa-mobile-screen" />
              <span>Tối ưu cho thiết bị di động</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // === ADMIN DASHBOARD ===
  return (
    <div className={wrapperClass}>
      <div className="admin-dashboard">
        {/* Top Bar */}
        <div className="admin-topbar">
          <div className="admin-topbar-left">
            <div className="admin-topbar-icon">
              <i className="fa-solid fa-shield-halved" />
            </div>
            <div>
              <h1>Admin Panel</h1>
              <p>Quản lý License & Users</p>
            </div>
          </div>
          <button onClick={() => { adminLogout(); setAuthed(false); }} className="admin-logout-btn">
            <i className="fa-solid fa-right-from-bracket" />
          </button>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="admin-mobile-nav">
          {([
            { id: 'dashboard' as const, icon: 'fa-solid fa-chart-pie', label: 'Tổng Quan' },
            { id: 'users' as const, icon: 'fa-solid fa-users', label: 'Users' },
            { id: 'create' as const, icon: 'fa-solid fa-plus-circle', label: 'Tạo Key' },
          ]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`admin-nav-tab ${activeView === tab.id ? 'active' : ''}`}
            >
              <i className={tab.icon} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* === DASHBOARD VIEW === */}
        <div style={{ display: activeView === 'dashboard' ? 'block' : 'none' }}>
          {/* Quick Activate */}
          <div className="admin-quick-section">
            <div className="admin-quick-header">
              <i className="fa-solid fa-bolt" />
              <span>KÍCH HOẠT NHANH</span>
            </div>
            <div className="admin-quick-form">
              <input
                value={quickKey}
                onChange={e => setQuickKey(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && handleQuickActivate()}
                placeholder="Nhập key để kích hoạt..."
                className="admin-quick-input"
              />
              <button onClick={handleQuickActivate} className="admin-quick-btn">
                <i className="fa-solid fa-bolt" />
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="admin-stats-grid">
            <div className="admin-stat-card stat-total">
              <div className="stat-icon"><i className="fa-solid fa-database" /></div>
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Tổng License</div>
            </div>
            <div className="admin-stat-card stat-active">
              <div className="stat-icon"><i className="fa-solid fa-circle-check" /></div>
              <div className="stat-value">{stats.active}</div>
              <div className="stat-label">Đang Hoạt Động</div>
            </div>
            <div className="admin-stat-card stat-expired">
              <div className="stat-icon"><i className="fa-solid fa-clock" /></div>
              <div className="stat-value">{stats.expired}</div>
              <div className="stat-label">Hết Hạn</div>
            </div>
            <div className="admin-stat-card stat-disabled">
              <div className="stat-icon"><i className="fa-solid fa-ban" /></div>
              <div className="stat-value">{stats.disabled}</div>
              <div className="stat-label">Vô Hiệu</div>
            </div>
          </div>

          {/* Plan Breakdown */}
          <div className="admin-plan-breakdown">
            <h3><i className="fa-solid fa-tags" /> Phân Bổ Gói</h3>
            <div className="admin-plan-bars">
              {[
                { label: '🆓 Trial', count: stats.trial, color: '#64748b', total: stats.total },
                { label: '👑 Yearly', count: stats.yearly, color: '#f59e0b', total: stats.total },
                { label: '🏆 Lifetime', count: stats.lifetime, color: '#a855f7', total: stats.total },
              ].map(p => (
                <div key={p.label} className="admin-plan-bar-row">
                  <div className="plan-bar-label">
                    <span>{p.label}</span>
                    <span className="plan-bar-count">{p.count}</span>
                  </div>
                  <div className="plan-bar-track">
                    <div
                      className="plan-bar-fill"
                      style={{
                        width: `${p.total > 0 ? (p.count / p.total) * 100 : 0}%`,
                        background: p.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="admin-recent">
            <h3><i className="fa-solid fa-clock-rotate-left" /> Gần Đây</h3>
            <div className="admin-recent-list">
              {licenses.slice(-5).reverse().map(lic => {
                const info = getPlanLabel(lic.plan);
                return (
                  <div key={lic.key} className="admin-recent-item">
                    <div className="recent-avatar" style={{ background: info.color.includes('amber') ? '#f59e0b22' : info.color.includes('purple') ? '#a855f722' : '#64748b22' }}>
                      {info.icon}
                    </div>
                    <div className="recent-info">
                      <div className="recent-name">{lic.userName}</div>
                      <div className="recent-meta">
                        <span className={info.color}>{info.label}</span>
                        <span>• {new Date(lic.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => { navigator.clipboard.writeText(lic.key); showToast('📋 Đã copy key!', 'success'); }}
                      className="recent-copy"
                    >
                      <i className="fa-solid fa-copy" />
                    </button>
                  </div>
                );
              })}
              {licenses.length === 0 && (
                <div className="admin-empty">
                  <i className="fa-solid fa-inbox" />
                  <p>Chưa có license nào</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* === USERS VIEW === */}
        <div style={{ display: activeView === 'users' ? 'block' : 'none' }}>
          {/* Search & Filter */}
          <div className="admin-filter-section">
            <div className="admin-search-bar">
              <i className="fa-solid fa-magnifying-glass" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm key, tên, email..."
              />
              {search && (
                <button onClick={() => setSearch('')} className="search-clear">
                  <i className="fa-solid fa-xmark" />
                </button>
              )}
            </div>
            <div className="admin-filter-chips">
              {([
                { id: 'all' as const, label: 'Tất cả', count: stats.total },
                { id: 'active' as const, label: 'Active', count: stats.active },
                { id: 'expired' as const, label: 'Hết hạn', count: stats.expired },
                { id: 'disabled' as const, label: 'Vô hiệu', count: stats.disabled },
              ]).map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`admin-filter-chip ${filter === f.id ? 'active' : ''}`}
                >
                  <span>{f.label}</span>
                  <span className="chip-count">{f.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* License Cards */}
          <div className="admin-license-list">
            {filtered.length === 0 && (
              <div className="admin-empty">
                <i className="fa-solid fa-search" />
                <p>Không tìm thấy license</p>
              </div>
            )}
            {filtered.map(lic => {
              const info = getPlanLabel(lic.plan);
              const expired = new Date(lic.expiresAt) <= now;
              const days = Math.ceil((new Date(lic.expiresAt).getTime() - now.getTime()) / 86400000);
              const isExpanded = expandedKey === lic.key;
              const statusClass = !lic.isActive ? 'disabled' : expired ? 'expired' : 'active';

              return (
                <div
                  key={lic.key}
                  className={`admin-license-card ${statusClass} ${isExpanded ? 'expanded' : ''}`}
                  onClick={() => setExpandedKey(isExpanded ? null : lic.key)}
                >
                  {/* Main Row */}
                  <div className="license-card-header">
                    <div className="license-card-avatar">
                      <span>{info.icon}</span>
                    </div>
                    <div className="license-card-info">
                      <div className="license-card-name">{lic.userName}</div>
                      <div className="license-card-key">
                        <code>{lic.key}</code>
                      </div>
                    </div>
                    <div className="license-card-status">
                      {!lic.isActive && <span className="status-badge badge-disabled">VÔ HIỆU</span>}
                      {expired && lic.isActive && <span className="status-badge badge-expired">HẾT HẠN</span>}
                      {!expired && lic.isActive && <span className="status-badge badge-active">{days}d</span>}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="license-card-details" onClick={e => e.stopPropagation()}>
                      <div className="license-detail-grid">
                        <div className="license-detail-item">
                          <i className="fa-solid fa-tag" />
                          <span className={info.color}>{info.label}</span>
                        </div>
                        {lic.email && (
                          <div className="license-detail-item">
                            <i className="fa-solid fa-envelope" />
                            <span>{lic.email}</span>
                          </div>
                        )}
                        <div className="license-detail-item">
                          <i className="fa-solid fa-calendar-plus" />
                          <span>{new Date(lic.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="license-detail-item">
                          <i className="fa-solid fa-calendar-xmark" />
                          <span>{new Date(lic.expiresAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        {lic.note && (
                          <div className="license-detail-item full-width">
                            <i className="fa-solid fa-note-sticky" />
                            <span className="detail-note">{lic.note}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="license-card-actions">
                        <button
                          onClick={() => { navigator.clipboard.writeText(lic.key); showToast('📋 Đã copy!', 'success'); }}
                          className="action-btn action-copy"
                        >
                          <i className="fa-solid fa-copy" />
                          <span>Copy</span>
                        </button>
                        <button
                          onClick={() => handleExtend(lic.key, 30)}
                          className="action-btn action-extend"
                        >
                          <i className="fa-solid fa-plus" />
                          <span>+30d</span>
                        </button>
                        <button
                          onClick={() => handleExtend(lic.key, 365)}
                          className="action-btn action-extend-year"
                        >
                          <i className="fa-solid fa-plus" />
                          <span>+1Y</span>
                        </button>
                        <button
                          onClick={() => handleToggle(lic.key)}
                          className={`action-btn ${lic.isActive ? 'action-disable' : 'action-enable'}`}
                        >
                          <i className={`fa-solid ${lic.isActive ? 'fa-ban' : 'fa-check'}`} />
                          <span>{lic.isActive ? 'Tắt' : 'Bật'}</span>
                        </button>
                        <button
                          onClick={() => handleDelete(lic.key)}
                          className="action-btn action-delete"
                        >
                          <i className="fa-solid fa-trash" />
                          <span>Xóa</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* === CREATE VIEW === */}
        <div style={{ display: activeView === 'create' ? 'block' : 'none' }}>
          <div className="admin-create-section">
            <div className="admin-create-header">
              <i className="fa-solid fa-wand-magic-sparkles" />
              <h2>Tạo License Mới</h2>
              <p>Tạo key cho khách hàng mới</p>
            </div>

            <div className="admin-create-form">
              <div className="admin-form-group">
                <label><i className="fa-solid fa-user" /> Tên khách hàng *</label>
                <input
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div className="admin-form-group">
                <label><i className="fa-solid fa-at" /> Email / SĐT</label>
                <input
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="email@example.com"
                />
              </div>

              <div className="admin-form-group">
                <label><i className="fa-solid fa-crown" /> Gói License</label>
                <div className="admin-plan-selector">
                  {([
                    { plan: 'trial' as const, icon: '🆓', label: 'Trial', sub: '1 ngày', price: 'Free' },
                    { plan: 'yearly' as const, icon: '👑', label: 'Yearly', sub: '365 ngày', price: '149K' },
                    { plan: 'lifetime' as const, icon: '🏆', label: 'Lifetime', sub: 'Trọn đời', price: '399K' },
                  ]).map(p => (
                    <button
                      key={p.plan}
                      onClick={() => setNewPlan(p.plan)}
                      className={`plan-option ${newPlan === p.plan ? 'selected' : ''}`}
                    >
                      <span className="plan-icon">{p.icon}</span>
                      <span className="plan-name">{p.label}</span>
                      <span className="plan-price">{p.price}</span>
                      <span className="plan-duration">{p.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="admin-form-group">
                <label><i className="fa-solid fa-note-sticky" /> Ghi chú</label>
                <input
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  placeholder="Tùy chọn..."
                />
              </div>

              <button onClick={handleCreate} className="admin-create-btn">
                <i className="fa-solid fa-key" />
                <span>TẠO LICENSE KEY</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Safe Area (for mobile) */}
        <div className="admin-bottom-safe" />
      </div>
    </div>
  );
};

export default AdminModule;
