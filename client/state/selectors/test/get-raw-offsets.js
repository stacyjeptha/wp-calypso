/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import { getRawOffsets } from '../';
import { MANUAL_UTC_OFFSETS } from 'state/timezones/test/fixture';

describe( 'getRawOffsets()', () => {
	it( 'should return null if `timezones` aren\'t synced', () => {
		const state = {
			timezones: {
				items: {},
				requesting: null
			}
		};

		const manualUTCOffsets = getRawOffsets( state );

		expect( manualUTCOffsets ).to.be.null;
	} );

	it( 'should return raw offsets data', () => {
		const state = {
			timezones: {
				items: {
					rawOffsets: MANUAL_UTC_OFFSETS
				}
			}
		};

		const offsets = getRawOffsets( state );

		expect( offsets ).to.eql( MANUAL_UTC_OFFSETS );
	} );
} );
