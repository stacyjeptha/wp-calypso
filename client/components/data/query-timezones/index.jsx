
/**
 * External dependencies
 */
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import { isRequestingTimezones } from 'state/selectors';
import { timezonesRequestAction } from 'state/timezones/actions';

export class QueryTimezones extends Component {
	static propTypes = {
		requestingTimezones: PropTypes.bool,
		requestTimezones: PropTypes.func
	};

	componentDidMount() {
		if ( this.props.requestingTimezones ) {
			return;
		}

		this.props.requestTimezones();
	}

	render() {
		return null;
	}
}

const mapStateToProps = state => ( {
	requestingTimezones: isRequestingTimezones( state ),
} );

export const mapDispatchToProps = ( {
	requestTimezones: timezonesRequestAction,
} );

export default connect( mapStateToProps, mapDispatchToProps )( QueryTimezones );
