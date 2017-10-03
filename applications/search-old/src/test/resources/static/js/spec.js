describe("App", function() {

	beforeEach(module('hello'));

    var $controller;
	beforeEach(inject(function($injector) {
		$controller = $injector.get('$controller');
	}));

	it("loads a controller", function() {
		var controller = $controller('home')
	});

}