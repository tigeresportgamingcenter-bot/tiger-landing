Bạn là senior full-stack engineer. Hãy xây dựng Phase 1 cho landing page Tiger Esports theo tài liệu PRD và AGENTS.md trong project.

Mục tiêu:
- Tạo landing page production-ready nhưng chưa dùng backend.
- Dữ liệu tĩnh nhưng kiến trúc phải backend-ready.
- Code sạch, dễ mở rộng, dễ chuyển sang Supabase ở Phase 2.

Công nghệ bắt buộc:
- Next.js App Router
- TypeScript
- TailwindCSS

Yêu cầu bắt buộc:
1. Đọc AGENTS.md và docs/PRD-phase1.md trước.
2. Trước khi viết code, hãy đưa ra kế hoạch triển khai ngắn gọn.
3. Sau khi tôi xác nhận, mới tạo/sửa file.
4. Tạo cấu trúc thư mục:
   - app/
   - components/sections/
   - components/ui/
   - data/
   - types/
   - services/
   - public/
5. Tách dữ liệu ra các file:
   - data/branches.ts
   - data/pricing.ts
   - data/pcTiers.ts
   - data/promotions.ts
   - data/tournaments.ts
   - data/socialLinks.ts
6. Tạo type/interface tương ứng trong `/types`.
7. Tạo service layer: services/contentService.ts.
8. Tạo các section:
   - HeroSection
   - BranchesSection
   - PcTiersSection
   - PricingSection
   - PromotionsSection
   - CommunitySection
   - ContactSection
   - Footer
9. Tối ưu responsive mobile-first.
10. Tạo metadata SEO trong app/layout.tsx hoặc app/page.tsx theo chuẩn Next.js.
11. Tạo sitemap và robots nếu phù hợp.
12. Tạo README hướng dẫn chạy local và deploy Vercel.
13. Chạy lint/build/type-check nếu project có script. Nếu lỗi, tự sửa.

Quy tắc quan trọng:
- Không dùng backend trong Phase 1.
- Không hardcode dữ liệu Tiger trong component.
- Không tạo admin thật.
- Không dùng dữ liệu giả gây hiểu nhầm. Nếu thiếu địa chỉ/hotline thật, dùng placeholder rõ ràng.
- Giao diện tiếng Việt.
- Phong cách gaming cao cấp, không rối chữ.

Sau khi hoàn thành, hãy báo cáo:
- File đã tạo/sửa.
- Cách chạy.
- Cách deploy.
- Những phần đang để placeholder.
- Việc cần làm ở Phase 2.
