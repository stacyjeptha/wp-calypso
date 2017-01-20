/**
 * External dependencies
 */
import { combineReducers } from 'redux';

/**
 * Internal dependencies
 */
import { SMS, DOMAIN, PAYMENT } from './constants';
import {
	COUNTRIES_RECEIVE,
	COUNTRIES_REQUEST,
	COUNTRIES_REQUEST_FAILURE,
	COUNTRIES_REQUEST_SUCCESS
} from 'state/action-types';
import { itemsSchema } from './schema';
import { createReducer } from 'state/utils';


function createTypedReducer( type ) {
	return createReducer( [], {
		[ COUNTRIES_RECEIVE ]: ( state, { listType, countries } ) => {
			if ( type !== listType ) {
				return state;
			}
			return countries;
		}
	}, itemsSchema );
}


function createIsRequestingReducer( type ) {
	function makeHandler( value ) {
		return function( state, { listType } ) {
			if ( listType === type ) {
				return value;
			}
			return state;
		};
	}
	return createReducer( false, {
		[ COUNTRIES_REQUEST ]: makeHandler( true ),
		[ COUNTRIES_REQUEST_FAILURE ]: makeHandler( false ),
		[ COUNTRIES_REQUEST_SUCCESS ]: makeHandler( false )
	} );
}

const smsItemsReducer = createTypedReducer( SMS );
const domainItemsReducer = createTypedReducer( DOMAIN );
const paymentItemsReducer = createTypedReducer( PAYMENT );

export const items = combineReducers( {
	[ SMS ]: smsItemsReducer,
	[ DOMAIN ]: domainItemsReducer,
	[ PAYMENT ]: paymentItemsReducer
} );

const smsIsRequestingReducer = createIsRequestingReducer( SMS );
const domainIsRequestingReducer = createIsRequestingReducer( DOMAIN );
const paymentIsRequestingReducer = createIsRequestingReducer( PAYMENT );

export const isRequesting = combineReducers( {
	[ SMS ]: smsIsRequestingReducer,
	[ DOMAIN ]: domainIsRequestingReducer,
	[ PAYMENT ]: paymentIsRequestingReducer
} );

export default combineReducers( {
	isRequesting,
	items
} );
