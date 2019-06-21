
$('#file').change(handleChangeFile);

function handleChangeAvatar() {
  $('#file').click();
}

function handleChangeFile() {
  if (this.files && this.files[0]) {
      var reader = new FileReader();
      reader.onload = (e) => {
          $('#avatar').attr('src', e.target.result);
          console.log(this.files[0].type);
      };

      reader.readAsDataURL(this.files[0]);
  }
}

// Chỉ chấp nhận file .jpg, .png
function validateImage(file) {
    if(!file) {
        return false;
    }

    if (file.type === 'image/jpeg' || file.type === 'image/png') {
        return true;
    }

    return false;
}

function handleSubmitPost(urlHandle) {
    const title = $('#title').val();
    const abstract = $('#abstract').val();
    const content = $('#content').val();
    const avatar = $('#file').prop('files')[0];
    const categorySub = $('#categorySub').val();
    const arrayOfTags = $('#arrayOfTags').val();
    const oldBigAvatar = $('#oldBigAvatar').val();
    const oldSmallAvatar = $('#oldSmallAvatar').val();
    const _articleID = $('#_articleID').val();
    const mode = $('#mode').val();
    

    if (!title) {
        alert('Tiêu đề bài viết không được để trống');
        return false;
    }

    if (!abstract) {
        alert('Tóm tắt nội dung bài viết không được để trống');
        return false;
    }

    if (!content) {
        alert('Nội dung bài viết không được để trống');
        return false;
    }

    if (!validateImage(avatar) && mode === 'create') {
        alert('Ảnh đại diện phải là ảnh jpg hoặc png');
        return false;
    }

    if (!categorySub) {
        alert('Danh mục không được để trống');
        return false;
    }

    if (arrayOfTags.length === 0) {
        alert('Tag không được để trống');
        return false;
    }

    $('#submit').prop('disabled', true);
    var data = new FormData();

    if (oldBigAvatar) {
        data.append('oldBigAvatar', oldBigAvatar);
        data.append('oldSmallAvatar', oldSmallAvatar);
        data.append('_articleID', _articleID);
    }
    
    data.append('title', title);
    data.append('abstract', abstract);
    data.append('content', content);
    data.append('categorySub', categorySub);
    data.append('arrayOfTags', JSON.stringify(arrayOfTags));
    
    
    if (avatar) {
        data.append('avatar', avatar);
    }
    fetch(urlHandle, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'CSRF-Token': $('#_csrf').val() // <-- is the csrf token as a header
        },
        body: data
    }).then(res => {
        if (res.status === 200) {
            mode === 'create' ? window.location.href = '/user/writer/post' : window.location.href = `/user/writer/post/${_articleID}`;
        } else {
            alert('Submit bài viết thất bại, thử lại sau.');
        }
    }).catch(err => {
        alert('Submit bài viết thất bại, thử lại sau.');
    }).finally(() => {
        $('#submit').prop('disabled', false);
    });
}

function handleSubmitPost2(urlHandle) {
    const title = $('#title').val();
    const abstract = $('#abstract').val();
    const content = $('#content').val();
    const avatar = $('#file').prop('files')[0];
    const categorySub = $('#categorySub').val();
    const arrayOfTags = $('#arrayOfTags').val();
    const oldBigAvatar = $('#oldBigAvatar').val();
    const oldSmallAvatar = $('#oldSmallAvatar').val();
    const _articleID = $('#_articleID').val();
    const mode = $('#mode').val();
    

    if (!title) {
        alert('Tiêu đề bài viết không được để trống');
        return false;
    }

    if (!abstract) {
        alert('Tóm tắt nội dung bài viết không được để trống');
        return false;
    }

    if (!content) {
        alert('Nội dung bài viết không được để trống');
        return false;
    }

    if (!validateImage(avatar) && mode === 'create') {
        alert('Ảnh đại diện phải là ảnh jpg hoặc png');
        return false;
    }

    if (!categorySub) {
        alert('Danh mục không được để trống');
        return false;
    }

    if (arrayOfTags.length === 0) {
        alert('Tag không được để trống');
        return false;
    }

    $('#submit').prop('disabled', true);
    var data = new FormData();

    if (oldBigAvatar) {
        data.append('oldBigAvatar', oldBigAvatar);
        data.append('oldSmallAvatar', oldSmallAvatar);
        data.append('_articleID', _articleID);
    }
    
    data.append('title', title);
    data.append('abstract', abstract);
    data.append('content', content);
    data.append('categorySub', categorySub);
    data.append('arrayOfTags', JSON.stringify(arrayOfTags));
    
    if (avatar) {
        data.append('avatar', avatar);
    }
    fetch(urlHandle, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'CSRF-Token': $('#_csrf').val() // <-- is the csrf token as a header
        },
        body: data
    }).then(res => {
        if (res.status === 200) {
            mode === 'create' ? window.location.href = `/user/admin/post` : window.location.href = `/user/admin/edit/${_articleID}`;
        } else {
            alert('Submit bài viết thất bại, thử lại sau.');
        }
    }).catch(err => {
        alert('Submit bài viết thất bại, thử lại sau.');
    }).finally(() => {
        $('#submit').prop('disabled', false);
    });
}

function openApproveModal() {
    $('#approveModal').modal();
}

function handleApprove(id) {
    const date = $('#date').val();
    const time = $('#time').val();
    const tags = $('#arrayOfTags').val();
    const datetime = new Date(date + " " + time);
    
    if (!date || !time) {
        alert('Ngày hoặc thời gian không hợp lệ.');
        return false;
    }

    if (tags.length === 0) {
        alert('Hãy chọn ít nhất một tag');
        return false;
    }

    const data = {
        tags: tags,
        category: $('#categorySub').val(),
        postDate: datetime,
        id: id
    };

    $('#save').prop('disabled', true);
    $('#cancel').prop('disabled', true);

    fetch('/user/admin/approve', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'CSRF-Token': $('#_csrf').val() // <-- is the csrf token as a header
        },
        body: JSON.stringify(data)
    }).then(res => {
        if (res.status === 200) {
            window.location.href = "/user/admin/edit/"+id;
        } else {
            alert('Duyệt bài viết thất bại, thử lại sau.');
        }
    }).catch(err => {
        alert('Duyệt thất bại thử lại sau');
    }).finally(() => {
        $('#save').prop('disabled', false);
        $('#cancel').prop('disabled', false);
        $('#cancel').click();
    });
}