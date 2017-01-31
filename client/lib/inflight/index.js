const inflight = new Set();

// Utility methods to track inflight async requests
export function requestInflight( requestKey ) {
	return inflight.has( requestKey );
};

export function startRequest( requestKey ) {
	inflight.add( requestKey );
}

export function endRequest( requestKey ) {
	inflight.delete( requestKey );
}

export function requestTracker( requestKey, callback ) {
	inflight.add( requestKey );
	return function( error, data ) {
		inflight.delete( requestKey );
		callback( error, data );
	};
}

export function dedupedRequest( requestKey, callback ) {
	if ( inflight.has( requestKey ) ) {
		return;
	}

	return requestTracker( requestKey, callback );
}
