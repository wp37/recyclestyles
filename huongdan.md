# 📋 HƯỚNG DẪN TẠO DỰ ÁN RECYCLE STYLES MASTER

> **Brand: TUAI / 08.14.666.040**
> **API: Google Gemini (duy nhất)**
> **Template gốc:** `c:\Users\Vo Tung\Downloads\PSY\`
> **Phiên bản guide:** v3.0 (cập nhật 2026-05-12 — Recycle Styles Master)
> **Đã deploy thành công:** Philosophy, Criminal, Dharma, Horror, **Recycle Styles**

---

## 🎯 MỤC TIÊU DỰ ÁN

Tạo tool web app sản xuất prompt content YouTube/Facebook về **truyện cổ tích Việt Nam bằng vật liệu tái chế**.

### Ngách (Niche): Recycled Folklore Art
- Kết hợp hồn cốt dân tộc + tư duy bảo vệ môi trường
- Stop-motion, DIY thủ công từ vật liệu tái chế
- Giáo dục thiếu nhi + viral content

---

## 🆕 QUY TRÌNH TẠO APP MỚI TỪ STYLES + GEM INSTRUCTIONS

> ⚠️ **KHÁC VỚI QUY TRÌNH CŨ:** Dự án Recycle Styles không chỉ clone + đổi màu.
> Nó yêu cầu **nạp 2 file nguồn vào brain AI** để tạo content chuyên biệt.

### File nguồn đầu vào:

| File | Vai trò | Nội dung chính |
|------|---------|----------------|
| `recylestyles.txt` | 📦 Kho phong cách visual | 6 phong cách nghệ thuật tái chế chi tiết (Stop-Motion Papercraft, Đông Hồ, Múa Rối Nước, Plastic Mosaic, Fabric Collage, Pop-up Cardboard) |
| `GEM INSTRUCTIONS CREATIVE DIRECTOR.txt` | 🎭 Brain AI sáng tạo | Vai trò Creative Director, quy trình sản xuất kịch bản, công thức tiêu đề viral, checklist chất lượng |

### Quy trình 5 bước:

```
1. CLONE template PSY → folder mới
2. ĐỌC 2 file nguồn (styles + GEM instructions)
3. NẠP nội dung vào brain AI (prompts.ts + constants.ts)
4. TÙY CHỈNH 14 file theo ngách (màu sắc, labels, storage keys)
5. TÍCH HỢP tính năng AI đề xuất style tự động
```

---

## 🗂️ CẤU TRÚC DỰ ÁN

```
📁 recyclestyles/
├── index.html              ← Title: TUAI RECYCLE STYLES MASTER
├── package.json            ← name: recyclestyles-master
├── vite.config.ts          ← Build config
├── vercel.json             ← Deploy config
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
├── .gitignore
├── recylestyles.txt        ← 📦 KHO PHONG CÁCH VISUAL (6 styles)
├── GEM INSTRUCTIONS...txt  ← 🎭 BRAIN AI CREATIVE DIRECTOR
├── huongdan.md             ← 📋 Tài liệu này
├── 📁 src/
│   ├── index.tsx           ← React entry
│   ├── index.css           ← CSS: Emerald Eco-Craft Theme
│   ├── App.tsx             ← Layout + 4 tabs (display:none) + footer
│   ├── 📁 data/
│   │   ├── constants.ts    ← ⭐ TARGET_MARKETS, VISUAL_STYLES (8 styles), TAB_COLORS
│   │   └── prompts.ts      ← ⭐ 4 AI System Prompts (Eco-Art brain)
│   ├── 📁 services/
│   │   └── aiService.ts    ← Gemini Engine + Storage Keys (recycle_*)
│   ├── 📁 components/
│   │   ├── Header.tsx      ← ♻️ Logo Recycle + Brand
│   │   ├── Sidebar.tsx     ← 4 Tab (Trend Scout, Story Weaver, Craft Studio, Eco SEO)
│   │   ├── Toast.tsx       ← Thông báo
│   │   └── ApiKeyModal.tsx ← Nhập Gemini key (emerald theme)
│   └── 📁 pages/
│       ├── SpyModule.tsx   ← Tab 1: Phân tích kênh Eco-Art
│       ├── ScriptModule.tsx← Tab 2: ⭐ Viết kịch bản + AI ĐỀ XUẤT STYLE
│       ├── StudioModule.tsx← Tab 3: Xưởng sáng tạo (ảnh/video)
│       └── SeoModule.tsx   ← Tab 4: SEO Eco-Art
```

---

## 🎨 BẢNG MÀU: EMERALD ECO-CRAFT

```
Body BG:       #050a08
Gradient:      rgba(5, 150, 105, 0.15)    /* emerald-600 */
Scrollbar:     track=#050a08  thumb=#1b4e3b  hover=#2d7a5d
Selection:     rgba(16, 185, 129, 0.3)    /* emerald-500 */
PulseGlow:     rgba(16, 185, 129, 0.4/0.8)
Header BG:     #050f0c  border: border-emerald-900/20
Logo gradient: from-emerald-900 to-slate-900
Text accent:   text-emerald-400, text-emerald-500
Hover inactive: text-emerald-500/50
Icon:          fa-recycle
```

---

## ⭐ TÍNH NĂNG ĐẶC BIỆT: AI ĐỀ XUẤT STYLE TỰ ĐỘNG

### Cách hoạt động:

1. User nhập chủ đề truyện cổ tích (VD: "Tấm Cám", "Sơn Tinh Thủy Tinh")
2. Nhấn nút **"🪄 AI Đề Xuất Style"**
3. AI phân tích chủ đề → đề xuất phong cách phù hợp nhất
4. Hiển thị card đề xuất: **Style chính** + **Style thay thế** + lý do

### Logic đề xuất (trong ScriptModule.tsx):

```typescript
// STYLE_RECOMMENDATION_PROMPT chứa mapping:
// stop_motion_papercraft → cảnh chuyển động, cung điện, lâu đài
// dong_ho_folk → cảnh tâm linh, lễ hội, sinh hoạt làng quê
// water_puppet → cảnh nước, sông, biển, thần thoại dưới nước
// plastic_mosaic → linh vật lớn, rồng phượng, quái vật
// fabric_collage → nhân vật mềm mại, cảm xúc, trang phục
// popup_cardboard → cảnh hoành tráng, kiến trúc
// nature_debris → rừng núi, thiên nhiên, mùa thu
```

### 8 Visual Styles có sẵn (constants.ts):

| ID | Tên | Vật liệu | Phù hợp với |
|---|---|---|---|
| `auto` | ✨ AI Director Auto | AI tự chọn | Mọi chủ đề |
| `stop_motion_papercraft` | 📦 Stop-Motion Papercraft | Bìa carton, giấy, keo | Cung điện, chuyển động |
| `dong_ho_folk` | 🎨 Đông Hồ Folk Art | Giấy dó, bột điệp, mộc bản | Tâm linh, lễ hội |
| `water_puppet` | 🎭 Múa Rối Nước | Gỗ sơn mài, sân khấu nước | Sông, biển, thần thoại |
| `plastic_mosaic` | ♻️ Plastic Mosaic | Nắp chai, mảnh nhựa | Rồng Phượng, linh vật |
| `fabric_collage` | 🧵 Fabric Collage | Vải vụn, thêu tay | Nhân vật, cảm xúc |
| `popup_cardboard` | 📚 Pop-up Cardboard | Bìa carton pop-up | Kiến trúc, chiều sâu |
| `nature_debris` | 🍂 Lá Khô & Hạt | Lá, hạt, vỏ cây | Rừng núi, thiên nhiên |

---

## 📝 BRAIN AI — 4 PROMPTS CHÍNH

### 1. SYSTEM_PROMPT_IQ160_SPY (Tab 1: Trend Scout)
- YouTube Analytics Expert + Creative Director
- Phân tích kênh DIY/Eco-Art/Recycled Folklore
- Output: Revenue, Strengths, Weaknesses, Audio, Engagement, Hook Timeline

### 2. SYSTEM_PROMPT_SCRIPT_WRITER (Tab 2: Story Weaver)
- Creative Director for Recycled Folklore 🎭
- **Tích hợp GEM INSTRUCTIONS:** công thức tiêu đề "Triệu View", nguyên tắc thi công "Xanh"
- **Tích hợp Styles:** 7 phong cách visual từ recylestyles.txt
- Output: mode_detected, suggested_style, style_reason, script (scenes)

### 3. SYSTEM_PROMPT_SEO_MASTER (Tab 4: Eco SEO)
- Eco-Art Content Strategist + YouTube SEO Expert
- Keywords, Hashtags, Viral Titles, Description, Thumbnail Strategy

### 4. SYSTEM_PROMPT_MARKET_ANALYST (Backup)
- Eco-Art Market Analyst + Product Sourcing Expert
- Customer Persona, Market Potential, Product Recommendations

---

## 🔧 CẤU HÌNH KỸ THUẬT

### Model API (Gemini):
```typescript
export const MODELS = {
  text: "gemini-2.5-flash",
  image: "imagen-3.0-generate-002",
};
```

### Storage Keys (tránh trùng với các ngách khác):
```typescript
const STORAGE_KEYS = {
  keyPool: 'recycle_key_pool',
  openRouterKey: 'recycle_openrouter_key',
  // ... tất cả prefix 'recycle_'
};
```

### Tab Names & Icons:
```
1. TREND SCOUT    (fa-magnifying-glass-chart) — Phân Tích Kênh Eco-Art
2. STORY WEAVER   (fa-scroll)                — Viết Kịch Bản Cổ Tích
3. CRAFT STUDIO   (fa-palette)               — Xưởng Sáng Tạo
4. ECO SEO        (fa-seedling)              — Tối Ưu Viral
```

### Mode Names (ScriptModule):
```
🟢 QUICK CRAFT (<3m)     — Video ngắn, thủ công nhanh
🔵 STORY WEAVER (3-10m)  — Truyện kể + DIY process
🟣 EPIC FOLKLORE (>10m)  — Truyện dài, nhiều phân cảnh
```

---

## ✅ CHECKLIST ĐẦY ĐỦ

```
[x] Clone template PSY
[x] npm install
[x] Sửa index.html (title: TUAI RECYCLE STYLES MASTER)
[x] Sửa constants.ts (TARGET_MARKETS eco-art, 8 VISUAL_STYLES, SEO_CHECKLIST eco, TAB_COLORS emerald)
[x] Sửa prompts.ts (4 prompts eco-art + GEM INSTRUCTIONS brain)
[x] Sửa Header.tsx (♻️ recycle icon + emerald gradient)
[x] Sửa Sidebar.tsx (Trend Scout, Story Weaver, Craft Studio, Eco SEO)
[x] Sửa index.css (emerald body bg + gradient + selection + pulseGlow)
[x] Sửa ApiKeyModal.tsx (emerald border + text + bg)
[x] Sửa aiService.ts (recycle_ storage keys + X-Title)
[x] Sửa SpyModule.tsx (eco-art labels + emerald colors + ⭐ Vietnamese response)
[x] Sửa ScriptModule.tsx (vn_recycle market + ⭐ mode names + ⭐ AI Style Suggestion)
[x] Sửa SeoModule.tsx (vn_recycle default + fallback market)
[x] Sửa App.tsx (⭐ display:none giữ phiên)
[x] Sửa package.json (recyclestyles-master)
[x] npm run build → 0 errors ✅
[x] npm run dev → test visual ✅
[x] ⭐ Bước 7.1: RESPOND ALL TEXT FIELDS IN VIETNAMESE (SpyModule + SeoModule)
[x] ⭐ Bước 7.2: display:none thay switch/case (App.tsx)
[x] ⭐ BONUS: AI Style Recommendation Engine (ScriptModule)
[ ] Xóa file .php gốc nếu có
[ ] git init → git add → git commit
[ ] npx vercel --prod --yes → deploy
```

---

## 🚀 DEPLOY

```powershell
cd c:\Users\Vo Tung\Downloads\recyclestyles
npm run build
npx -y vercel --prod --yes
```

→ URL: `https://recyclestyles.vercel.app`

---

## 🔄 QUY TRÌNH TẠO APP MỚI TỪ STYLES + GEM INSTRUCTIONS (TỔNG QUAN)

```
┌─────────────────────────────────────────────────────────────────┐
│  1. CHUẨN BỊ FILE NGUỒN                                       │
│     ├── [tên-ngách]-styles.txt   ← Kho phong cách visual       │
│     └── GEM INSTRUCTIONS.txt     ← Brain AI Creative Director  │
│                                                                 │
│  2. CLONE TEMPLATE PSY                                          │
│     Copy template gốc → folder mới                              │
│                                                                 │
│  3. NẠP VÀO BRAIN AI                                           │
│     ├── Đọc styles → tạo VISUAL_STYLES[] trong constants.ts    │
│     ├── Đọc GEM → tạo SYSTEM_PROMPT_SCRIPT_WRITER              │
│     └── Kết hợp cả 2 → STYLE_RECOMMENDATION_PROMPT             │
│                                                                 │
│  4. TÙY CHỈNH 14 FILE                                          │
│     ├── Màu sắc (emerald/teal/amber...)                         │
│     ├── Labels, icons, tab names                                │
│     ├── Storage keys prefix                                     │
│     └── Market targets                                          │
│                                                                 │
│  5. BUILD + TEST + DEPLOY                                       │
│     npm run build → npm run dev → vercel --prod                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚨 BẪY THƯỜNG GẶP

| # | Bẫy | Hậu quả | Cách tránh |
|---|---|---|---|
| 1 | Quên đổi `ANALYZE PSYCHOLOGY CONTENT` trong SpyModule | AI phân tích sai ngách | Search toàn bộ `PSYCHOLOGY\|CRIME\|tâm lý` |
| 2 | Quên đổi mode names `DAILY WISDOM` trong ScriptModule | UI hiện tên ngách cũ | Đổi thành QUICK CRAFT / STORY WEAVER / EPIC FOLKLORE |
| 3 | Dùng backtick escaped `\`` trong prompts.ts | Build fail: Invalid Unicode | Dùng backtick thường, tránh ký tự đặc biệt trong template literal |
| 4 | Giữ `renderPage()` switch/case trong App.tsx | Mất data khi chuyển tab | Đổi sang `display: none` |
| 5 | Quên thêm `RESPOND ALL TEXT FIELDS IN VIETNAMESE` | AI trả kết quả tiếng Anh | Thêm vào prompt SpyModule + SeoModule |
| 6 | Không nạp styles vào STYLE_RECOMMENDATION_PROMPT | AI không đề xuất đúng style | Copy 7 style mapping vào ScriptModule |

---

**© TUAI — 08.14.666.040**
