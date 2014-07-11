$('#load').submit(function (e) {
  $.ajax({
    url: '/list/load',
    type: 'post',
    data: new FormData(this),
    processData: false,
    contentType: false
  });
  e.preventDefault();
});

$('input[type="file"]').on('change', function() {
  alert();
});