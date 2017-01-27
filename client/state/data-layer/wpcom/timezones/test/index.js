/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import { useSandbox } from 'test/helpers/use-sinon';
import useNock from 'test/helpers/use-nock';

import {
	timezonesRequestSuccessAction,
	timezonesReceiveAction,
} from 'state/timezones/actions';

import { fromApi } from 'state/data-layer/wpcom/timezones';

/*
 * Fixtures
 */
import {
	TIMEZONES_DATA,
	WP_REST_API,
} from 'state/timezones/test/fixture';

/*
 * Util functions
 */
import { requestTimezones } from '../';

describe( 'request', () => {
	let dispatch;
	useSandbox( sandbox => ( dispatch = sandbox.spy() ) );

	describe( 'successful requests', () => {
		useNock( ( nock ) => {
			nock( WP_REST_API.hostname )
				.persist()
				.get( WP_REST_API.namespace + WP_REST_API.endpoint )
				.reply( 200, TIMEZONES_DATA );
		} );

		it( 'should dispatch SUCCESS action when request completes', () => {
			const action = timezonesRequestSuccessAction();

			return requestTimezones( { dispatch } )
				.then( () => (
					expect( dispatch ).to.have.been.calledWith( action )
				) );
		} );

		it( 'should dispatch RECEIVE action when request completes', () => {
			const action = timezonesReceiveAction( fromApi( TIMEZONES_DATA ) );

			return requestTimezones( { dispatch } )
				.then( () => (
					expect( dispatch ).to.have.been.calledWith( action )
				) );
		} );
	} );
} );
