# PRD - Tiger Esports Landing Page Phase 1

## 1. Mục tiêu

Xây landing page chính thức cho chuỗi cyber game Tiger Esports, dùng để:
- Giới thiệu thương hiệu.
- Hiển thị các cơ sở.
- Hiển thị cấu hình máy, bảng giá, combo.
- Truyền thông giải đấu và cộng đồng.
- Dẫn khách về Facebook, Zalo, Google Maps.
- Làm nền tảng để sau này bổ sung backend/admin.

Phase 1 chưa cần backend. Tuy nhiên code phải được thiết kế backend-ready.

## 2. Đối tượng người dùng

- Game thủ tại Thanh Hóa/Sầm Sơn.
- Khách mới tìm phòng máy gần khu vực.
- Người chơi quan tâm giải đấu FC Online, Valorant, TFT, AOE.
- Phụ huynh/khách phổ thông muốn xem địa chỉ, giá giờ, chất lượng phòng máy.

## 3. Công nghệ

- Next.js App Router.
- TypeScript.
- TailwindCSS.
- Deploy Vercel.
- Dữ liệu tĩnh trong `/data`.

## 4. Section bắt buộc

### 4.1 Hero
- Tiêu đề: TIGER ESPORTS.
- Slogan: Cyber Game cao cấp cho game thủ.
- CTA chính: Xem cơ sở.
- CTA phụ: Liên hệ ngay.
- Có nền gaming/cyber hiện đại.

### 4.2 Cơ sở
Hiển thị 4 cơ sở:
- Tiger 1 - Trường Sơn.
- Tiger 2 - Quảng Tiến.
- Tiger 3 - Quang Trung.
- Tiger 4 - Quảng Phú.

Mỗi cơ sở nên có:
- Tên.
- Khu vực.
- Địa chỉ placeholder nếu chưa có.
- Nút Google Maps.
- Nút gọi/Zalo nếu có dữ liệu.

### 4.3 Cấu hình
Các hạng máy:
- Thi đấu.
- SVIP.
- VIP.
- Core.

Cần hiển thị:
- CPU.
- GPU.
- RAM.
- Màn hình.
- Mô tả ngắn.

### 4.4 Bảng giá
Bảng giá tham chiếu:
- Thi đấu: 14.445đ/h.
- SVIP: 11.503đ/h.
- VIP: 9.450đ/h.
- Core: 7.475đ/h.

Cần ghi chú: Giá có thể thay đổi theo cơ sở/chương trình.

### 4.5 Combo & khuyến mãi
Combo chính:
- Combo Chiến Thần 499k.
- Mỗi ngày 8h chơi trong 7 ngày.
- Tặng voucher dịch vụ 30k/ngày.

### 4.6 Giải đấu & cộng đồng
Nội dung:
- Giải đấu cọ sát liên tục.
- Kết nối game thủ cùng đam mê.
- Các bộ môn: FC Online, Valorant, TFT, AOE.

### 4.7 Liên hệ
- Facebook.
- Zalo.
- Google Maps.
- Hotline placeholder.

## 5. Yêu cầu UX/UI

- Mobile-first.
- Nhìn rõ CTA trong 3 giây đầu.
- Không quá nhiều chữ trên hero.
- Card cơ sở dễ bấm trên điện thoại.
- Bảng giá rõ, dễ so sánh.
- CTA lặp lại ở cuối trang.

## 6. Yêu cầu kỹ thuật

- Dữ liệu nằm trong `/data`.
- Type nằm trong `/types`.
- Component section nằm trong `/components/sections`.
- Component dùng lại nằm trong `/components/ui`.
- Có file service ví dụ `/services/contentService.ts` để gom data.
- Sau này có thể thay service này bằng API/Supabase.

## 7. SEO

- Title: Tiger Esports - Cyber Game cao cấp cho game thủ.
- Description: Chuỗi cyber game Tiger Esports với cấu hình mạnh, không gian hiện đại, giải đấu cộng đồng và nhiều combo hấp dẫn.
- Open Graph đầy đủ.
- sitemap.xml.
- robots.txt.

## 8. Không làm trong Phase 1

- Không backend.
- Không database.
- Không admin thật.
- Không đăng nhập.
- Không thanh toán.
- Không tích hợp Dodonew.

## 9. Tiêu chí nghiệm thu

- Trang chạy được local.
- Build thành công.
- Responsive tốt trên mobile.
- Không hardcode dữ liệu quan trọng trong component.
- Có cấu trúc dễ chuyển sang backend.
- Nội dung đúng Tiger Esports.
