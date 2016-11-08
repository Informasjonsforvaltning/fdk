console.log("TestAdmin");
$('#loader').hide();

// Get security headers
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

$('form').on('submit', function (e) {
    e.preventDefault();

    var reader = new FileReader(),
        file = $('#resume')[0];


    if (!file.files.length) {
        alert('no file uploaded');
        return false;
    }
    reader.fileName = file.files[0].name;

    reader.onload = function (event) {
        var data = reader.result;
            //base64 = data.replace(/^[^,]*,/, ''),

        var info = {
           filename: event.target.fileName ,
           data: data
        };

        console.log(event.target.fileName);

        $('#loader').show();

        $.ajax({
            url: "load",
            type: "POST",
            dataType: "JSON",
            data: info,
            success: function (response) {
                console.log("SUCCESS: ");
                console.log(response);
                alert("SUCCESS: " + response.success);
                $('#loader').hide();
            },
            error: function (response) {
                console.log(response);

                $('#loader').hide();

                var validationElement = document.getElementById("validation");
                // delete old rows
                while (validationElement.firstChild) {
                    validationElement.removeChild(validationElement.firstChild);
                }

                if (response.responseText) {
                    alert(response.status);
                    response.responseText.split("\n").forEach(function (element) {
                        var status;
                        if (element.indexOf("validation_warning") !== -1) status = "list-group-item-warning";
                        else if (element.indexOf("validation_error") !== -1) status = "list-group-item-danger";
                        else status ="list-group-item-info";

                        $('#validation').append('<li class="list-group-item '+status + '">' + element + '</li>');
                    });

                }

            }
        });
    };

    reader.readAsDataURL(file.files[0]);
});

