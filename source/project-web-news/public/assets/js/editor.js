function openApproveModal() {
    $('#approveModal').modal();
}

function handleApprove(id) {
    const date = $('#date').val();
    const time = $('#time').val();
    const tags = $('#tag').val();
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
        category: $('#category').val(),
        postDate: datetime,
        id: id
    };

    // $('#save').prop('disabled', true);
    // $('#cancel').prop('disabled', true);

    fetch('/user/editor/approve', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'CSRF-Token': $('#_csrf').val() // <-- is the csrf token as a header
        },
        body: JSON.stringify(data)
    }).then(res => {
        if (res.status === 200) {
            window.location.href = "/user/editor/waiting"
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