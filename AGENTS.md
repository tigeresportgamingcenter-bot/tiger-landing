# AGENTS.md - Quy tắc cho Codex

## Ngôn ngữ
- Giao diện người dùng bằng tiếng Việt.
- Tên biến, tên file, tên component bằng tiếng Anh rõ nghĩa.

## Công nghệ
- Next.js App Router.
- TypeScript strict mode.
- TailwindCSS.
- Không dùng Bootstrap.
- Không dùng backend trong Phase 1.
- Không dùng database trong Phase 1.

## Thiết kế
- Phong cách gaming cao cấp, hiện đại.
- Tông màu chính: đen, đỏ, cam neon, trắng.
- Giao diện sạch, không rối chữ.
- Ưu tiên mobile-first.
- Không lạm dụng hiệu ứng nặng.

## Kiến trúc
- Dữ liệu phải nằm trong `/data`.
- Type/interface phải nằm trong `/types`.
- UI section phải nằm trong `/components/sections`.
- UI dùng lại phải nằm trong `/components/ui`.
- Không hardcode bảng giá, cơ sở, cấu hình, khuyến mãi trực tiếp trong component.
- Tạo service layer tối thiểu để sau này thay data static bằng backend dễ dàng.

## SEO
- Có metadata chuẩn.
- Có title, description, Open Graph.
- Có sitemap.xml.
- Có robots.txt.
- Nội dung tối ưu cho từ khóa cyber game, phòng máy, esports, game thủ tại Thanh Hóa/Sầm Sơn nếu phù hợp.

## Chất lượng code
- Không để code chết.
- Không để console.log không cần thiết.
- Không tạo file thừa.
- Component ngắn, dễ đọc.
- Sau khi hoàn thành phải chạy:
  - npm run lint
  - npm run type-check nếu có
  - npm run build
- Nếu lỗi, tự sửa đến khi build được.

## Không làm trong Phase 1
- Không làm đăng nhập admin thật.
- Không làm Supabase.
- Không làm PostgreSQL.
- Không làm thanh toán.
- Không thu thập dữ liệu nhạy cảm.
- Không làm dashboard nội bộ.
