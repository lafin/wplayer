/* globals $:false */

var input = $('input[type="file"]');
var isTouchDevice = 'ontouchstart' in document.documentElement;

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

var eventType = isTouchDevice ? 'touchstart' : 'click';

$('.controll button').on(eventType, function () {
  $.ajax({
    url: '/controll/' + this.name,
    type: 'get'
  });
  this.blur();
});

$('.list button').on(eventType, function () {
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

if (!isTouchDevice) {
  $('button[data-toggle="tooltip"]').tooltip();
}
