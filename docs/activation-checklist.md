# Checklist kích hoạt Phase 2A — Tiger Esports Admin CMS

Checklist này chỉ dùng Publishable key. Không nhập, lưu hoặc triển khai `service_role` key trong project.

## A. Chuẩn bị Supabase

- [ ] Đăng nhập tài khoản chủ sở hữu tại [Supabase Dashboard](https://supabase.com/dashboard).
- [ ] Tạo project production, chọn region phù hợp và lưu database password ở password manager.
- [ ] Mở **SQL Editor** và chạy toàn bộ `supabase/migrations/20260628_phase2a.sql`.
- [ ] Chạy tiếp `supabase/migrations/20260628_phase2a_hardening.sql`.
- [ ] Xác nhận Table Editor có: `admin_users`, `branches`, `promotions`, `tournaments`, `hall_of_fame_members`, `site_images`, `gallery_items`.
- [ ] Xác nhận Storage có: `hero`, `branches`, `community`, `hall-of-fame`, `members`.
- [ ] Xác nhận RLS đang bật trên tất cả bảng public.

Kiểm tra nhanh trong SQL Editor:

```sql
select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public'
order by tablename;

select id, name, public
from storage.buckets
where id in ('hero','branches','community','hall-of-fame','members');
```

## B. Tạo tài khoản admin

- [ ] Vào **Authentication → Users → Add user**.
- [ ] Tạo user bằng email riêng của chủ quán và mật khẩu mạnh.
- [ ] Sao chép UUID của user, không sao chép access token.
- [ ] Chạy lệnh sau trong SQL Editor:

```sql
insert into public.admin_users (user_id)
values ('UUID_CUA_USER');
```

- [ ] Kiểm tra UID đã có trong `public.admin_users`.

## C. Cấu hình local

- [ ] Sao chép `.env.example` thành `.env.local`.
- [ ] Điền Project URL và Publishable key từ **Project Settings → API**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- [ ] Không thêm `service_role`, database password hoặc access token.
- [ ] Chạy `npm run check:phase2a`.
- [ ] Nếu máy có Git, chạy `git check-ignore .env.local`; kết quả phải trả về `.env.local`.
- [ ] Chạy `git status --short` và xác nhận `.env.local` không xuất hiện.
- [ ] Chạy `npm run dev`, mở `/admin/login` và đăng nhập.

## D. Kiểm thử Admin CMS

- [ ] Tạo một cơ sở ở trạng thái draft; xác nhận landing chưa hiển thị.
- [ ] Bật `verified` nhưng chưa bật `published`; xác nhận landing chưa hiển thị.
- [ ] Bật cả `verified` và `published`; xác nhận landing hiển thị sau tối đa 60 giây.
- [ ] Upload một ảnh WebP/JPEG/PNG dưới 5MB.
- [ ] Kiểm tra ảnh mới xuất hiện trong **Ảnh website** ở trạng thái draft.
- [ ] Bật verified và published cho ảnh thử.
- [ ] Dùng khóa `hero-main` để thử ảnh hero hoặc `community-tournament` cho ảnh cộng đồng.
- [ ] Tạo một hội viên chưa consent; xác nhận landing không hiển thị.
- [ ] Chỉ bật consent sau khi có sự đồng ý thực tế của khách.
- [ ] Thử sửa, bật/tắt và xóa một bản ghi thử; xác nhận hộp thoại trước khi xóa.

## E. Cấu hình Vercel

- [ ] Vào **Project → Settings → Environment Variables**.
- [ ] Thêm `NEXT_PUBLIC_SUPABASE_URL` cho Preview và Production.
- [ ] Thêm `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` cho Preview và Production.
- [ ] Thêm `NEXT_PUBLIC_SITE_URL` bằng domain production chính xác.
- [ ] Không thêm `service_role` key.
- [ ] Redeploy từ commit đã kiểm tra.
- [ ] Mở deployment logs và xác nhận build thành công.

## F. Kiểm thử production

- [ ] Landing page trả HTTP 200.
- [ ] `/admin/dashboard` chuyển về `/admin/login` khi chưa đăng nhập.
- [ ] Admin đăng nhập thành công.
- [ ] Upload ảnh thử thành công.
- [ ] Nội dung draft không xuất hiện public.
- [ ] Nội dung published nhưng chưa verified không xuất hiện public.
- [ ] Hội viên thiếu consent không xuất hiện public.
- [ ] Tắt Supabase env trên một preview riêng và xác nhận landing fallback static, không crash.
- [ ] Kiểm tra CTA Facebook, Zalo, hotline và Maps không thay đổi.

## G. Trước khi go-live

- [ ] Chạy `npm run lint`.
- [ ] Chạy `npm run type-check`.
- [ ] Chạy `npm run build`.
- [ ] Chạy `npm audit`.
- [ ] Chỉ nhập dữ liệu thật đã xác minh.
- [ ] Xóa bản ghi thử, nhưng không xóa dữ liệu production ngoài phạm vi kiểm thử.
