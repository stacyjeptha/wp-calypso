/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import { isRequestingCountries } from '../is-requesting-countries';
import { SMS, DOMAIN, PAYMENT } from 'state/countries/constants';
const state = {
	countries: {
		items: {
			[ DOMAIN ]: [
				{ code: 'US', name: 'United States' }
			],
			[ PAYMENT ]: [],
			[ SMS ]: []
		},
		isRequesting: {
			[ DOMAIN ]: false,
			[ PAYMENT ]: false,
			[ SMS ]: true
		}
	}
};

describe( 'isRequesting()', () => {
	it( 'should return false if the country there is no active request', () => {
		const isRequesting = isRequestingCountries( state, DOMAIN );

		expect( isRequesting ).to.eql( false );
	} );

	it( 'should return true if a request is in progress', () => {
		const isRequesting = isRequestingCountries( state, SMS );

		expect( isRequesting ).to.eql( true );
	} );
} );
