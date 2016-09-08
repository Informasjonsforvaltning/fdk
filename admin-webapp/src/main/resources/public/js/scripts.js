var sendRequest = function(method, url, data) {

	clearErrors();

	var request = new XMLHttpRequest();
	request.open(method, url, true);
	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			// Success!
			location.reload();
		} else {
			// We reached our target server, but it returned an error
			var exception = request.responseText;
			handleException(exception);
		}
	};
	request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	if (data) {
		request.send(JSON.stringify(data));
	} else {
		request.send();
	}
};

var clearErrors = function() {
	var errors = document.getElementById('errors');
	errors.textContent = '';
	errors.style.display = 'none';
};

var handleException = function(errors) {
	console.log('errors', errors);
	var json = JSON.parse(errors);
	if (json.error && json.message) {
		var errors = document.getElementById('errors');
		errors.textContent = json.error + ': ' + json.message;
		errors.style.display = '';
	}
};