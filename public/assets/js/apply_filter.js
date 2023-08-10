var f_gender = [];
var f_brand = [];
var f_case_size = [];
var f_case_material = [];
var f_movement = [];

var f_toprice = 0;
var f_fromprice = 0;
var f_query = "";

$('#gender_filter input[type="checkbox"]').click(function () {
    var filterLabel = $(this).parent().find('label').text();
    var filterName = filterLabel.substr(0, filterLabel.indexOf('(')).trim();
    if (f_gender.indexOf(filterName) > -1) {
        f_gender.splice(f_gender.indexOf(filterName), 1);
    } else {
        f_gender.push(filterName);
    }
});

$('#brand_filter input[type="checkbox"]').click(function () {
    var filterLabel = $(this).parent().find('label').text();
    var filterName = filterLabel.substr(0, filterLabel.indexOf('(')).trim();
    if (f_brand.indexOf(filterName) > -1) {
        f_brand.splice(f_brand.indexOf(filterName), 1);
    } else {
        f_brand.push(filterName);
    }
    console.log(f_brand);
});

$('#casesize_filter input[type="checkbox"]').click(function () {
    var filterLabel = $(this).parent().find('label').text();
    var filterName = filterLabel.substr(0, filterLabel.indexOf('(')).trim();
    if (f_case_size.indexOf(filterName) > -1) {
        f_case_size.splice(f_case_size.indexOf(filterName), 1);
    } else {
        f_case_size.push(filterName);
    }
});

$('#case_material_filter input[type="checkbox"]').click(function () {
    var filterLabel = $(this).parent().find('label').text();
    var filterName = filterLabel.substr(0, filterLabel.indexOf('(')).trim();
    if (f_case_material.indexOf(filterName) > -1) {
        f_case_material.splice(f_case_material.indexOf(filterName), 1);
    } else {
        f_case_material.push(filterName);
    }
});

$('#movement_filter input[type="checkbox"]').click(function () {
    var filterLabel = $(this).parent().find('label').text();
    var filterName = filterLabel.substr(0, filterLabel.indexOf('(')).trim();
    if (f_movement.indexOf(filterName) > -1) {
        f_movement.splice(f_movement.indexOf(filterName), 1);
    } else {
        f_movement.push(filterName);
    }
});

function apply_filters() {

    var filter_gender = f_gender.join('-');
    var filter_brand = f_brand.join('-');
    var filter_case_size = f_case_size.join('-');
    var filter_case_material = f_case_material.join('-');
    var filter_movement = f_movement.join('-');

    var filter_from = $('#filter_from_price').val();
    var filter_to = $('#filter_to_price').val();

    var query = "/listings?";
    query += "gd=" + filter_gender;
    query += "&br=" + filter_brand;
    query += "&cs=" + filter_case_size;
    query += "&cm=" + filter_case_material;
    query += "&mv=" + filter_movement;
    query += "&from=" + filter_from;
    query += "&to=" + filter_to;

    location.href = query
}

function apply_search() {
    //var search =
}
