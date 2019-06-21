function handleChangePassword(form) {
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