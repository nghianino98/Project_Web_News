jQuery(function ($) {

    $(".sidebar-dropdown > a").click(function() {
  $(".sidebar-submenu").slideUp(200);
  if (
    $(this)
      .parent()
      .hasClass("active")
  ) {
    $(".sidebar-dropdown").removeClass("active");
    $(this)
      .parent()
      .removeClass("active");
  } else {
    $(".sidebar-dropdown").removeClass("active");
    $(this)
      .next(".sidebar-submenu")
      .slideDown(200);
    $(this)
      .parent()
      .addClass("active");
  }
});

$("#close-sidebar").click(function() {
  $(".page-wrapper").removeClass("toggled");
});
$("#show-sidebar").click(function() {
  $(".page-wrapper").addClass("toggled");
});


   
   
});

function deleteArticle(id) {
  const yes = confirm('Bạn có chắc muốn xóa bài viết này ?');
  
  if (!yes) {
      return yes;
  }

  var data = {
      id:  id
  };
  console.log($('#_csrf').val());

  fetch('/user/admin/delete-article', {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'CSRF-Token': $('#_csrf').val() // <-- is the csrf token as a header
      },
      body: JSON.stringify(data)
  }).then(res => {
      console.log("res"+res);
      window.location.href = '/user/admin/manager-post';
  }).catch(err => {
    console.log(err);
      alert('Xóa thất bại, thử lại sau');
  });
}

function deleteArticleByWriter(id) {
  const yes = confirm('Bạn có chắc muốn xóa bài viết này ?');
  
  if (!yes) {
      return yes;
  }

  var data = {
      id:  id
  };
  console.log($('#_csrf').val());

  fetch('/user/writer/delete-article', {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'CSRF-Token': $('#_csrf').val() // <-- is the csrf token as a header
      },
      body: JSON.stringify(data)
  }).then(res => {
      console.log("res"+res);
      window.location.href = '/user/writer/notApproved';
  }).catch(err => {
    console.log(err);
      alert('Xóa thất bại, thử lại sau');
  });
}