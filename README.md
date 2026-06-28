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
