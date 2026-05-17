import React, { useState } from 'react';
import { callAI } from '../services/aiService';
import { SYSTEM_PROMPT_SCRIPT_WRITER } from '../data/prompts';
import { TARGET_MARKETS, VISUAL_STYLES, SECONDS_PER_SCENE } from '../data/constants';
import { showToast } from '../components/Toast';

// ==================================================================================
// STYLE RECOMMENDATION ENGINE — AI Brain Core
// Khi user nhập chủ đề, AI sẽ phân tích và đề xuất style phù hợp nhất
// ==================================================================================
const STYLE_RECOMMENDATION_PROMPT = `
BẠN LÀ CHUYÊN GIA ĐỀ XUẤT PHONG CÁCH NGHỆ THUẬT TÁI CHẾ.

Dựa trên chủ đề truyện cổ tích được cung cấp, hãy phân tích và đề xuất phong cách visual phù hợp nhất.

CÁC PHONG CÁCH CÓ SẴN:
1. "stop_motion_papercraft" — Stop-Motion Papercraft: Phù hợp với cảnh có nhiều chuyển động, cung điện, lâu đài, cơ chế máy móc. VD: Tấm Cám, Thạch Sanh đánh trăn tinh.
2. "dong_ho_folk" — Đông Hồ Folk Art: Phù hợp cảnh tâm linh, lễ hội, thờ cúng tổ tiên, sinh hoạt làng quê. VD: Sự tích Tết, Chử Đồng Tử.
3. "water_puppet" — Múa Rối Nước: Phù hợp cảnh có nước, sông, biển, lễ hội, nhân vật thần thoại dưới nước. VD: Sơn Tinh Thủy Tinh, Cá Chép hóa Rồng.
4. "plastic_mosaic" — Plastic Mosaic: Phù hợp tạo hình linh vật lớn, rồng phượng, quái vật thần thoại. VD: Con Rồng Cháu Tiên, Lạc Long Quân.
5. "fabric_collage" — Fabric Collage: Phù hợp nhân vật mềm mại, cảm xúc, trang phục, đời sống gia đình. VD: Nàng Tấm, Cô Tấm, Trầu Cau.
6. "popup_cardboard" — Pop-up Cardboard: Phù hợp cảnh hoành tráng, kiến trúc, chiều sâu không gian. VD: Thánh Gióng, An Dương Vương xây Cổ Loa.
7. "nature_debris" — Lá Khô & Hạt: Phù hợp cảnh rừng núi, thiên nhiên, thôn quê, mùa thu. VD: Mai An Tiêm, Sự tích Dưa Hấu.

OUTPUT JSON:
{
  "recommended_style": "style_id",
  "reason": "Giải thích ngắn gọn tại sao phong cách này phù hợp với chủ đề",
  "alternative_style": "style_id thay thế",
  "alternative_reason": "Lý do thay thế"
}
`;

interface Props { onScriptGenerated: (segments: any[], style: string) => void; initialTopic?: string; }

const ScriptModule: React.FC<Props> = ({ onScriptGenerated, initialTopic = '' }) => {
  const [topic, setTopic] = useState(initialTopic);
  const [duration, setDuration] = useState(1);
  const [market, setMarket] = useState('vn_recycle');
  const [style, setStyle] = useState('auto');
  const [loading, setLoading] = useState(false);
  const [segments, setSegments] = useState<any[]>([]);
  const [suggestedStyle, setSuggestedStyle] = useState<any>(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  React.useEffect(() => { if (initialTopic) setTopic(initialTopic); }, [initialTopic]);

  const scenes = Math.ceil((Math.max(0.1, duration) * 60) / SECONDS_PER_SCENE);
  const mode = duration < 3 ? { name: '🟢 QUICK CRAFT (<3m)', wpm: 130 } : duration <= 10 ? { name: '🔵 STORY WEAVER (3-10m)', wpm: 140 } : { name: '🟣 EPIC FOLKLORE (>10m)', wpm: 120 };
  const words = Math.floor(duration * mode.wpm);
  const modeColor = duration < 3 ? 'text-green-400 border-green-500/50 bg-green-900/10' : duration <= 10 ? 'text-teal-400 border-teal-500/50 bg-teal-900/10' : 'text-purple-400 border-purple-500/50 bg-purple-900/10';

  // === AI STYLE SUGGESTION — Brain Core ===
  const handleSuggestStyle = async () => {
    if (!topic) return showToast('Nhập chủ đề trước!');
    setLoadingSuggestion(true);
    try {
      const prompt = `CHỦ ĐỀ: "${topic}"\n\nHãy đề xuất phong cách visual phù hợp nhất.`;
      const result = await callAI(prompt, STYLE_RECOMMENDATION_PROMPT);
      setSuggestedStyle(result);
      if (result.recommended_style) {
        setStyle(result.recommended_style);
        showToast(`✨ AI đề xuất: ${VISUAL_STYLES.find(s => s.id === result.recommended_style)?.name || result.recommended_style}`, 'success');
      }
    } catch (e: any) { showToast(e.message); }
    finally { setLoadingSuggestion(false); }
  };

  const handleGenerate = async () => {
    if (!topic) return showToast('Nhập chủ đề!');
    setLoading(true);
    try {
      const styleObj = VISUAL_STYLES.find(s => s.id === style);
      const mk = TARGET_MARKETS[market] || TARGET_MARKETS['vn_recycle'];
      const prompt = `TOPIC: "${topic}"\nDURATION: ${duration}m\nSCENE_COUNT: ${scenes}\nTARGET_LANGUAGE: ${mk.voice_lang}\nTARGET_MARKET: ${mk.name}\nVISUAL_STYLE: ${styleObj?.name || 'Auto'}\nRESPOND ALL TEXT FIELDS IN VIETNAMESE.\nGENERATE JSON OBJECT.`;
      const json = await callAI(prompt, SYSTEM_PROMPT_SCRIPT_WRITER);
      let segs = json.script || (Array.isArray(json) ? json : []);
      let enforce = '';
      if (styleObj && styleObj.id !== 'auto') enforce = styleObj.prompt_enforce;
      else if (json.suggested_style) enforce = `, Visual Style: ${json.suggested_style}`;
      if (enforce) {
        segs = segs.map((s: any) => ({
          ...s,
          video_prompt: s.video_prompt?.includes('Visual Style:') ? s.video_prompt : `${s.video_prompt} ${enforce}`,
          image_prompt: s.image_prompt?.includes('Visual Style:') ? s.image_prompt : `${s.image_prompt} ${enforce}`,
        }));
      }
      setSegments(segs);
      onScriptGenerated(segs, json.suggested_style || '');
    } catch (e: any) { showToast(e.message); }
    finally { setLoading(false); }
  };

  const copyAll = () => {
    const text = segments.map(s => s.chapter_voice_block || s.voice_text).join('\n\n');
    navigator.clipboard.writeText(text);
    showToast('✅ Đã copy voice toàn bộ!', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-[slideIn_0.4s_ease-out]">
      <div className="bg-[#0f0f11] border border-white/10 p-6 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><i className="fa-solid fa-scroll text-teal-500" /> Soạn Kịch Bản Truyện Cổ Tích Tái Chế</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block">Chủ Đề Truyện</label>
            <div className="flex gap-2">
              <input value={topic} onChange={e => setTopic(e.target.value)} className="flex-1 bg-black border border-white/10 rounded-lg p-3 text-sm text-white outline-none focus:border-teal-500/50 placeholder-white/20" placeholder="VD: Tấm Cám, Thạch Sanh, Sơn Tinh Thủy Tinh..." />
              <button onClick={handleSuggestStyle} disabled={loadingSuggestion || !topic}
                className="px-4 py-2 bg-emerald-900/30 hover:bg-emerald-800/40 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-50 shrink-0"
                title="AI đề xuất phong cách phù hợp">
                {loadingSuggestion ? <><i className="fa-solid fa-sync animate-spin" /> Đang phân tích...</> : <><i className="fa-solid fa-wand-magic-sparkles" /> AI Đề Xuất Style</>}
              </button>
            </div>
          </div>

          {/* AI Style Suggestion Card */}
          {suggestedStyle && (
            <div className="bg-gradient-to-r from-emerald-900/15 to-teal-900/15 border border-emerald-500/30 rounded-xl p-4 animate-[slideIn_0.3s_ease-out]">
              <div className="flex items-center gap-2 mb-2">
                <i className="fa-solid fa-wand-magic-sparkles text-emerald-400" />
                <span className="text-xs font-bold text-emerald-400 uppercase">AI Đề Xuất Phong Cách</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-black/30 p-3 rounded-lg border border-emerald-500/20">
                  <div className="text-[10px] text-emerald-300 mb-1 font-bold">🏆 ĐỀ XUẤT CHÍNH</div>
                  <div className="text-sm font-bold text-white mb-1">{VISUAL_STYLES.find(s => s.id === suggestedStyle.recommended_style)?.name || suggestedStyle.recommended_style}</div>
                  <div className="text-[10px] text-slate-400">{suggestedStyle.reason}</div>
                </div>
                {suggestedStyle.alternative_style && (
                  <div className="bg-black/30 p-3 rounded-lg border border-teal-500/20">
                    <div className="text-[10px] text-teal-300 mb-1 font-bold">🔄 THAY THẾ</div>
                    <div className="text-sm font-bold text-white mb-1">{VISUAL_STYLES.find(s => s.id === suggestedStyle.alternative_style)?.name || suggestedStyle.alternative_style}</div>
                    <div className="text-[10px] text-slate-400">{suggestedStyle.alternative_reason}</div>
                    <button onClick={() => { setStyle(suggestedStyle.alternative_style); showToast('Đã chọn style thay thế!', 'info'); }}
                      className="mt-2 text-[10px] text-teal-400 hover:underline flex items-center gap-1">
                      <i className="fa-solid fa-arrow-right" /> Dùng style này
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#151515] border border-white/5 rounded-xl p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-teal-500/50" />
              <label className="text-xs font-bold text-slate-400 uppercase mb-3 block flex items-center gap-2"><i className="fa-solid fa-clock text-teal-400" /> THỜI LƯỢNG (PHÚT)</label>
              <div className="flex items-center gap-5">
                <input type="number" value={duration} step={0.5} onChange={e => setDuration(parseFloat(e.target.value) || 1)} className="w-20 bg-black border border-white/10 rounded-lg p-3 text-2xl font-black text-white text-center outline-none" />
                <div className="flex flex-col gap-1.5 text-xs">
                  <div><span className="text-slate-500">Số cảnh:</span> <span className="font-bold text-green-400 text-base">~{scenes} Cảnh</span></div>
                  <div><span className="text-slate-500">Voice:</span> <span className="font-bold text-teal-400 text-base">~{words} từ</span></div>
                </div>
              </div>
            </div>
            <div className="bg-[#151515] border border-white/5 rounded-xl p-4 flex flex-col justify-center">
              <label className="text-xs font-bold text-slate-400 uppercase mb-2 block flex items-center gap-2"><i className="fa-solid fa-globe text-amber-400" /> THỊ TRƯỜNG</label>
              <select value={market} onChange={e => setMarket(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm text-white outline-none cursor-pointer">
                {Object.values(TARGET_MARKETS).map(m => <option key={m.id} value={m.id}>{m.flag} {m.name}</option>)}
              </select>
            </div>
          </div>
          <div className={`border rounded-xl p-4 transition-all ${modeColor}`}>
            <div className="font-bold">{mode.name}</div>
          </div>
          <div className="bg-[#151515] border border-white/5 rounded-xl p-4">
            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block flex items-center gap-2"><i className="fa-solid fa-palette text-emerald-400" /> PHONG CÁCH VẬT LIỆU TÁI CHẾ</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {VISUAL_STYLES.map(s => (
                <button key={s.id} onClick={() => setStyle(s.id)}
                  className={`text-[10px] p-2 rounded border text-left transition-all ${style === s.id ? 'bg-emerald-900/30 border-emerald-500/50 text-white shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-[#1a1a1a] border-white/5 text-slate-400 hover:bg-[#252525]'}`}>
                  <div className="font-bold mb-0.5">{s.name}</div>
                  <div className="text-[9px] opacity-70 truncate">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleGenerate} disabled={loading}
            className="w-full py-4 bg-teal-900/50 hover:bg-teal-800/50 border border-teal-500/30 text-teal-100 font-bold rounded-xl shadow-[0_0_20px_rgba(20,184,166,0.15)] flex items-center justify-center gap-2 transition-all disabled:opacity-50">
            {loading ? <><i className="fa-solid fa-sync animate-spin" /> ĐANG VIẾT KỊCH BẢN...</> : <><i className="fa-solid fa-pen-nib" /> KIẾN TẠO KỊCH BẢN CỔ TÍCH</>}
          </button>
        </div>
      </div>

      {/* Script Results */}
      {segments.length > 0 && (
        <div className="space-y-4 pb-10">
          <div className="flex justify-between items-center px-2">
            <div className="text-xs text-slate-500 font-bold">Đã tạo: {segments.length} phân đoạn</div>
            <button onClick={copyAll} className="text-xs font-bold px-3 py-1.5 rounded flex items-center gap-2 bg-white text-black hover:bg-slate-200"><i className="fa-solid fa-copy" /> Copy Voice Toàn Bộ</button>
          </div>
          {segments.map((seg, idx) => (
            <div key={idx} className="bg-[#0f0f11] border border-white/10 p-4 rounded-xl flex flex-col sm:flex-row gap-4 hover:border-teal-500/30 transition-colors relative">
              <div className="w-full sm:w-28 shrink-0 text-center pt-1 border-r border-white/5 pr-2">
                <div className="text-[10px] bg-[#1a1a1a] px-2 py-1 rounded font-bold text-white mb-1">SCENE {seg.scene_number || idx + 1}</div>
                <div className="text-[9px] text-slate-500 font-mono mb-1">{seg.time}</div>
                <div className="text-[9px] text-teal-400 font-bold uppercase break-words mb-1">{seg.section}</div>
                {seg.beat && <div className="text-[9px] text-purple-400 font-bold uppercase">{seg.beat}</div>}
                {seg.dialogue_intent && (
                  <div className={`text-[9px] font-bold mt-1 px-1.5 py-0.5 rounded-full inline-block ${
                    seg.dialogue_intent === 'silent' ? 'bg-slate-800 text-slate-400' :
                    seg.dialogue_intent === 'low' ? 'bg-amber-900/30 text-amber-300 border border-amber-500/20' :
                    'bg-emerald-900/30 text-emerald-300 border border-emerald-500/20'
                  }`}>
                    {seg.dialogue_intent === 'silent' ? '🔇' : seg.dialogue_intent === 'low' ? '🔉' : '🔊'} {seg.dialogue_intent}
                  </div>
                )}
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#151515]/50 p-3 rounded border border-white/5">
                  <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mb-1"><i className="fa-solid fa-eye" /> VISUAL</div>
                  <p className="text-xs text-slate-300 mb-2">{seg.visual_desc_vi || seg.visual_desc}</p>
                  {seg.strategy_note && <div className="mt-2 p-2 rounded bg-amber-900/10 border border-amber-500/20 text-[10px] text-amber-200/80 italic">💡 {seg.strategy_note}</div>}
                  {seg.continuity_note && (
                    <div className="mt-2 p-2 rounded bg-cyan-900/10 border border-cyan-500/20">
                      <div className="text-[10px] text-cyan-400 font-bold flex items-center gap-1 mb-1"><i className="fa-solid fa-link" /> CONTINUITY</div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">{seg.continuity_note}</p>
                    </div>
                  )}
                </div>
                <div className="bg-[#151515]/50 p-3 rounded border border-white/5">
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-[10px] text-teal-400 font-bold flex items-center gap-1"><i className="fa-solid fa-microphone-alt" /> VOICE</div>
                    <button onClick={() => { navigator.clipboard.writeText(seg.voice_text || ''); showToast('✅ Copied!', 'success'); }} className="text-slate-500 hover:text-white"><i className="fa-regular fa-copy" /></button>
                  </div>
                  <p className="text-sm text-emerald-100 font-medium italic leading-relaxed text-justify">"{seg.chapter_voice_block || seg.voice_text || '(Đọc tiếp...)'}"</p>
                  {/* 🎙️ AUDIO PROFILE — Voice Lock V16.0 */}
                  {seg.audio && (
                    <div className="mt-2 p-2 rounded bg-violet-900/10 border border-violet-500/20">
                      <div className="text-[10px] text-violet-400 font-bold flex items-center gap-1 mb-1.5"><i className="fa-solid fa-waveform-lines" /> AUDIO PROFILE</div>
                      <div className="grid grid-cols-2 gap-1 text-[9px]">
                        <div><span className="text-slate-500">Speaker:</span> <span className="text-violet-300 font-bold">{seg.audio.speaker}</span></div>
                        <div><span className="text-slate-500">State:</span> <span className={`font-bold ${seg.audio.state === 'ON-SCREEN' ? 'text-green-400' : 'text-amber-400'}`}>{seg.audio.state}</span></div>
                        <div className="col-span-2"><span className="text-slate-500">Timbre:</span> <span className="text-slate-300">{seg.audio.timbre}</span></div>
                        <div><span className="text-slate-500">Tone:</span> <span className="text-slate-300">{seg.audio.tone}</span></div>
                        <div><span className="text-slate-500">Pacing:</span> <span className="text-slate-300">{seg.audio.pacing}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScriptModule;