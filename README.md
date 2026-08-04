# MM88 - Landing Page Cổng Link Tổng

Landing page cao cấp phong cách resort vịnh Singapore tích hợp quả cầu 3D Three.js, thanh thông báo nổ hũ jackpot, hệ thống đánh giá động và tự động định tuyến liên kết theo domain tên miền trên Cloudflare Pages.

## Tính năng chính

- **3D Globe Animation**: Nền quả cầu 3D hiệu ứng champagne gold & emerald render bằng Three.js.
- **Dynamic Domain Routing**: Tự động nhận diện hostname, kết nối qua `domains.json` và Cloudflare Pages Worker (`_worker.js`).
- **Interactive Minigame Slot**: Vòng quay may mắn nổ hũ tăng tỷ lệ trúng thưởng cho người dùng.
- **Review System**: Hệ thống đánh giá & nhận xét linh hoạt kèm lưu trữ `localStorage`.
- **Responsive Layout**: Giao diện tối ưu hóa cho cả Desktop và Mobile.

## Cấu trúc thư mục

```
├── index.html          # Trang chủ landing page
├── styles.css          # Core CSS styling
├── config.js           # Xử lý định tuyến link theo domain
├── redirect-links.js   # Binds URL vào tất cả các nút CTA & Quả cầu các nước
├── globe-scene.js      # Three.js 3D Globe background
├── jackpot-ticker.js   # Ticker thông báo nổ hũ
├── review-system.js    # Hệ thống review & rating
├── domains.json        # Database định tuyến domain -> target_url
├── _worker.js          # Cloudflare Pages Serverless Worker Handler
├── flags/              # Thư mục cờ các quốc gia
├── logo-mm88.png       # Logo chính MM88
└── favicon.ico         # Icon trang web
```
