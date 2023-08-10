
function deleteUser(userId){
    swal({
        title: "Please Confirm",
        text: "Are you sure that you want to delete this User?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "rgba(243, 57, 35, 0.85)",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
    }, function(){
        location.href = "/admin/users/delete/" + userId;
    });
}
