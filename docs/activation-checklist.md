# Checklist kích hoạt Tiger Esports Admin CMS

Checklist này chỉ dùng Supabase Publishable key. Không nhập, lưu hoặc triển khai `service_role` key trong source code, Vercel hay trình duyệt.

## 1. Migration Supabase

Chạy lần lượt trong Supabase SQL Editor:

1. `supabase/migrations/20260628_phase2a.sql`
2. `supabase/migrations/20260628_phase2a_hardening.sql`
3. `supabase/migrations/20260629_phase2b_tournaments_and_pc_tiers.sql`
4. `supabase/migrations/20260629_phase2b_media_video.sql`
5. `supabase/migrations/20260629_phase2b_tournament_operations.sql`
6. `supabase/migrations/20260630_phase2b_admin_ux_media_tournaments_promotions.sql`

Sau khi chạy xong, kiểm tra có các bảng:

- `admin_users`
- `branches`
- `promotions`
- `tournaments`
- `hall_of_fame_members`
- `site_images`
- `gallery_items`
- `pc_tiers`

Storage bucket cần có:

- `hero`
- `branches`
- `community`
- `hall-of-fame`
- `members`
- `videos`

## 2. Admin user

1. Vào Supabase → Authentication → Users → Add user.
2. Tạo tài khoản admin bằng email của chủ quán.
3. Copy UUID của user.
4. Chạy:

```sql
insert into public.admin_users (user_id)
values ('UUID_CUA_USER');
```

## 3. Vercel Environment Variables

Thêm cho Production và Preview:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL=https://DOMAIN_PRODUCTION
```

Không thêm `service_role` key.

## 4. Quy tắc nhập nội dung Admin

- Không nhập JSON ở bất kỳ module vận hành nào.
- Khuyến mãi: nhập Điểm nổi bật 1–5, hệ thống tự lưu thành `highlights`.
- Giải đấu: nhập Top 1/2/3 bằng ba ô riêng, hệ thống tự lưu thành `placements`.
- Tổng kết giải đấu: nhập Khoảnh khắc nổi bật 1–5, hệ thống tự lưu thành `highlights`.
- Hội viên chỉ bật public khi `consent_confirmed = true`.
- Nội dung public chỉ hiển thị khi `published = true` và `verified = true`.

## 5. Kiểm thử production

- Landing page trả HTTP 200.
- `/admin/dashboard` yêu cầu đăng nhập.
- Upload ảnh/video thành công.
- Draft không xuất hiện ngoài public.
- Published nhưng chưa verified không xuất hiện ngoài public.
- Khuyến mãi hết hạn không xuất hiện ngoài landing chính.
- Giải `completed` chỉ vào Hall of Fame nếu bật `show_in_hall_of_fame`.

## 6. Trước khi go-live

Chạy:

```bash
npm run lint
npm run type-check
npm run build
npm audit
```

Chỉ nhập dữ liệu thật đã xác minh. Không xóa dữ liệu production nếu không chắc chắn.
