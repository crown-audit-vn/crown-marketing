# crown-marketing

Monorepo chứa các website giới thiệu tĩnh của Crown (mỗi đơn vị một subdomain).

## Cấu trúc

```
crown-marketing/
├── shared/           # CSS/JS/assets dùng chung (tách dần từ các site)
├── sites/
│   ├── www/          → crown.com.vn (trang chủ tập đoàn)
│   ├── esg/          → esg.crown.com.vn
│   ├── audit/        → audit.crown.com.vn
│   ├── cons/         → cons.crown.com.vn
│   ├── acc/          → acc.crown.com.vn
│   ├── tax/          → tax.crown.com.vn
│   └── fas/          → fas.crown.com.vn
└── scripts/
```

Mỗi site là một thư mục độc lập với `index.html` ở root — phù hợp deploy static (Vercel / Cloudflare Pages).

## Deploy (Vercel — một repo, nhiều project)

1. Tạo **một Vercel project cho mỗi site**, cùng connect repo `crown-marketing`.
2. **Root Directory** (Settings): `sites/www`, `sites/esg`, `sites/audit`, …
3. **Build command:** để trống (HTML tĩnh).
4. Gắn **Custom domain** tương ứng từng project.

| Vercel Root Directory | Custom domain        |
|-----------------------|----------------------|
| `sites/www`           | `crown.com.vn`       |
| `sites/audit`         | `audit.crown.com.vn` |
| `sites/cons`          | `cons.crown.com.vn`  |
| `sites/acc`           | `acc.crown.com.vn`   |
| `sites/tax`           | `tax.crown.com.vn`   |
| `sites/fas`           | `fas.crown.com.vn`   |
| `sites/esg`           | `esg.crown.com.vn`   |

Khuyến nghị **Ignored Build Step** (mỗi project) — chỉ build khi site đó hoặc `shared/` thay đổi:

```sh
# Ví dụ project ESG (đặt trong Vercel → Settings → Ignored Build Step)
bash scripts/should-build.sh sites/esg
```

## Trạng thái site

| Thư mục   | Subdomain            | Nội dung        |
|-----------|----------------------|-----------------|
| `www`     | `crown.com.vn`       | Landing đầy đủ  |
| `esg`     | `esg.crown.com.vn`   | Landing đầy đủ  |
| `audit`   | `audit.crown.com.vn` | Landing đầy đủ  |
| `cons`    | `cons.crown.com.vn`  | Landing đầy đủ  |
| `acc`     | `acc.crown.com.vn`   | Landing đầy đủ  |
| `tax`     | `tax.crown.com.vn`   | Landing đầy đủ  |
| `fas`     | `fas.crown.com.vn`   | Landing đầy đủ  |

Nguồn HTML khách hàng: đồng bộ từ bộ file `0._Crown_homepage_1.html` … `6._Crown_ESG.html` vào `sites/<tên>/index.html`.

## Phát triển local

### Cài đặt (một lần)

```sh
npm install
```

### Xem danh sách site + port

```sh
npm run dev
```

### Chạy preview từng site

Mỗi lệnh mở HTTP server tĩnh; mở URL in ra terminal (hoặc bảng dưới) trên trình duyệt. Dừng server: `Ctrl+C`.

| Site | Lệnh | URL local |
|------|------|-----------|
| Trang chủ | `npm run dev:www` | http://localhost:5000 |
| Audit | `npm run dev:audit` | http://localhost:5001 |
| Cons (XDCB) | `npm run dev:cons` | http://localhost:5002 |
| Accounting | `npm run dev:acc` | http://localhost:5003 |
| Tax | `npm run dev:tax` | http://localhost:5004 |
| FAS | `npm run dev:fas` | http://localhost:5005 |
| ESG | `npm run dev:esg` | http://localhost:5006 |

Ví dụ:

```sh
npm run dev:acc
```

Có thể chạy **nhiều site cùng lúc** (mỗi site một terminal, port khác nhau). Link menu/footer vẫn trỏ domain production (`*.crown.com.vn`) cho tới khi deploy.

### Không dùng npm

Mở file `sites/<tên>/index.html` trực tiếp, hoặc:

```sh
npx --yes serve sites/esg -l 5006
```
