/**
 * External dependencies
 */
import { combineReducers } from 'redux';

/**
 * Internal dependencies
 */
import { createReducer } from 'state/utils';
import {
	DESERIALIZE,
	SERIALIZE,

	TIMEZONES_RECEIVE,
	TIMEZONES_REQUEST,
	TIMEZONES_REQUEST_FAILURE,
	TIMEZONES_REQUEST_SUCCESS,
} from 'state/action-types';
import {
	rawOffsetsSchema,
	timezonesSchema
} from './schema';

const offsets = createReducer( [], {
	[ TIMEZONES_RECEIVE ]: ( state, { rawOffsets = [] } ) => rawOffsets.slice( 0 )
}, rawOffsetsSchema );

const timezones = createReducer( {}, {
	[ TIMEZONES_RECEIVE ]: ( state, { timezonesByContinent } ) => ( timezonesByContinent )
}, timezonesSchema );

export const items = combineReducers( {
	rawOffsets: offsets,
	timezonesByContinent: timezones,
} );

/**
 * Track the timezones requesting process
 *
 * @param  {Object} state - current state
 * @param  {Object} action - action payload
 * @return {Object} updated state
 */
export const requesting = ( state = false, action ) => {
	switch ( action.type ) {
		case TIMEZONES_REQUEST:
		case TIMEZONES_REQUEST_SUCCESS:
		case TIMEZONES_REQUEST_FAILURE:
			return action.type === TIMEZONES_REQUEST;

		case SERIALIZE:
		case DESERIALIZE:
			return false;
	}

	return state;
};

export default combineReducers( {
	items,
	requesting,
} );
