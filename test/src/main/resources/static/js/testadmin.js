console.log("TestAdmin");

$(function () {
  var token = $("meta[name='_csrf']").attr("content");
  var header = $("meta[name='_csrf_header']").attr("content");
  $(document).ajaxSend(function(e, xhr, options) {
    xhr.setRequestHeader(header, token);
  });
});

// Bind click to OK button within popup
$('#confirm-delete').on('click', '.btn-ok', function(e) {

  console.log("delete pressed");

  var $modalDiv = $(e.delegateTarget);
  var id = $(this).data('recordId');

  $modalDiv.addClass('loading');

  var token = $("meta[name='_csrf']").attr("content");
  var header = $("meta[name='_csrf_header']").attr("content");

  $.ajax({
      url: '/esdata',
      type: 'DELETE',
      success: function(result) {
          // Do something with the result
          $modalDiv.modal('hide').removeClass('loading');
          console.log("Deleted");
      }
  });

});

