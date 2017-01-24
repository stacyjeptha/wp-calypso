/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
/**
 * Internal dependencies
 */
import {
	TIMEZONES_RECEIVE,
	TIMEZONES_REQUEST,
	TIMEZONES_REQUEST_SUCCESS
} from 'state/action-types';

import {
	timezonesRequestAction,
	timezonesRequestSuccessAction,
	timezonesReceiveAction,
} from '../actions';

import { fromApi } from 'state/data-layer/wpcom/timezones';

/**
 * Fixture data
 */
import {
	MANUAL_UTC_OFFSETS,
	TIMEZONES_BY_CONTINENT,
	TIMEZONES_DATA,
} from './fixture';

describe( 'actions', () => {
	describe( 'creators functions', () => {
		it( '#timezonesRequestAction()', () => {
			expect( timezonesRequestAction() ).to.eql( {
				type: TIMEZONES_REQUEST
			} );
		} );

		it( '#timezonesRequestSuccessAction()', () => {
			expect( timezonesRequestSuccessAction() ).to.eql( {
				type: TIMEZONES_REQUEST_SUCCESS
			} );
		} );

		it( '#timezonesReceiveAction()', () => {
			expect( timezonesReceiveAction( fromApi( TIMEZONES_DATA ) ) ).to.eql( {
				type: TIMEZONES_RECEIVE,
				rawOffsets: MANUAL_UTC_OFFSETS,
				timezonesByContinent: TIMEZONES_BY_CONTINENT
			} );
		} );
	} );
} );
