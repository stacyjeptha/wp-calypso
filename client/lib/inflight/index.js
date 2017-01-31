const inflight = new Set();

// Utility methods to track inflight async requests
export default {
	requestInflight: function( requestKey ) {
		return inflight.has( requestKey );
	},

	startRequest: function( requestKey ) {
		inflight.add( requestKey );
	},

	endRequest: function( requestKey ) {
		inflight.delete( requestKey );
	},

	requestTracker: function( requestKey, callback ) {
		inflight.add( requestKey );
		return function( error, data ) {
			inflight.delete( requestKey );
			callback( error, data );
		};
	},
};
