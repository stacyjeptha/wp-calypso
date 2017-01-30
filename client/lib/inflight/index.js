const inflight = new Set();

// Utility methods to track inflight async requests
module.exports = {
	requestInflight: function( requestKey ) {
		return inflight.has( requestKey );
	},

	requestTracker: function( requestKey, callback ) {
		inflight.add( requestKey );

		return function( err, data ) {
			inflight.delete( requestKey );
			callback( err, data );
		};
	},

	trackPromise: function( requestKey, promise ) {
		inflight.add( requestKey );
		promise.then(
			() => {
				inflight.delete( requestKey );
			},
			() => {
				inflight.delete( requestKey );
			}
		);
		// return the original promise so any subsequent thens don't flow through our handlers
		return promise;
	}
};
