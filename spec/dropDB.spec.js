var stardog = require('../js/stardog');
var qs = require('querystring');

// -----------------------------------
// Describes the listDB test methods
// -----------------------------------

describe ("Drop DBs Test Suite", function() {
	var conn;

	beforeEach(function() {
		conn = new stardog.Connection();
		conn.setEndpoint("http://localhost:5822/");
		conn.setCredentials("admin", "admin");
	});

	afterEach(function() {
		conn = null;
	});

	it ("should not drop an non-existent DB", function (done) {
		
		conn.dropDB('nodeDB_drop', function (data, response) {
			expect(response.statusCode).toBe(404);

			expect(data).toMatch('does not exist');
			done();

		});

	});

	it ("should drop a just created database", function (done) {

		conn.offlineDB('nodeDB', 'WAIT', 1, function (data, response) {
			expect(response.statusCode).toBe(200);

			conn.copyDB('nodeDB', 'nodeDB_drop', function (data, response) {
				expect(response.statusCode).toBe(200);

				// Clean just created DB.
				conn.dropDB('nodeDB_drop', function (data, response) {
					expect(response.statusCode).toBe(200);

					// set nodeDB back online
					conn.onlineDB('nodeDB', 'NO_WAIT', function (data, response) {
						expect(response.statusCode).toBe(200);

						done();
					});

					done();
				});
			});
		});
	});

});