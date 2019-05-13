Báo điện tử TH16 - News
===

## Thành viên

- 1612421 Nguyễn Ngọc Nghĩa
- 1612424 Đặng Ngọc Nghĩa
- 1612425 Tạ Đăng Hiếu Nghĩa


## Project

- [Source](./source)

# Front-end

### 1. Guest
- [x] Hệ thống Menu - Tìm kiếm bài viết ( Tạ Đăng Hiếu Nghĩa )
- [x] Trang chủ ( Tạ Đăng Hiếu Nghĩa )
- [x] Xem danh sách bài viết ( Tạ Đăng Hiếu Nghĩa )
- [x] Xem chi tiết bài viết ( Đặng Ngọc Nghĩa )
### 2. Subcriber
### 3. Writer
- [x] Đăng bài viết ( Nguyễn Ngọc Nghĩa )
- [x] Xem danh sách bài viết - Hiệu chỉnh bài viết ( Nguyễn Ngọc Nghĩa )
### 4. Editor
- [x] Danh sách bài viết `draft` theo chuyên mục quản lý ( Nguyễn Ngọc Nghĩa )
### 5. Administrator 
- [x] Quản lý chuyên mục `category` ( Đặng Ngọc Nghĩa )
- [x] Quản lý nhãn `tag` ( Đặng Ngọc Nghĩa )
- [x] Quản lý bài viết (  Nguyễn Ngọc Nghĩa )
- [x] Quản lý danh sách người dùng ( Tạ Đăng Hiếu Nghĩa )

### Yêu cầu chi tiết

- [Link yêu cầu xây dựng ứng dụng Báo điện tử TH16-News](https://github.com/nndkhoa/ptudw.th16.23/wiki/Project?fbclid=IwAR0XgmrDTz7867gToSEW5MQ82UbrM-hO6MmIqFyaSdhuqV7EBzfHD9lT_oo#l%C6%B0u-%C3%BD-b%C3%A0i-vi%E1%BA%BFt-hi%E1%BB%83n-th%E1%BB%8B-tr%C3%AAn-trang-ch%E1%BB%A7-g%E1%BB%93m-c%C3%A1c-th%C3%B4ng-tin) - Thầy Ngô Ngọc Đăng Khoa


Phase I - Back-end Database ( 7/5 - 21/5 )
===

## Tìm hiểu chung
- MVC
- Framework: `expressjs`
- View Engine: `handlebars`
- Database: `mongoDB`

## Modify
- Chỉnh file HTML -> Handlebars
- Tổ chức express js

## Design DB 
- Design DB Newspaper
- Design DB Users

## Code

### 1. DB Utils
- [ ] CRUD News
- [ ] CRUD Users
### 2. Các tính năng chung cho các phân hệ người dùng
- [ ] Đăng nhập
  - Tự cài đặt
  - Hoặc sử dụng `passportjs` (http://www.passportjs.org)
  - _Khuyến khích_ cài đặt thêm chức năng đăng nhập qua Google, Facebook, Twitter, Github, ...

- [ ] Cập nhật thông tin cá nhân
  - Họ tên
  - Bút danh (trong trường hợp là `writer`)
  - Email liên lạc
  - Ngày tháng năm sinh

- [ ] Đổi mật khẩu
  - Mật khẩu được mã hoá bằng thuật toán `bcrypt`

- [ ] Quên mật khẩu
  - Yêu cầu xác nhận bằng email OTP

### 3. Phân hệ phóng viên - `writer`

- [ ] Đăng bài viết
  - Hỗ trợ `WYSIWYG`
    - ckeditor (https://ckeditor.com)
    - quilljs (https://quilljs.com)
  - Hỗ trợ upload hình ảnh & link YouTube trong bài viết
  - Khi đăng bài, phóng viên chỉ nhập tiêu đề, tóm tắt, nội dung, chuyên mục & gán nhãn cho bài viết

- [ ] Xem danh sách bài viết (do phóng viên viết)
  - Đã được duyệt & chờ xuất bản
  - Đã xuất bản
  - Bị từ chối
  - Chưa được duyệt

- [ ] Hiệu chỉnh bài viết
  - Chi được phép hiệu chỉnh các bài viết `bị từ chối` hoặc `chưa được duyệt`


## Ghi chú
