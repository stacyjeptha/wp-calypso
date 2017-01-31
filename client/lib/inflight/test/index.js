/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import inflight from '../';

const randomRequestKey = () => `${ Math.random() }`;
const THE_ANSWER = 42;

describe( 'inflight', ( ) => {
	describe( 'promiseTracker', () => {
		it( 'should mark an item as inflight while the request is ongoing', ( done ) => {
			const key = randomRequestKey();
			const trackedPromise = inflight.promiseTracker( key, Promise.resolve( THE_ANSWER ) );

			expect( inflight.requestInflight( key ) ).to.be.true;
			trackedPromise.then( () => {
				expect( inflight.requestInflight( key ) ).to.be.false;
				done();
			} );
		} );

		it( 'should return the same data as the original promise', ( done ) => {
			const key = randomRequestKey();
			const trackedPromise = inflight.promiseTracker( key, Promise.resolve( THE_ANSWER ) );

			trackedPromise.then( data => {
				expect( data ).to.equal( THE_ANSWER );
				done();
			} );
		} );
	} );
} );
