
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
    data.append('arrayOfTags', arrayOfTags);
    
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