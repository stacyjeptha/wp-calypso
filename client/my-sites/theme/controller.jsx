/**
 * External Dependencies
 */
import React from 'react';
import debugFactory from 'debug';
import startsWith from 'lodash/startsWith';

/**
 * Internal Dependencies
 */
import ThemeSheetComponent from './main';
import {
	receiveTheme,
	themeRequestFailure,
	setBackPath
} from 'state/themes/actions';
import { getTheme } from 'state/themes/selectors';
import wpcom from 'lib/wp';
import config from 'config';

const debug = debugFactory( 'calypso:themes' );

export function fetchThemeDetailsData( context, next ) {
	if ( ! config.isEnabled( 'manage/themes/details' ) || ! context.isServerSide ) {
		return next();
	}

	const themeSlug = context.params.slug;
	const theme = getTheme( context.store.getState(), themeSlug );

	if ( theme ) {
		debug( 'found theme!', theme.id );
		context.renderCacheKey = context.path + theme.timestamp;
		return next();
	}

	// change to use requestTheme action
	wpcom.undocumented().themeDetails( themeSlug )
		.then( themeDetails => {
			debug( 'caching', themeSlug );
			themeDetails.timestamp = Date.now();
			context.store.dispatch( receiveTheme( themeDetails, 'wpcom' ) );
			context.renderCacheKey = context.path + themeDetails.timestamp;
			next();
		} )
		.catch( error => {
			debug( `Error fetching theme ${ themeSlug } details: `, error.message || error );
			context.store.dispatch( themeRequestFailure( 'wpcom', themeSlug, error ) );
			context.renderCacheKey = 'theme not found';
			next();
		} );
}

export function details( context, next ) {
	const { slug, section } = context.params;
	if ( startsWith( context.prevPath, '/design' ) ) {
		context.store.dispatch( setBackPath( context.prevPath ) );
	}

	context.primary = <ThemeSheetComponent id={ slug }
		section={ section } />;
	context.secondary = null; // When we're logged in, we need to remove the sidebar.
	next();
}
