# crown-marketing

Monorepo chứa các website giới thiệu tĩnh của Crown (mỗi đơn vị một subdomain).

## Cấu trúc

```
crown-marketing/
├── shared/           # CSS/JS/assets dùng chung (tách dần từ các site)
├── sites/
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
2. **Root Directory** (Settings): `sites/esg`, `sites/audit`, …
3. **Build command:** để trống (HTML tĩnh).
4. Gắn **Custom domain** tương ứng từng project.

Khuyến nghị **Ignored Build Step** (mỗi project) — chỉ build khi site đó hoặc `shared/` thay đổi:

```sh
# Ví dụ project ESG (đặt trong Vercel → Settings → Ignored Build Step)
bash scripts/should-build.sh sites/esg
```

## Trạng thái site

| Thư mục   | Subdomain            | Nội dung        |
|-----------|----------------------|-----------------|
| `esg`     | `esg.crown.com.vn`   | Landing đầy đủ  |
| `audit`   | `audit.crown.com.vn` | Placeholder     |
| `cons`    | `cons.crown.com.vn`  | Placeholder     |
| `acc`     | `acc.crown.com.vn`   | Placeholder     |
| `tax`     | `tax.crown.com.vn`   | Placeholder     |
| `fas`     | `fas.crown.com.vn`   | Placeholder     |

## Phát triển local

Mở trực tiếp `sites/<tên>/index.html` trên trình duyệt, hoặc:

```sh
npx --yes serve sites/esg
```
# crown-marketing
