/**
 * External Dependencies
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import map from 'lodash/map';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import QueryTimezones from 'components/data/query-timezones';
import { timezonesRequestAction as requestTimezones } from 'state/timezones/actions';
import {
	getManualUtcOffsets,
	getTimezonesByContinent,
} from 'state/selectors';

/**
 * Module variables
 */
const noop = () => {};

class Timezone extends Component {
	static propTypes = {
		selectedZone: PropTypes.string,
		onSelect: PropTypes.func
	};

	static defaultProps = {
		selectedZone: '',
		onSelect: noop
	};

	selectTimezone = ( { target } ) => {
		this.props.onSelect( target.value );
	}

	renderTimezonesByContinent() {
		const { timezonesByContinent } = this.props;

		return (
			map( timezonesByContinent, ( countries, continent ) =>
				<optgroup label={ continent } key={ continent }>
					{ map( countries, ( { value, label }, index ) =>
						<option value={ value } key={ index }>{ label }</option>
					) }
				</optgroup>
			)
		);
	}

	renderManualUtcOffsets() {
		const { manualUtcOffsets } = this.props;
		return (
			<optgroup label={ this.props.translate( 'Manual Offsets' ) }>
				{ map( manualUtcOffsets, ( { value, label }, index ) =>
					<option value={ value } key={ index }>{ label }</option>
				) }
			</optgroup>
		);
	}

	render() {
		const { selectedZone } = this.props;

		return (
			<div>
				<QueryTimezones />
				<select onChange={ this.selectTimezone } value={ selectedZone }>
					{ this.renderTimezonesByContinent() }
					<optgroup label="UTC">
						<option value="UTC">UTC</option>
					</optgroup>
					{ this.renderManualUtcOffsets() }
				</select>
			</div>
		);
	}
}

/**
 * - Component-Data connection.
 * - Localize
 */

const mapStateToProps = state => ( {
	manualUtcOffsets: getManualUtcOffsets( state ),
	timezonesByContinent: getTimezonesByContinent( state ),
} );

const mapDispatchToProps = { requestTimezones };

export default connect( mapStateToProps, mapDispatchToProps )( localize( Timezone ) );
