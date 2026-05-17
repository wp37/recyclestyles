// ==================================================================================
// CONFIGURATION & CONSTANTS — Recycle Styles Master
// Truyện cổ tích Việt Nam bằng vật liệu tái chế
// ==================================================================================

export const MODELS = {
  text: "gemini-2.5-flash",
  image: "imagen-3.0-generate-002",
  openrouter_default: "google/gemini-2.0-flash-exp:free",
};

export const GOOGLE_LABS_URLS = {
  video: "https://aitestkitchen.withgoogle.com/tools/video-fx",
  image: "https://aitestkitchen.withgoogle.com/tools/image-fx",
};

export interface TargetMarket {
  id: string;
  name: string;
  flag: string;
  voice_lang: string;
  currency: string;
  culture?: string;
}

export const TARGET_MARKETS: Record<string, TargetMarket> = {
  vn_recycle: { id: 'vn_recycle', name: 'Việt Nam — Truyện Cổ Tích Tái Chế', flag: '🇻🇳', voice_lang: 'Vietnamese', currency: 'VND', culture: 'Văn hóa dân gian Việt Nam, tinh thần bảo vệ môi trường, nghệ thuật tái chế truyền thống, giáo dục thiếu nhi qua hình ảnh' },
  vn_kids: { id: 'vn_kids', name: 'Việt Nam — Thiếu Nhi Sáng Tạo', flag: '🇻🇳', voice_lang: 'Vietnamese', currency: 'VND', culture: 'Nội dung giáo dục cho trẻ em, kết hợp vui chơi và học tập, DIY thủ công' },
  us_diy: { id: 'us_diy', name: 'USA (Recycled Folklore DIY)', flag: '🇺🇸', voice_lang: 'English', currency: 'USD', culture: 'Eco-conscious storytelling, upcycling art, stop-motion crafts' },
  jp_craft: { id: 'jp_craft', name: 'Japan (工芸リサイクル)', flag: '🇯🇵', voice_lang: 'Japanese', currency: 'JPY', culture: 'Japanese crafting culture, mottainai philosophy, origami recycling' },
  kr_eco: { id: 'kr_eco', name: 'Korea (에코 스토리텔링)', flag: '🇰🇷', voice_lang: 'Korean', currency: 'KRW', culture: 'K-eco art, recycled paper crafting, green storytelling' },
  global_eco: { id: 'global_eco', name: 'Global (Eco-Folklore)', flag: '🌍', voice_lang: 'English', currency: 'USD', culture: 'International eco-art movement, sustainable storytelling, environmental education through folk tales' },
};

export interface VisualStyle {
  id: string;
  name: string;
  desc: string;
  prompt_enforce: string;
}

export const VISUAL_STYLES: VisualStyle[] = [
  { id: 'auto', name: '✨ AI Director Auto', desc: 'AI tự chọn phong cách phù hợp nhất với truyện.', prompt_enforce: '' },
  { id: 'stop_motion_papercraft', name: '📦 Stop-Motion Papercraft', desc: 'Thế giới giấy thủ công, stop-motion chân thực, bìa carton, keo dán.', prompt_enforce: ', Visual Style: Hyper-detailed realistic physical stop-motion handcrafted paper universe, layered paper cutout animation, mechanical pop-up book engineering, miniature theater diorama, tactile cardboard machinery, heavy cardstock, corrugated cardboard, gold foil paper, visible paper fibers, subtle wrinkles, imperfect scissor cuts, macro cinematic photography, extreme shallow depth of field, warm studio spotlights' },
  { id: 'dong_ho_folk', name: '🎨 Đông Hồ Folk Art', desc: 'Tranh Đông Hồ truyền thống, giấy dó, bột điệp, mộc bản.', prompt_enforce: ', Visual Style: Authentic Vietnamese Đông Hồ folk woodblock painting aesthetic, handmade dó paper coated with crushed seashell powder, mineral pigments, flattened folk perspective, simplified anatomy, symbolic composition, strong black woodblock outlines, limited traditional color palette vermilion red indigo yellow ochre leaf green, printed texture resembles manually pressed woodblock ink' },
  { id: 'water_puppet', name: '🎭 Múa Rối Nước', desc: 'Múa rối nước truyền thống, sơn mài, sân khấu nổi.', prompt_enforce: ', Visual Style: Authentic Vietnamese Water Puppetry aesthetic, hand-carved wooden puppets with glossy lacquer coating, visible artisan carving marks, traditional folk exaggeration, deep lacquer red aged gold moss green, warm fire-lit evening ambience, lantern reflections dancing across water, humid atmospheric diffusion' },
  { id: 'plastic_mosaic', name: '♻️ Plastic Mosaic', desc: 'Nắp chai, mảnh nhựa tái chế tạo hình linh vật thần thoại.', prompt_enforce: ', Visual Style: Vietnamese recycled plastic mosaic folk-art aesthetic, discarded bottle caps broken plastic shards translucent packaging fragments, mythological Vietnamese folk symbolism fused with urban recycling-art craftsmanship, faded red oxidized blue washed yellow cloudy white algae green, warm late-afternoon sunlight reflecting softly across glossy plastic surfaces' },
  { id: 'fabric_collage', name: '🧵 Fabric Collage', desc: 'Vải vụn, quần áo cũ, thêu tay tạo nhân vật dân gian.', prompt_enforce: ', Visual Style: Vietnamese fabric collage folk-art aesthetic, recycled cloth worn garments linen scraps faded cotton patched embroidery woven textures, faded indigo warm beige muted crimson dusty pink rice-paper white, soft diffused daylight illuminating cloth fibers and textile layering, gentle stop-motion textile feel' },
  { id: 'popup_cardboard', name: '📚 Pop-up Cardboard', desc: 'Sách nổi bìa carton, kỹ thuật pop-up, chiều sâu lớp lang.', prompt_enforce: ', Visual Style: Vietnamese pop-up cardboard diorama aesthetic, corrugated cardboard layered carton sheets folded paper-engineering structures, visible cut lines handmade glue seams exposed corrugation textures scoring marks, theatrical folk storytelling with tactile analog construction realism, warm directional lighting emphasizing cast shadows between cardboard layers' },
  { id: 'nature_debris', name: '🍂 Lá Khô & Hạt', desc: 'Lá khô, vỏ hạt, hạt đậu tạo bối cảnh rừng núi nguyên sơ.', prompt_enforce: ', Visual Style: Nature debris folk-art aesthetic using dried leaves sunflower seed shells beans grains bark to create forest mountain landscapes, earthy brown olive green amber gold dried red, natural organic textures with rustic handcrafted imperfections, soft warm natural daylight through forest canopy' },
];

export const SEO_CHECKLIST_DATA: Record<string, { id: string; label: string }[]> = {
  "Phần 1: Giáo Dục & Bảo Vệ Môi Trường (BẮT BUỘC)": [
    { id: "eco_1", label: "Thông điệp tái chế rõ ràng" },
    { id: "eco_2", label: "Giáo dục môi trường lồng ghép" },
    { id: "eco_3", label: "Hướng dẫn DIY khả thi tại nhà" },
    { id: "eco_4", label: "An toàn cho trẻ em (không vật liệu sắc nhọn)" },
  ],
  "Phần 2: SEO Truyện Cổ Tích Tái Chế": [
    { id: "seo_1", label: "Keyword: 'Truyện cổ tích', 'Tái chế', 'DIY', 'Thủ công'" },
    { id: "seo_2", label: "Thumbnail: Vật liệu tái chế → Tác phẩm nghệ thuật" },
    { id: "seo_3", label: "Hook: Đống rác → Kiệt tác cổ tích (Transformation)" },
    { id: "seo_4", label: "Mô tả: Hành trình sáng tạo + giá trị giáo dục" },
  ],
  "Phần 3: Cộng Đồng Eco-Art": [
    { id: "com_1", label: "Hỏi: 'Bạn muốn xem truyện nào được tái chế?'" },
    { id: "com_2", label: "CTA: Tặng Ebook hướng dẫn làm đồ chơi tái chế" },
  ],
};

export const SECONDS_PER_SCENE = 8;

export type TabId = 'spy' | 'script' | 'studio' | 'seo' | 'market';

export const TAB_COLORS: Record<TabId, { bg: string; border: string; text: string; shadow: string }> = {
  spy: { bg: 'bg-[#0a1f15]', border: 'border-emerald-500/50', text: 'text-emerald-400', shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]' },
  script: { bg: 'bg-[#1a1e2e]', border: 'border-teal-500/50', text: 'text-teal-300', shadow: 'shadow-[0_0_15px_rgba(20,184,166,0.15)]' },
  studio: { bg: 'bg-[#1f1a0f]', border: 'border-amber-500/50', text: 'text-amber-300', shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]' },
  seo: { bg: 'bg-[#0f1f20]', border: 'border-cyan-500/50', text: 'text-cyan-300', shadow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]' },
  market: { bg: 'bg-[#1f0f1a]', border: 'border-pink-500/50', text: 'text-pink-300', shadow: 'shadow-[0_0_15px_rgba(236,72,153,0.15)]' },
};
