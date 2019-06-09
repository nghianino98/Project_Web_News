var email = $('#email').val();

function handleUpdateInfo() {
    //$('#email').prop('disabled', false);
}

function onDoubleClickEmail() {
    $('#email').prop('disabled', false);
    $('#emailSaveBtn').prop('hidden', false);
    $('#emailCanelBtn').prop('hidden', false);
}

function onClickEmailCancelBtn() {
    const $email = $('#email');

    $email.val(email);
    $email.prop('disabled', true);
    $('#emailSaveBtn').prop('hidden', true);
    $('#emailCanelBtn').prop('hidden', true);
}

function onClickEmailSaveBtn() {
    const $email = $('#email');
    email = $email.val();

    $email.prop('disabled', true);
    $('#emailSaveBtn').prop('hidden', true);
    $('#emailCanelBtn').prop('hidden', true);
}