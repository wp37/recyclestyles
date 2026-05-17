import React, { useState } from 'react';
import { activateUserLicense, getCurrentLicense, getPlanLabel } from '../services/licenseService';
import { showToast } from './Toast';

// Bank Info for Payment (from authUtils.ts)
const BANK_INFO = {
  bankName: 'Agribank',
  accountNumber: '7110215003073',
  accountHolder: 'VO NGOC TUNG',
  qrBaseUrl: 'https://img.vietqr.io/image/agribank-7110215003073-compact2.png',
};

const PLANS = [
  { plan: 'trial', price: 'Miễn phí', priceNum: 0, duration: '1 ngày' },
  { plan: 'yearly', price: '149K', priceNum: 149000, duration: '365 ngày' },
  { plan: 'lifetime', price: '399K', priceNum: 399000, duration: 'Trọn đời' },
];

interface Props {
  onActivated: () => void;
}

const LicenseGate: React.FC<Props> = ({ onActivated }) => {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(PLANS[1]);

  const handleActivate = () => {
    if (!key.trim()) return setError('Vui lòng nhập mã license!');
    setLoading(true);
    setError('');
    setTimeout(() => {
      const result = activateUserLicense(key);
      if (result.valid) {
        showToast(result.message, 'success');
        onActivated();
      } else {
        setError(result.message);
      }
      setLoading(false);
    }, 800);
  };

  const qrUrl = `${BANK_INFO.qrBaseUrl}?amount=${selectedPlan.priceNum}&addInfo=TAICHE_${selectedPlan.plan.toUpperCase()}&accountName=${encodeURIComponent(BANK_INFO.accountHolder)}`;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg my-auto">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">♻️</div>
          <h1 className="text-2xl font-black text-white tracking-tight">TUAI RECYCLE STYLES</h1>
          <p className="text-sm text-slate-500 mt-1">AI Recycled Folklore Suite — Production Grade</p>
        </div>

        {/* Main Card */}
        <div className="bg-[#0f0f11] border border-white/10 rounded-2xl p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]">
          {!showPayment ? (
            <>
              {/* Activation Form */}
              <div className="flex items-center gap-2 mb-4">
                <i className="fa-solid fa-key text-amber-400" />
                <h2 className="text-lg font-bold text-white">Kích Hoạt License</h2>
              </div>
              <p className="text-xs text-slate-400 mb-4">Nhập mã license để sử dụng tool. Chuyển khoản để nhận mã từ Admin.</p>

              <input value={key} onChange={e => setKey(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && handleActivate()}
                placeholder="VD: PRO-ABCD-EFGH-JKLM-NPQR"
                className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm text-white font-mono tracking-wider text-center outline-none focus:border-amber-500/50 placeholder-white/20 mb-3" />

              {error && (
                <div className="text-xs text-red-400 bg-red-900/20 border border-red-500/20 rounded-lg p-3 mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-circle-exclamation" /> {error}
                </div>
              )}

              <button onClick={handleActivate} disabled={loading || !key.trim()}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                {loading ? <><i className="fa-solid fa-sync animate-spin" /> Đang kiểm tra...</> : <><i className="fa-solid fa-unlock" /> KÍCH HOẠT</>}
              </button>

              <div className="my-4 border-t border-white/5" />

              {/* Plan Options */}
              <div className="text-[10px] text-slate-500 font-bold uppercase mb-3 flex items-center gap-2">
                <i className="fa-solid fa-tags text-amber-400" /> BẢNG GIÁ LICENSE
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {PLANS.map(p => {
                  const info = getPlanLabel(p.plan);
                  return (
                    <div key={p.plan} className="bg-black/50 border border-white/5 rounded-lg p-3 text-center hover:border-amber-500/20 transition-all">
                      <div className="text-xl">{info.icon}</div>
                      <div className={`text-[10px] font-bold ${info.color} mt-1`}>{info.label}</div>
                      <div className="text-base font-black text-white mt-0.5">{p.price}</div>
                      <div className="text-[9px] text-slate-600">{p.duration}</div>
                    </div>
                  );
                })}
              </div>

              <button onClick={() => setShowPayment(true)}
                className="w-full py-3 bg-green-900/30 hover:bg-green-800/40 border border-green-500/30 text-green-300 font-bold rounded-xl flex items-center justify-center gap-2 transition-all">
                <i className="fa-solid fa-qrcode" /> MUA LICENSE — CHUYỂN KHOẢN
              </button>
            </>
          ) : (
            <>
              {/* Payment Section */}
              <button onClick={() => setShowPayment(false)} className="text-xs text-slate-500 hover:text-white mb-3 flex items-center gap-1">
                <i className="fa-solid fa-arrow-left" /> Quay lại
              </button>

              <div className="flex items-center gap-2 mb-4">
                <i className="fa-solid fa-building-columns text-green-400" />
                <h2 className="text-lg font-bold text-white">Chuyển Khoản Mua License</h2>
              </div>

              {/* Plan Selector */}
              <div className="text-[10px] text-slate-500 font-bold uppercase mb-2">Chọn gói:</div>
              <div className="grid grid-cols-4 gap-1.5 mb-4">
                {PLANS.filter(p => p.priceNum > 0).map(p => {
                  const info = getPlanLabel(p.plan);
                  const active = selectedPlan.plan === p.plan;
                  return (
                    <button key={p.plan} onClick={() => setSelectedPlan(p)}
                      className={`text-[10px] p-2 rounded-lg border text-center transition-all ${active ? 'bg-green-900/30 border-green-500/40 text-white' : 'border-white/5 text-slate-500 hover:text-white'}`}>
                      <div>{info.icon}</div>
                      <div className="font-bold">{p.price}</div>
                    </button>
                  );
                })}
              </div>

              {/* QR Code */}
              <div className="bg-white rounded-xl p-4 text-center mb-4">
                <img src={qrUrl} alt="VietQR Payment" className="w-48 h-48 mx-auto object-contain" />
              </div>

              {/* Bank Details */}
              <div className="bg-black/50 border border-green-500/20 rounded-xl p-4 space-y-2">
                <div className="text-[10px] text-green-400 font-bold uppercase mb-2"><i className="fa-solid fa-landmark mr-1" /> THÔNG TIN CHUYỂN KHOẢN</div>
                {[
                  { label: 'Ngân hàng', value: BANK_INFO.bankName, icon: 'fa-building-columns' },
                  { label: 'Số tài khoản', value: BANK_INFO.accountNumber, icon: 'fa-hashtag' },
                  { label: 'Chủ tài khoản', value: BANK_INFO.accountHolder, icon: 'fa-user' },
                  { label: 'Số tiền', value: `${selectedPlan.priceNum.toLocaleString('vi-VN')}đ`, icon: 'fa-money-bill' },
                  { label: 'Nội dung CK', value: `TAICHE_${selectedPlan.plan.toUpperCase()}`, icon: 'fa-comment' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1.5"><i className={`fa-solid ${item.icon} w-4 text-center text-slate-600`} />{item.label}:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">{item.value}</span>
                      <button onClick={() => { navigator.clipboard.writeText(item.value); showToast('Đã copy!', 'success'); }}
                        className="text-slate-600 hover:text-green-400 transition-colors"><i className="fa-regular fa-copy text-[10px]" /></button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-amber-900/10 border border-amber-500/20 rounded-lg text-[10px] text-amber-200/80 text-center">
                <i className="fa-solid fa-info-circle mr-1" />
                Sau khi chuyển khoản, Admin sẽ tạo license và gửi cho bạn qua <strong>Zalo / Facebook</strong>.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LicenseGate;
