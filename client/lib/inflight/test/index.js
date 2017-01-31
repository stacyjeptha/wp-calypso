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
		it( 'should mark an item as inflight while the request is ongoing', () => {
			const key = randomRequestKey();
			const trackedPromise = inflight.promiseTracker( key, Promise.resolve( THE_ANSWER ) );

			expect( inflight.requestInflight( key ) ).to.be.true;
			return trackedPromise.then( () => {
				expect( inflight.requestInflight( key ) ).to.be.false;
			} );
		} );

		it( 'should return the same data as the original promise', () => {
			const key = randomRequestKey();
			const trackedPromise = inflight.promiseTracker( key, Promise.resolve( THE_ANSWER ) );

			return trackedPromise.then( data => {
				expect( data ).to.equal( THE_ANSWER );
			} );
		} );
	} );
} );
