# Visual Captioning

## 📋 Overview

Visual Captioning là dự án tạo chú thích tự động cho ảnh sử dụng học sâu. Hệ thống này kết hợp các mô hình học sâu tiên tiến để phân tích hình ảnh và tạo mô tả chính xác bằng ngôn ngữ tự nhiên.

## Tính năng chính

- **Phân tích hình ảnh tự động** sử dụng các mô hình CNN và Vision Transformer
- **Tạo mô tả chính xác** bằng nhiều ngôn ngữ khác nhau
- **Giao diện web thân thiện** cho người dùng
- **Lưu trữ đám mây** để quản lý hình ảnh và mô tả
- **API RESTful** cho tích hợp với các ứng dụng khác

## Cấu trúc dự án

```
visual-captioning/
├── algorithms/             # Huấn luyện mô hình
│
│── crawling/               # Cào dữ liệu
│
└── application/            # Ứng dụng web
    ├── backend/            # API và server backend
    │   ├── app/            # Mã nguồn chính
    │   ├── Dockerfile      # Cấu hình Docker
    │   └── requirements.txt# Thư viện Python
    │
    └── frontend/           # Giao diện người dùng
        ├── src/            # Mã nguồn React
        ├── public/         # Tài nguyên tĩnh
        ├── Dockerfile      # Cấu hình Docker
        └── package.json    # Cấu hình npm
```

## Yêu cầu hệ thống

- Python 3.8+
- Node.js 16+
- Docker và Docker Compose
- MongoDB
- AWS S3

## Hướng dẫn cài đặt

### 1. Chuẩn bị cơ sở dữ liệu

#### MongoDB Cloud

1. Tạo tài khoản và cluster trên [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Tạo database và user có quyền truy cập
3. Lấy **MongoDB URI** có dạng:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```

#### AWS S3 Storage

1. Đăng ký tài khoản [AWS](https://aws.amazon.com/) nếu chưa có
2. Tạo S3 bucket mới cho lưu trữ hình ảnh
3. Tạo IAM user với quyền truy cập S3
4. Tạo và lưu **Access Key ID** và **Secret Access Key**

### 2. Clone và cấu hình dự án

```bash
# Clone repository
git clone git@github.com:anh7777/Visual-Captioning.git
cd visual-captioning

# Cấu hình backend
cd application/backend
```

Tạo file `.env` với nội dung sau:

```env
ACCESS_TOKEN_EXPIRE_MINUTES="30"
REFRESH_TOKEN_EXPIRE_DAYS="7"
JWT_SECRET_KEY="your-secret-key"
JWT_ALGORITHM="HS256"
MONGO_URI="mongodb+srv://your_mongo_user:your_mongo_password@cluster0.mongodb.net/your_db_name?retryWrites=true&w=majority"
MONGO_DB_NAME="your_db_name"
AWS_ACCESS_KEY="YOUR_AWS_ACCESS_KEY_ID"
AWS_SECRET_KEY="YOUR_AWS_SECRET_ACCESS_KEY"
BUCKET_NAME="your_s3_bucket_name"
```

> **Lưu ý**: Thay thế các giá trị mẫu bằng thông tin thực của bạn.

### 3. Triển khai với Docker

```bash
# Quay lại thư mục gốc
cd ../

# Build Docker images
docker-compose build

# Khởi chạy ứng dụng
docker-compose up
```

Sau khi triển khai thành công:
- Backend API: http://localhost:8000
- Frontend: http://localhost:3000

### 4. Triển khai thủ công

#### Backend

```bash
cd application/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend

```bash
cd application/frontend
npm install
npm start
```

## Triển khai từ Docker Hub

Nếu bạn muốn sử dụng Docker image có sẵn:

```bash
# Pull image backend và frontend
docker pull your-dockerhub-username/visual-captioning-backend
docker pull your-dockerhub-username/visual-captioning-frontend

# Chạy container
docker run -d -p 8000:8000 --env-file .env --name backend marknguyen02/visual-captioning-backend
docker run -d -p 3000:3000 --name frontend marknguyen02/visual-captioning-frontend
```

## Đóng góp

Chúng tôi hoan nghênh mọi đóng góp cho dự án! Hãy làm theo các bước sau:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/amazing-feature`)
3. Commit thay đổi (`git commit -m 'Add some amazing feature'`)
4. Push lên branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request
