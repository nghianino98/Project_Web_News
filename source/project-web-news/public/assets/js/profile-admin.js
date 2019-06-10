var email = $('#email').val();
var avatar = $('#avatar').attr('src');

$('#file').change(handleChangeFile);

function handleChangeAvatar() {
    $('#file').click();
}

function handleChangeFile() {
    if (this.files && this.files[0]) {
        var reader = new FileReader();
        reader.onload = (e) => {
            $('#avatar').attr('src', e.target.result);
            $('#save-avatar-btn').prop('hidden', false);
            $('#cancel-avatar-btn').prop('hidden', false);
            $('#save-avatar-btn').prop('disabled', false);
            $('#cancel-avatar-btn').prop('disabled', false);
        };

        reader.readAsDataURL(this.files[0]);
    }
}

function handleSaveAvatar() {
    $('#save-avatar-btn').prop('disabled', true);
    $('#cancel-avatar-btn').prop('disabled', true);
    var data = new FormData();
    data.append('file', $('#file').prop('files')[0]);

    fetch('/user/profile/avatar', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'CSRF-Token': $('#_csrf').val() // <-- is the csrf token as a header
        },
        body: data
    }).then(res => {
        return res.json();
    }).then(data => {
        console.log(data);
        avatar = data.avatar;
        $('#avatar').attr('src', data.avatar);
        $('#avatar-sidebar').attr('src', data.avatar);
        alert('Cập nhật ảnh đại diện thành công');
    }).catch(err => {
        alert('Cập nhật ảnh đại diện thất bại. Thử lại sau');
    }).finally(() => {
        $('#save-avatar-btn').prop('hidden', true);
        $('#cancel-avatar-btn').prop('hidden', true);
    })
}

function handleCancelChangeAvatar() {
    $('#avatar').attr('src', avatar);
    $('#save-avatar-btn').prop('hidden', true);
    $('#cancel-avatar-btn').prop('hidden', true);
}