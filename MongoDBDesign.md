MongoDB Design
===

Các collections:

## Collection Articles

Ví dụ một định dạng các trường của một document trong Articles:

```json
{
    "Title" : "Tiêu đề bài báo",
    "Content": "Nội dung bài báo",
    "Abstract": "Nội dung tóm tắt bài báo",
    "WriteDate": "Ngày Writer viết bài báo - DateTime",
    "Writer": "Người Writer viết bài báo",
    "Editor": "Người Editor đã duyệt hoặc từ chối",
    "Status": "Trạng thái bài viết",
    "ReasonForRefusing":"Lý do từ chối của Editor",
    "PostDate":"Ngày giờ đăng nối xuất bản - DateTime",
    "CategoryMain":"Chuyên mục cha của bài viết",
    "CategorySub":"Chuyên mục con của bài viết",
    "Views": "Số lượt xem bài viết - Định dạng number",
    "SmallAvatar":"",
    "BigAvatar":"",
    "ArrayOfTags":["idTag1","idTag2"],
    "isPremiumArticle":"Bài viết Premimum?",
    "Comments":[
        {
            "CommentDate":" Ngày đăng comment - DateTime ",
            "Name":"Tên hiển thị",
            "CommentContent":"Nội dung comment",
            "Account":"Nếu đã đăng nhập",
            "Email":"Nếu là guest"
        }
        {
            "CommentDate":" Ngày đăng comment - DateTime ",
            "Name":"Tên hiển thị",
            "CommentContent":"Nội dung comment",
            "Account":"Nếu đã đăng nhập",
            "Email":"Nếu là guest"
        }
    ],
}
```

## Collection Accounts
Ví dụ một định dạng các trường của một document trong Accounts:

```json
{
    "Email":"abcxyz@gmail.com",
    "Password":"",
    "UserName":"",
    "Pseudonym":"Bút danh nếu là Writer",
    "DOB":"Ngày sinh",
    "Role":"Phân quyền",
    "ExpirationDate": "Thời điểm hết hạn - DateTime",
    "CategoryEditor": "Chuyên mục quản lý nếu là Editor" 
}
```
`Trường ExpirationDate chỉ có hoặc khác null khi là Subcriber, trường CategoryEditor chỉ có hoặc khác null khi là Editor, trường Psseudonym chỉ có khi là Writer`
## Collection CategoriesMain
Ví dụ một định dạng các trường của một document trong Categories:
```json
{
    "CategoryMainName":"Tên chuyên mục",
    "ArrayOfArticles":["ArticleID1","ArticleID2"],
    "ArrayOfCategorySub":["CategoryID1","CategoryID2"]
}
```

## Collection CategoriesSub
Ví dụ một định dạng các trường của một document trong Categories:
```json
{
    "CategorySubName":"Tên chuyên mục",
    "ArrayOfArticles":["ArticleID1","ArticleID2"],
    "CategoryMain": "CategoryMain"
}
```

`Trường ArrayOfCategorySub chỉ có khi là chuyên mục cha`
## Collection Tags
Ví dụ một định dạng các trường của một document trong Tags:
```json
{
    "TagName":"Tên tag",
    "ArrayOfArticles":["ArticleID1","ArticleID2"]
}
```

