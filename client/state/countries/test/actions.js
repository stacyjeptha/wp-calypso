/**
 * External dependencies
 */
import sinon from 'sinon';
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import {
	COUNTRIES_RECEIVE,
	COUNTRIES_REQUEST,
	COUNTRIES_REQUEST_SUCCESS,
	COUNTRIES_REQUEST_FAILURE
} from 'state/action-types';
import {
	requestDomainRegistrationSupportedCountries,
	requestPaymentSupportCountries,
	requestSMSSupportCountries
} from '../actions';
import { DOMAIN, SMS, PAYMENT } from '../constants';
import useNock from 'test/helpers/use-nock';
import { useSandbox } from 'test/helpers/use-sinon';

function raise( error ){
	throw error;
}

describe( 'actions', () => {
	let spy;
	useSandbox( ( sandbox ) => spy = sandbox.spy() );
	let countries;
	beforeEach( () => {
		countries = [
			{ code: 'US', name: 'United States' },
			{ code: 'IN', name: 'India' }
		];
	} );

	describe( '#requestDomainRegistrationSupportedCountries', () => {
		describe( 'success', () => {
			useNock( nock => {
				nock( 'https://public-api.wordpress.com:443' )
					.persist()
					.get( '/rest/v1.1/domains/supported-countries/' )
					.reply( 200, countries );
			} );

			it( 'should dispatch fetch action when thunk triggered', () => {
				requestDomainRegistrationSupportedCountries()( spy );
				expect( spy ).to.have.been.calledWith( { type: COUNTRIES_REQUEST, listType: DOMAIN } );
			} );

			it( 'should dispatch receive action when request completes', () => {
				requestDomainRegistrationSupportedCountries()( spy ).then( () => {
					expect( spy ).to.have.been.calledWith( { type: COUNTRIES_RECEIVE, listType: DOMAIN, countries } );
				}, raise );
			} );

			xit( 'should dispatch request success action when request completes', () => {
				requestDomainRegistrationSupportedCountries()( spy ).then( () => {
					expect( spy ).to.have.been.calledWith( { type: COUNTRIES_REQUEST_SUCCESS, listType: DOMAIN } );
				}, raise );
			} );
		} );

		xdescribe( 'error', () => {
			let error;
			beforeEach( () => {
				error = {
					error: 'server_error',
					message: 'A server error has occurred'
				};
			} );
			useNock( nock => {
				nock( 'https://public-api.wordpress.com:443' )
					.persist()
					.get( '/rest/v1.1/domains/supported-countries/' )
					.reply( 500, error );
			} );
			it( 'should dispatch request failure action when the request fails', () => {
				requestDomainRegistrationSupportedCountries()( spy ).then( () => {
					expect( spy ).to.have.been.calledWith( {
						type: COUNTRIES_REQUEST_FAILURE, listType: DOMAIN, error: sinon.match( { message: error.message } )
					} );
				}, raise );
			} );
		} );
	} );

	describe( '#requestPaymentSupportCountries', () => {
		useNock( nock => {
			nock( 'https://public-api.wordpress.com:443' )
				.persist()
				.get( '/rest/v1.1/me/transactions/supported-countries/' )
				.reply( 200, countries );
		} );

		it( 'should dispatch fetch action when thunk triggered', () => {
			requestPaymentSupportCountries()( spy );
			expect( spy ).to.have.been.calledWith( { type: COUNTRIES_REQUEST, listType: PAYMENT } );
		} );

		it( 'should dispatch receive action when request completes', () => {
			requestPaymentSupportCountries()( spy ).then( () => {
				expect( spy ).to.have.been.calledWith( { type: COUNTRIES_RECEIVE, listType: PAYMENT, countries } );
			}, raise );
		} );

		it( 'should dispatch request success action when request completes', () => {
			requestPaymentSupportCountries()( spy ).then( () => {
				expect( spy ).to.have.been.calledWith( { type: COUNTRIES_REQUEST_SUCCESS, listType: PAYMENT } );
			}, raise );
		} );
	} );

	describe( '#requestSMSSupportCountries', () => {
		useNock( nock => {
			nock( 'https://public-api.wordpress.com:443' )
				.persist()
				.get( '/rest/v1.1/meta/sms-country-codes/' )
				.reply( 200, countries );
		} );

		it( 'should dispatch fetch action when thunk triggered', () => {
			requestSMSSupportCountries()( spy );
			expect( spy ).to.have.been.calledWith( { type: COUNTRIES_REQUEST, listType: SMS } );
		} );

		it( 'should dispatch receive action when request completes', () => {
			requestSMSSupportCountries()( spy ).then( () => {
				expect( spy ).to.have.been.calledWith( { type: COUNTRIES_RECEIVE, listType: SMS, countries } );
			}, raise );
		} );

		it( 'should dispatch request success action when request completes', () => {
			requestSMSSupportCountries()( spy ).then( () => {
				expect( spy ).to.have.been.calledWith( { type: COUNTRIES_REQUEST_SUCCESS, listType: SMS } );
			}, raise );
		} );
	} );
} );

