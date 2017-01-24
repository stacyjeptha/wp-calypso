/**
 * External Dependencies
 */
import React from 'react';
import page from 'page';
import { translate } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import { renderWithReduxStore } from 'lib/react-helpers';
import controller from 'me/controller';
import Happychat from './main';
import { setDocumentHeadTitle } from 'state/document-head/actions';

const debug = require( 'debug' )( 'calypso:happychat:controller' );

const renderChat = ( context ) => {
	context.store.dispatch( setDocumentHeadTitle( translate( 'Chat', { textOnly: true } ) ) );
	renderWithReduxStore(
		<Happychat />,
		document.getElementById( 'primary' ),
		context.store
	);
};

export default ( ... args ) => {
	debug( 'is this a good place to check if it redux for existing happychat session', ... args );
	page( '/me/chat', controller.sidebar, renderChat );
};
