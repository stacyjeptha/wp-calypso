/**
 * Internal dependencies
 */
import {
	ACCOUNT_RECOVERY_RESET_OPTIONS_ERROR,
	ACCOUNT_RECOVERY_RESET_OPTIONS_RECEIVE,
	ACCOUNT_RECOVERY_RESET_OPTIONS_REQUEST,
} from 'state/action-types';

const fetchResetOptions = ( userData ) => {
	return {
		type: ACCOUNT_RECOVERY_RESET_OPTIONS_REQUEST,
		userData,
	};
};

export const fetchResetOptionsByLogin = ( user ) => {
	return fetchResetOptions( { user } );
};

export const fetchResetOptionsByNameAndUrl = ( firstname, lastname, url ) => {
	return fetchResetOptions( { firstname, lastname, url } );
};

export const fetchResetOptionsSuccess = ( options ) => {
	return {
		type: ACCOUNT_RECOVERY_RESET_OPTIONS_RECEIVE,
		options,
	};
};

export const fetchResetOptionsError = ( error ) => {
	return {
		type: ACCOUNT_RECOVERY_RESET_OPTIONS_ERROR,
		error,
	};
};
