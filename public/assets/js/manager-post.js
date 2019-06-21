function deleteArticle(id) {
    const yes = confirm('Bạn có chắc muốn xóa bài viết này ?');
    
    if (!yes) {
        return yes;
    }

    var data = {
        id:  id
    };
    
    fetch('/user/admin/delete-article', {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'CSRF-Token': $('#_csrf').val() // <-- is the csrf token as a header
        },
        body: JSON.stringify(data)
    }).then(res => {
        console.log(res);
        window.location.href = '/user/admin/manager-post';
    }).catch(err => {
        console.log(err);
        alert('Xóa thất bại, thử lại sau');
    });
}