/* globals $:false */

var input = $('input[type="file"]');

input.on('change', function (e) {
  var form = new FormData();
  form.append('playlist', this.files[0]);

  $.ajax({
    url: '/list/load',
    type: 'post',
    data: form,
    cache: false,
    processData: false,
    contentType: false,
    success: function (data) {
      console.log(data);
    }
  });
  e.preventDefault();
});

$('.controll-buttons button').on('click', function () {
  $.ajax({
    url: '/controll/' + this.name,
    type: 'get'
  });
  this.blur();
});

$('.list-buttons button').on('click', function () {
  $.ajax({
    url: '/list/' + this.name,
    type: 'get'
  });
  this.blur();
});

$('button[data-toggle="tooltip"]').tooltip();