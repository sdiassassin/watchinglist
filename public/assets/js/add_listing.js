
function validationListing() {

    var price = $('#price').val();
    var model = $('#model').val();
    var brand = $('#brand_select_box .select-box-custom-selected').text();
    var isBox = $('#box_yes').prop('checked');
    var isCertificated = $('#certificate_yes').prop('checked');
    var gender = $('#gender_select_box .select-box-custom-selected').text();
    var movement = $('#movement_select_box .select-box-custom-selected').text();
    var case_size = $('#case_size_select_box .select-box-custom-selected').text();
    var condition = $('#condition_select_box .select-box-custom-selected').text();
    var case_material = $('#case_material').val();
    var strap_material = $('#strap_material').val();
    var description = $('#description').val();
    var age = $('#age').val();


    var username = $('#username').val();
    var user_phone = $('#user_phone').val();
    var contact_email = $('#contact_email').val();
    var user_location = $('#user_location').val();

    if(price == ""){
        $('#price').addClass('value_error');
        alert('Empty Price');
        return;
    }else{
        $('#price').removeClass('value_error');
    }
    if(model.trim().length == 0) {
        $('#model').addClass('value_error');
        alert('Empty Model Name');
        return;
    }else{
        $('#model').removeClass('value_error');
    }

    if(age.trim().length == 0) {
        $('#age').addClass('value_error');
        alert('Empty Age Name');
        return;
    }else{
        $('#model').removeClass('value_error');
    }

    if(description.trim().length == 0) {
        $('#description').addClass('value_error');
        alert('Empty Description');
        return;
    }else{
        $('#description').removeClass('value_error');
    }

    if(brand.trim() == "Please choose a brand") {
        $('#brand_select_box .select-box-custom-selected').addClass('value_error');
        alert('Empty Brand');
        return;
    }else{
        $('#brand_select_box .select-box-custom-selected').removeClass('value_error');
    }

    if(case_size.trim() == "Please choose an option") {
        $('#case_size_select_box .select-box-custom-selected').addClass('value_error');
        alert('Empty Case Size');
        return;
    }else{
        $('#case_size_select_box .select-box-custom-selected').removeClass('value_error');
    }

    if(condition.trim() == "Please choose an option") {
        $('#condition_select_box .select-box-custom-selected').addClass('value_error');
        alert('Empty Condition');
        return;
    }else{
        $('#condition_select_box .select-box-custom-selected').removeClass('value_error');
    }

    if(gender.trim() == "Please choose an option") {
        $('#gender_select_box .select-box-custom-selected').addClass('value_error');
        alert('Empty Gender');
        return;
    }else{
        $('#gender_select_box .select-box-custom-selected').removeClass('value_error');
    }

    if(movement.trim() == "Please choose an option") {
        $('#movement_select_box .select-box-custom-selected').addClass('value_error');
        alert('Empty Movement');
        return;
    }else{
        $('#movement_select_box .select-box-custom-selected').removeClass('value_error');
    }

    if(username.trim() == "" || user_phone.trim() == "" || contact_email.trim() == "" || user_location.trim() == ""){
        alert("Please Fill Personal Info Correctly");
        return;
    }

    if(selectedFiles.length>6){
        alert('Select up to 6 photos');
        return;
    }

    if(selectedFiles.length == 0){
        alert('Empty photos');
        return;
    }

    $.ajax({
        url:'/add-listing',
        type:'post',
        dataType:'json',
        data:{
            price:price,
            model:model,
            is_box:isBox,
            brand:brand,
            is_cert:isCertificated,
            gender:gender,
            movement:movement,
            case_size:case_size,
            case_material:case_material,
            strap_material:strap_material,
            description:description,
            age:age,
            condition:condition,
            thumbnails:selectedFiles,
            contact_name:username,
            contact_phone:user_phone,
            contact_email:contact_email,
            location:user_location,
        },
        success:function (res) {
            if(res.status == 'success'){
                location.href = "/add-listing-promote";
            }else{
                alert("Something Went Wrong");
                console.log(res);
            }
        }
    })
}
