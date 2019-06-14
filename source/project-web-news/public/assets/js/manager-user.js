var name = $('#name').val();
var pseudonym = $('#pseudonym').val();
var date = $('#date').val();
var year = $('#year').val();
var month = $('#month').val();
var phoneNumber = $('#phoneNumber').val();
var avatar = $('#avatar').attr('src');
var email = $('#email').val();
var role = $('#role').children()

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

    fetch('/user/admin/manager-user/profile/avatar', {
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

function handleUpdateInfo() {
    $('#name').prop('readonly', false);
    $('#date').prop('readonly', false);
    $('#month').prop('readonly', false);
    $('#year').prop('readonly', false);
    $('#pseudonym').prop('readonly', false);
    $('#phoneNumber').prop('readonly', false);
    $('#update').prop('hidden', true);
    $('#save').prop('hidden', false);
    $('#cancel').prop('hidden', false);
}

function handleCancelUpateInfo() {

    $('#name').val(name);
    $('#date').val(date);
    $('#month').val(month);
    $('#year').val(year);
    $('#pseudonym').val(pseudonym);
    $('#phoneNumber').val(phoneNumber);
    
    $('#name').prop('readonly', true);
    $('#date').prop('readonly', true);
    $('#month').prop('readonly', true);
    $('#year').prop('readonly', true);
    $('#pseudonym').prop('readonly', true);
    $('#phoneNumber').prop('readonly', true);
    $('#update').prop('hidden', false);
    $('#save').prop('hidden', true);
    $('#cancel').prop('hidden', true);
}