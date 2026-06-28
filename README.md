# Tiger Esports Landing Page — Phase 1

Landing page production-ready cho chuỗi cyber game Tiger Esports. Phase 1 dùng dữ liệu tĩnh và không có backend/database, nhưng tổ chức qua service layer để dễ nâng cấp ở Phase 2.

## Công nghệ

- Next.js App Router, TypeScript strict, TailwindCSS
- Dữ liệu trong `data/`, type trong `types/`, truy cập qua `services/contentService.ts`
- SEO metadata, Open Graph động, sitemap và robots

## Chạy local

Yêu cầu Node.js 20 trở lên.

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000). Kiểm tra trước khi bàn giao:

```bash
npm run lint
npm run type-check
npm run build
```

## Deploy Vercel

1. Đẩy source lên GitHub, GitLab hoặc Bitbucket.
2. Import repository vào Vercel với framework preset Next.js.
3. Thêm `NEXT_PUBLIC_SITE_URL` bằng domain production đầy đủ, ví dụ `https://tigeresports.vn`.
4. Deploy; Vercel sẽ tự chạy `npm run build`.

## Dữ liệu cần cập nhật trước khi phát hành

- Giờ hoạt động từng cơ sở trong `data/branches.ts`.
- Xác nhận lại fanpage nếu thương hiệu thay đổi đường dẫn trong tương lai.
- Cấu hình, giá và điều kiện khuyến mãi thực tế theo từng cơ sở.
- Domain production qua `NEXT_PUBLIC_SITE_URL` và ảnh thật khi có tài nguyên thương hiệu.

Không thay placeholder bằng dữ liệu giả. Kênh chưa có dữ liệu hiển thị “Đang cập nhật” và không tạo liên kết giả.

## Phase 2A — Supabase Admin

Checklist kích hoạt đầy đủ: [`docs/activation-checklist.md`](docs/activation-checklist.md).

Kiểm tra readiness mà không in giá trị secret:

```bash
npm run check:phase2a
```

### 1. Tạo project

1. Tạo project mới tại [Supabase Dashboard](https://supabase.com/dashboard).
2. Mở **SQL Editor**, chạy các migration theo thứ tự:
   - `supabase/migrations/20260628_phase2a.sql`
   - `supabase/migrations/20260628_phase2a_hardening.sql`
3. Migration tạo database, RLS policies và 5 bucket ảnh public. Public chỉ được đọc dữ liệu đã `published` và `verified`.

### 2. Cấu hình môi trường

Sao chép `.env.example` thành `.env.local`, sau đó lấy URL và Publishable key tại **Project Settings → API**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Không dùng hoặc đưa `service_role` key vào frontend. Nếu chưa khai báo hai biến Supabase, website tự dùng dữ liệu tĩnh.

### 3. Tạo admin

1. Vào **Authentication → Users → Add user**, tạo user bằng email và mật khẩu.
2. Sao chép UUID của user.
3. Chạy trong SQL Editor:

```sql
insert into public.admin_users (user_id)
values ('UUID_CUA_USER');
```

4. Mở `/admin/login`, đăng nhập bằng tài khoản vừa tạo.

### 4. Upload và sử dụng ảnh

1. Trong `/admin/dashboard`, chọn bucket phù hợp.
2. Nhập khóa ảnh và alt text, chọn JPEG/PNG/WebP tối đa 5MB rồi upload.
3. Ảnh mới được lưu ở trạng thái chưa xuất bản/chưa xác minh.
4. Trong mục **Ảnh website**, kiểm tra URL, bật cả **Đang hiển thị** và **Đã xác minh**.
5. Dùng khóa `hero-main` cho hero hoặc `community-tournament` cho ảnh giải đấu cộng đồng. Với cơ sở/combo/giải đấu/hội viên, sao chép public URL sang trường URL ảnh của bản ghi tương ứng.

### 5. Quy tắc xuất bản

- Cơ sở, combo, giải đấu, ảnh và gallery: cần `published = true` và `verified = true`.
- Hội viên: cần thêm `consent_confirmed = true`.
- Dashboard không lưu số điện thoại, tài khoản hoặc số tiền nạp của hội viên.
- Thay đổi dashboard gọi revalidation; public page cũng tự kiểm tra lại dữ liệu tối đa sau 60 giây.
- Gallery chỉ xuất hiện trên landing khi có ít nhất một ảnh đã published và verified.
- Migration hardening ngăn nội dung mới được publish nếu chưa verified; hội viên còn bắt buộc consent.
