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
    success: function (res) {
      console.log(res);
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

var currentTrack = function () {
  $.ajax({
    url: '/controll/track',
    type: 'get',
    success: function (res) {
      $('.track').html(res.data);
    }
  });
};

currentTrack();
setInterval(function () {
  currentTrack();
}, 2000);

$('button[data-toggle="tooltip"]').tooltip();