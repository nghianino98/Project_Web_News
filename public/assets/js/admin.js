function update(categoryid, categoryname) {
    document.getElementById("category_name_update").value = categoryname;
    document.getElementById("categoryID_update").value = categoryid;
}

function updateCategorySub(categoryid, categoryname) {
    document.getElementById("categorysub_name").value = categoryname;
    document.getElementById("categorySubID").value = categoryid;
}

function deleteCategory(categoryid, categoryname) {
    document.getElementById("content_delete").textContent = "Bạn có chắc chắn xóa chuyên mục \"" + categoryname + "\" ?";
    document.getElementById("deleteId").href = "/user/admin/manager-category/delete/category/" + categoryid;
}

function deleteCategorySub(categoryid, categoryname) {
    document.getElementById("content_delete_sub").textContent = "Bạn có chắc chắn xóa chuyên mục \"" + categoryname + "\" ?";
    document.getElementById("deleteSubId").href = "/user/admin/manager-category/delete/categorysub/" + categoryid;
}

function updateTag(id, name) {
    document.getElementById("tagnameUpdate").value = name;
    document.getElementById("tagid").value = id;
}

function deleteTag(id, name) {
    document.getElementById("content_delete").textContent = "Bạn có chắc chắn xóa tag \"" + name + "\" ?";
    document.getElementById("deleteTagId").href = "/user/admin/manager-tag/delete/" + id;
}