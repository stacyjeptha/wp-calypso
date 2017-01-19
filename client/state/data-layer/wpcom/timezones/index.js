/**
 * Internal dependencies
 */
import wpcom from 'lib/wp';

import { TIMEZONES_REQUEST } from 'state/action-types';

import {
	timezonesRequestSuccessAction,
	timezonesRequestFailureAction,
	timezonesReceiveAction,
} from 'state/timezones/actions';

/**
 * Normalize data gotten from the REST API making them more Calypso friendly.
 *
 * @param {Object} data - REST-API response
 * @return {Object} normalized timezones data.
 */
export const fromApi = ( { manual_utc_offsets, timezones_by_continent } ) => ( {
	rawOffsets: manual_utc_offsets,
	timezonesByContinent: timezones_by_continent
} );

/*
 * Start a request to WordPress.com server to get the timezones data
 */
export const requestTimezones = ( { dispatch } ) => (
	wpcom.req.get( '/timezones', { apiNamespace: 'wpcom/v2' } )
		.then( data => {
			dispatch( timezonesRequestSuccessAction() );
			dispatch( timezonesReceiveAction( fromApi( data ) ) );
		} )
		.catch( error => {
			dispatch( timezonesRequestFailureAction( error ) );
		} )
);

export default {
	[ TIMEZONES_REQUEST ]: [ requestTimezones ],
};
