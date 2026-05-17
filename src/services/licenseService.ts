// ==================================================================================
// LICENSE SERVICE — Key Generation, Validation & Management
// TUAI Recycle Styles Master — Commercial License System
// ==================================================================================

const STORAGE_KEYS = {
  license: 'tuai_license_key',
  licenses_db: 'tuai_licenses_db',
  admin_auth: 'tuai_admin_auth',
};

// Admin credentials (hashed for basic security)
const ADMIN_PASSWORD_HASH = btoa('AdminTung@123');

export interface LicenseKey {
  key: string;
  userName: string;
  email: string;
  plan: 'trial' | 'monthly' | 'yearly' | 'lifetime';
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
  activatedAt?: string;
  note?: string;
}

export interface LicenseValidation {
  valid: boolean;
  license?: LicenseKey;
  message: string;
  daysRemaining?: number;
}

// === ADMIN AUTH ===
export function adminLogin(password: string): boolean {
  if (btoa(password) === ADMIN_PASSWORD_HASH) {
    sessionStorage.setItem(STORAGE_KEYS.admin_auth, 'true');
    return true;
  }
  return false;
}

export function isAdminLoggedIn(): boolean {
  return sessionStorage.getItem(STORAGE_KEYS.admin_auth) === 'true';
}

export function adminLogout(): void {
  sessionStorage.removeItem(STORAGE_KEYS.admin_auth);
}

// === KEY GENERATION ===
function generateKeyString(plan: string): string {
  const prefix = plan === 'trial' ? 'TRIAL' : plan === 'monthly' ? 'PRO' : plan === 'yearly' ? 'GOLD' : 'VIP';
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segments: string[] = [];
  for (let i = 0; i < 4; i++) {
    let seg = '';
    for (let j = 0; j < 4; j++) {
      seg += chars[Math.floor(Math.random() * chars.length)];
    }
    segments.push(seg);
  }
  return `${prefix}-${segments.join('-')}`;
}

function getPlanDays(plan: string): number {
  switch (plan) {
    case 'trial': return 1;
    case 'yearly': return 365;
    case 'lifetime': return 36500; // ~100 years
    default: return 1;
  }
}

export function createLicenseKey(userName: string, email: string, plan: LicenseKey['plan'], note?: string): LicenseKey {
  const now = new Date();
  const expires = new Date(now.getTime() + getPlanDays(plan) * 86400000);
  const license: LicenseKey = {
    key: generateKeyString(plan),
    userName,
    email,
    plan,
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    isActive: true,
    activatedAt: now.toISOString(),
    note,
  };
  // Save to DB
  const db = getAllLicenses();
  db.push(license);
  saveLicensesDB(db);
  return license;
}

// === LICENSE DB (localStorage) ===
export function getAllLicenses(): LicenseKey[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.licenses_db);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveLicensesDB(licenses: LicenseKey[]): void {
  localStorage.setItem(STORAGE_KEYS.licenses_db, JSON.stringify(licenses));
}

export function toggleLicense(key: string): void {
  const db = getAllLicenses();
  const idx = db.findIndex(l => l.key === key);
  if (idx >= 0) {
    db[idx].isActive = !db[idx].isActive;
    saveLicensesDB(db);
  }
}

export function deleteLicense(key: string): void {
  const db = getAllLicenses().filter(l => l.key !== key);
  saveLicensesDB(db);
}

export function extendLicense(key: string, days: number): void {
  const db = getAllLicenses();
  const idx = db.findIndex(l => l.key === key);
  if (idx >= 0) {
    const current = new Date(db[idx].expiresAt);
    current.setDate(current.getDate() + days);
    db[idx].expiresAt = current.toISOString();
    saveLicensesDB(db);
  }
}

// === USER LICENSE VALIDATION ===
export function activateUserLicense(key: string): LicenseValidation {
  const db = getAllLicenses();
  const license = db.find(l => l.key === key.trim().toUpperCase());
  if (!license) return { valid: false, message: '❌ Mã license không hợp lệ!' };
  if (!license.isActive) return { valid: false, message: '🚫 License đã bị vô hiệu hóa bởi Admin.' };
  const now = new Date();
  const expires = new Date(license.expiresAt);
  if (now > expires) return { valid: false, message: '⏰ License đã hết hạn!' };

  localStorage.setItem(STORAGE_KEYS.license, key.trim().toUpperCase());
  const days = Math.ceil((expires.getTime() - now.getTime()) / 86400000);
  return { valid: true, license, message: `✅ Kích hoạt thành công! Còn ${days} ngày.`, daysRemaining: days };
}

export function getCurrentLicense(): LicenseValidation {
  const key = localStorage.getItem(STORAGE_KEYS.license);
  if (!key) return { valid: false, message: 'Chưa kích hoạt license.' };
  const db = getAllLicenses();
  const license = db.find(l => l.key === key);
  if (!license) return { valid: false, message: 'License không tồn tại.' };
  if (!license.isActive) return { valid: false, message: 'License bị vô hiệu hóa.' };
  const now = new Date();
  const expires = new Date(license.expiresAt);
  if (now > expires) return { valid: false, message: 'License hết hạn.' };
  const days = Math.ceil((expires.getTime() - now.getTime()) / 86400000);
  return { valid: true, license, message: `Còn ${days} ngày.`, daysRemaining: days };
}

export function deactivateUserLicense(): void {
  localStorage.removeItem(STORAGE_KEYS.license);
}

export function getPlanLabel(plan: string): { label: string; color: string; icon: string } {
  switch (plan) {
    case 'trial': return { label: 'Dùng thử 1 ngày', color: 'text-slate-400', icon: '🆓' };
    case 'yearly': return { label: 'Gói Năm', color: 'text-amber-400', icon: '👑' };
    case 'lifetime': return { label: 'VIP Trọn đời', color: 'text-purple-400', icon: '🏆' };
    default: return { label: plan, color: 'text-white', icon: '📋' };
  }
}
