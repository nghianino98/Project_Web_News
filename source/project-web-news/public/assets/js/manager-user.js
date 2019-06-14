var name = $('#name').val();
var pseudonym = $('#pseudonym').val();
var date = $('#date').val();
var year = $('#year').val();
var month = $('#month').val();
var phoneNumber = $('#phoneNumber').val();
var avatar = $('#avatar').attr('src');
var email = $('#email').val();
var role = $('#role').children('option:selected').val();

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
    data.append('id', $('#id').val());

    fetch('/user/admin/manager-user/profile/avatar', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'CSRF-Token': $('#_csrf').val() // <-- is the csrf token as a header
        },
        body: data
    }).then(res => {
<<<<<<< HEAD
        if (res.status == 200) {
            alert('Cập nhật ảnh đại diện thành công');
            return res.json();
        } else {
            alert('Cập nhật ảnh đại diện thất bại. Thử lại sau');
        }
    }).then(data => {
        avatar = data.avatar;
        $('#avatar').attr('src', data.avatar);
=======
        return res.json();
    }).then(data => {
        console.log(data);
        avatar = data.avatar;
        $('#avatar').attr('src', data.avatar);
        alert('Cập nhật ảnh đại diện thành công');
>>>>>>> master
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
    $('#email').prop('readonly', false);
    $('#role').prop('disabled', false);
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
    $('#email').val(email);
    $('#role').val(role);
    
    $('#name').prop('readonly', true);
    $('#date').prop('readonly', true);
    $('#month').prop('readonly', true);
    $('#year').prop('readonly', true);
    $('#pseudonym').prop('readonly', true);
    $('#phoneNumber').prop('readonly', true);
    $('#email').prop('readonly', true);
    $('#role').prop('disabled', true);
    $('#update').prop('hidden', false);
    $('#save').prop('hidden', true);
    $('#cancel').prop('hidden', true);
}

function validateForm() {
    if(!validateEmail()) {
        return false;
    }

    if (!validateDate()) {
        return false;
    }

    return true;
}

function validateDate() {
    const dd = +$('#date').val();
    const mm = +$('#month').val();
    const yy = +$('#year').val();

    if (isNaN(dd) || isNaN(mm) || isNaN(yy)) {
        alert('Ngày sinh không hợp lệ');
        return false;
    }
    // Create list of days of a month [assume there is no leap year by default]
    var ListofDays = [31,28,31,30,31,30,31,31,30,31,30,31];

    if (mm < 1 || mm > 12) {
        alert('Ngày sinh không hợp lệ');
        return false;
    }

    if (mm !== 2) {
        if (dd>ListofDays[mm-1]) {
            alert('Ngày sinh không hợp lệ');
            return false;
        }
    } else {
        var lyear = false;

        if ( !((yy % 4) && (yy % 100)) || !(yy % 400)) {
            lyear = true;
        }

        if ((lyear == false) && ((dd > 28) || (dd < 1))) {
            alert('Thời gian không hợp lệ');
            return false;
        }
    
        if (dd < 1 || dd > 29) {
            alert('Thời gian không hợp lệ');
            return false;
        }
    }

    return true;
}

function validateEmail() {
    const email = $('#email').val();
    const parttern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    
    if (!parttern.test(email)){
        alert('Email không hợp lệ');
        return false;
    }

    return true;
<<<<<<< HEAD
}

function validatePassword() {
    const $changePassword = $('#changePassword');
    $changePassword.prop('disabled', true);

    const newPassword = $('#newPassword').val();
    const retype = $('#retype').val();
    const parttern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{4,15}$/;

    if (!parttern.test(newPassword)){
        $changePassword.prop('disabled', false);
        alert('Mật khẩu phải 4-15 ký tự bao gồm : [a-z], [A-Z], [0-9], _ và có ít nhất 1 ký tự hoa, 1 ký tự thường, 1 ký tự số.');
        return false;
    }

    if (newPassword !== retype) {
        $changePassword.prop('disabled', false);
        alert('Mật khẩu nhập lại không chính xác');
        return false;
    } 

    return true;
}

function openChangePwModel() {
    $('#changePwModel').modal();
}

function handleChangePassword() {
    if (!validatePassword()) {
        return false;
    }

    $('#savePw').prop('disabled', true);
    $('#cancelChangePw').prop('disabled', true);
    var data = {
        id:  $('#id').val(),
        newPassword: $('#newPassword').val()
    };

    fetch('/user/admin/manager-user/profile/change-password', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'CSRF-Token': $('#_csrf').val() // <-- is the csrf token as a header
        },
        body: JSON.stringify(data)
    }).then(res => {
        if (res.status === 200) {
            alert('Đổi mật khẩu thành công');
        } else {
            alert('Thay đổi mật khẩu thất bại thử lại. Thử lại sau');
        }
    }).catch(err => {
        alert('Thay đổi mật khẩu thất bại thử lại. Thử lại sau');
    }).finally(() => {
        $('#savePw').prop('disabled', false);
        $('#cancelChangePw').prop('disabled', false);
        $('#cancelChangePw').click();
        $('#newPassword').val(null);
        $('#retype').val(null);
    })
=======
>>>>>>> master
}