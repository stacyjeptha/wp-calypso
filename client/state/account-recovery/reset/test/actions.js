/**
 * External dependencies
 */
import { assert } from 'chai';

/**
 * Internal dependencies
 */
import {
	fetchResetOptionsByLogin,
	fetchResetOptionsByNameAndUrl,
	fetchResetOptionsSuccess,
	fetchResetOptionsError,
} from '../actions';

import {
	ACCOUNT_RECOVERY_RESET_OPTIONS_ERROR,
	ACCOUNT_RECOVERY_RESET_OPTIONS_RECEIVE,
	ACCOUNT_RECOVERY_RESET_OPTIONS_REQUEST,
} from 'state/action-types';

describe( '#fetchResetOptionsByLogin', () => {
	it( 'should return ACCOUNT_RECOVERY_RESET_OPTIONS_REQUEST action with the user field', () => {
		const user = 'foo';
		const action = fetchResetOptionsByLogin( user );

		assert.deepEqual( action, {
			type: ACCOUNT_RECOVERY_RESET_OPTIONS_REQUEST,
			userData: {
				user,
			},
		} );
	} );
} );

describe( '#fetchResetOptionsByNameAndUrl', () => {
	it( 'should return ACCOUNT_RECOVERY_RESET_OPTIONS_REQUEST action with the firstname, lastname and url fields. ', () => {
		const firstname = 'firstname';
		const lastname = 'lastname';
		const url = 'example.com';

		const action = fetchResetOptionsByNameAndUrl( firstname, lastname, url );

		assert.deepEqual( action, {
			type: ACCOUNT_RECOVERY_RESET_OPTIONS_REQUEST,
			userData: {
				firstname,
				lastname,
				url,
			},
		} );
	} );
} );

describe( '#fetchResetOptionsSuccess', () => {
	it( 'should return ACCOUNT_RECOVERY_RESET_OPTIONS_RECEIVE action with options field.', () => {
		const options = {
			primary_email: 'primary@example.com',
			secondary_email: 'secondary@example.com',
			primary_sms: '12345678',
			secondary_sms: '12345678',
		};

		const action = fetchResetOptionsSuccess( options );

		assert.deepEqual( action, {
			type: ACCOUNT_RECOVERY_RESET_OPTIONS_RECEIVE,
			options,
		} );
	} );
} );

describe( '#fetchResetOptionsError', () => {
	it( 'should return ACCOUNT_RECOVERY_RESET_OPTIONS_ERROR action with error field.', () => {
		const error = {
			status: 400,
			message: 'error!',
		};

		const action = fetchResetOptionsError( error );

		assert.deepEqual( action, {
			type: ACCOUNT_RECOVERY_RESET_OPTIONS_ERROR,
			error,
		} );
	} );
} );
