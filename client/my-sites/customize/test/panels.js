/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import { getWordPressFocusArgument } from '../panels';

describe( 'panels', () => {
	describe( 'getWordPressFocusArgument()', () => {
		it( 'should return null if passed a falsey value', () => {
			const arg = getWordPressFocusArgument();

			expect( arg ).to.be.null;
		} );

		it( 'should return null if panel is not recognized', () => {
			const arg = getWordPressFocusArgument( '__UNKNOWN' );

			expect( arg ).to.be.null;
		} );

		it( 'should return object of recognized wordpress focus argument', () => {
			const arg = getWordPressFocusArgument( 'identity' );

			expect( arg ).to.eql( { 'autofocus[section]': 'title_tagline' } );
		} );
	} );
} );
