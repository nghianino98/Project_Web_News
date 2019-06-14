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


Phase I - Back-end Database
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
- [Thiết kế các Collections](./MongoDBDesign.md)
## Code

### 1. DB Utils
- [ ] CRUD News 
- [ ] CRUD Users 
### 2. Các tính năng chung cho các phân hệ người dùng
- [x] Đăng nhập ( `Nguyen` )
  - Tự cài đặt
  - Hoặc sử dụng `passportjs` (http://www.passportjs.org)
  - _Khuyến khích_ cài đặt thêm chức năng đăng nhập qua Google, Facebook, Twitter, Github, ...

- [x] Cập nhật thông tin cá nhân ( `Nguyen` )
  - Họ tên
  - Bút danh (trong trường hợp là `writer`)
  - Email liên lạc
  - Ngày tháng năm sinh

- [ ] Đổi mật khẩu ( `Nguyen` )
  - Mật khẩu được mã hoá bằng thuật toán `bcrypt`

- [ ] Quên mật khẩu ( `Nguyen` )
  - Yêu cầu xác nhận bằng email OTP

### 3. Phân hệ phóng viên - `writer`

- [x] Đăng bài viết ( `Ta` )
  - Hỗ trợ `WYSIWYG`
    - ckeditor (https://ckeditor.com)
    - quilljs (https://quilljs.com)
  - Hỗ trợ upload hình ảnh & link YouTube trong bài viết
  - Khi đăng bài, phóng viên chỉ nhập tiêu đề, tóm tắt, nội dung, chuyên mục & gán nhãn cho bài viết

- [x] Xem danh sách bài viết (do phóng viên viết) ( `Ta` )
  - Đã được duyệt & chờ xuất bản
  - Đã xuất bản
  - Bị từ chối
  - Chưa được duyệt

- [x] Hiệu chỉnh bài viết ( `Ta` )
  - Chi được phép hiệu chỉnh các bài viết `bị từ chối` hoặc `chưa được duyệt`

Phase II - Bussiness ( Deadline 9/6 )
===

## 1. Phân hệ độc giả vãng lai - guest

### Hệ thống Menu ( `Ta` )

- [ ] Hiển thị danh sách chuyên mụ
Lưu ý:
  - Có 2 cấp chuyên mục
      - Kinh Doanh > Nông Sản
      - Kinh Doanh > Hải Sản
- [ ] Trang chủ 
  - Hiển thị 3-4 bài viết nổi bật nhất trong tuần qua
  - Hiển thị 10 bài viết được xem nhiều nhất (mọi chuyên mục)
  - Hiển thị 10 bài viết mới nhất (mọi chuyên mục)
  - Hiển thị top 10 chuyên mục, mỗi chuyên mục 1 bài mới nhất

    Lưu ý: Bài viết hiển thị trên trang chủ gồm các thông tin
    - Tiêu đề
    - Chuyên mục
    - Ngày đăng
    - Ảnh đại diện bài viết


    Khuyến khích hiệu ứng ở trang chủ
    - slideshow
    - carousel

### Xem danh sách bài viết ( `Dang` )
  - Theo chuyên mục category
  - Theo nhãn tag
  - Có phân trang

    Lưu ý: Bài viết hiển thị trên trang danh sách gồm các thông tin
    - Ảnh đại diện bài viết
    - Tiêu đề
    - Chuyên mục
    - Danh sách nhãn tag
    - Ngày đăng
    - Nội dung tóm tắt abstract

### Xem chi tiết bài viết ( `Dang` )

- Nội dung đầy đủ của bài viết
    - Ảnh đại diện (size lớn)
    - Tiêu đề
    - Ngày đăng
    - Nội dung
    - Chuyên mục category
    - Danh sách nhãn tag

- Danh sách bình luận của độc giả

    - Ngày bình luận
    - Tên độc giả
    - Nội dung bình luận
  
- Đăng bình luận mới
- 5 bài viết cùng chuyên mục


`Lưu ý: Độc giả có thể click vào category hoặc tag để chuyển nhanh sang phần XEM DANH SÁCH BÀI VIẾT`

### Tìm kiếm bài viết ( `Ta` )
Sử dụng kỹ thuật Full-text search

- Tiêu đề
- Nội dung tóm tắt abstract
- Nội dung đầy đủ

## 2. Phân hệ độc giả - subscriber ( `Dang` )

- Độc giả có đăng ký tài khoản (thực tế là mua) sẽ được phép xem & `download` ấn bản (.pdf) một số bài viết premium.
- Tài khoản độc giả có thời hạn 7 ngày, tính từ ngày được cấp.
- Khi hết hạn, tài khoản độc giả cần được gia hạn để có thể tiếp tục truy cập các bài viết premium.
- Các bài viết premium được ưu tiên hiển thị trước trong kết quả khi độc giả thực hiện chức năng xem danh sách hoặc tìm kiếm bài viết.

## 4. Phân hệ biên tập viên - editor ( `Nguyen` )

- Biên tập viên khi làm việc sẽ xem được danh sách bài viết draft do phóng viên đăng vào chuyên mục do mình quản lý.

- Tại đây, biên tập viên có thể duyệt hoặc từ chối bài viết của phóng viên

  - Nếu từ chối, biên tập viên cần ghi chú rõ lý do để phóng viên có thể hiệu chỉnh lại bài viết cho phù hợp

  - Nếu duyệt, biên tập viên cần hiệu chỉnh các thông tin: chuyên mục category, nhãn tag của bài viết, đồng thời xác định thời điểm bài viết sẽ được xuất bản lên hệ thống

## 5. Phân hệ quản trị viên - administrator

`Lưu ý: Quản lý bao gồm các thao tác Xem danh sách, Xem chi tiết, Thêm, Xoá, Cập nhật và các thao tác chuyên biệt khác`

- [ ] ( `Dang` )Quản lý chuyên mục category 
- [ ] ( `Nguyen` )Quản lý bài viết
  - Có thể cập nhật trạng thái bài viết từ draft sang xuất bản
- [ ] ( `Ta` ) Quản lý danh sách người dùng (phóng viên, biên tập viên, độc giả, ...)
  - Phân công chuyên mục cho biên tập viên
  - Gia hạn tài khoản độc giả

Phase III (Deadline 18/6)
===

Hoàn thiện các tính năng

## Ghi chú
