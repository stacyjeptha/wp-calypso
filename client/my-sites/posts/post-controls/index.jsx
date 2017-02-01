/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import url from 'url';
import classNames from 'classnames';
import { noop } from 'lodash';
import Gridicon from 'gridicons';

/**
 * Internal dependencies
 */
import { isEnabled } from 'config';
import {
	composeAnalytics,
	recordGoogleEvent,
	recordTracksEvent,
} from 'state/analytics/actions';
import {
	canCurrentUser,
	isPublicizeEnabled,
} from 'state/selectors';
import { ga } from 'lib/analytics';
import { userCan } from 'lib/posts/utils';

const view = () => ga.recordEvent( 'Posts', 'Clicked View Post' );
const preview = () => ga.recordEvent( 'Posts', 'Clicked Preiew Post' );
const edit = () => ga.recordEvent( 'Posts', 'Clicked Edit Post' );
const copy = () => ga.recordEvent( 'Posts', 'Clicked Copy Post' );
const viewStats = () => ga.recordEvent( 'Posts', 'Clicked View Post Stats' );

const getAvailableControls = props => {
	const {
		editURL,
		fullWidth,
		onDelete,
		onHideMore,
		onPublish,
		onRestore,
		onShowMore,
		onToggleShare,
		onTrash,
		post,
		site,
		translate,
	} = props;
	const controls = { main: [], more: [] };

	// NOTE: Currently Jetpack site posts are not returning `post.capabilities`
	// and those posts will not have access to post management type controls

	// Main Controls (not behind ... more link)
	if ( userCan( 'edit_post', post ) ) {
		controls.main.push( {
			className: 'edit',
			href: editURL,
			icon: 'pencil',
			onClick: edit,
			text: translate( 'Edit' ),
		} );
	}

	if ( 'publish' === post.status ) {
		controls.main.push( {
			className: 'view',
			href: post.URL,
			icon: 'external',
			onClick: view,
			target: '_blank',
			text: translate( 'View' ),
		} );

		controls.main.push( {
			className: 'stats',
			href: `/stats/post/${ post.ID }/${ site.slug }`,
			icon: 'stats-alt',
			onClick: viewStats,
			text: translate( 'Stats' ),
		} );

		if ( isEnabled( 'republicize' ) ) {
			controls.main.push( {
				className: 'share',
				disabled: ! props.isPublicizeEnabled,
				icon: 'share',
				onClick: onToggleShare,
				text: translate( 'Share' ),
			} );
		}
	} else if ( 'trash' !== post.status ) {
		const parsedUrl = url.parse( post.URL, true );
		parsedUrl.query.preview = true;
		// NOTE: search needs to be cleared in order to rebuild query
		// http://nodejs.org/api/url.html#url_url_format_urlobj
		parsedUrl.search = '';

		controls.main.push( {
			className: 'view',
			href: url.format( parsedUrl ),
			icon: 'external',
			onClick: preview,
			text: translate( 'Preview' ),
		} );

		if ( userCan( 'publish_post', post ) ) {
			controls.main.push( {
				className: 'publish',
				icon: 'reader',
				onClick: onPublish,
				text: translate( 'Publish' ),
			} );
		}
	} else if ( userCan( 'delete_post', post ) ) {
		controls.main.push( {
			className: 'restore',
			icon: 'undo',
			onClick: onRestore,
			text: translate( 'Restore' ),
		} );
	}

	if ( userCan( 'delete_post', post ) ) {
		if ( 'trash' === post.status ) {
			controls.main.push( {
				className: 'trash is-scary',
				icon: 'trash',
				onClick: onDelete,
				text: translate( 'Delete Permanently' ),
			} );
		} else {
			controls.main.push( {
				className: 'trash',
				icon: 'trash',
				onClick: onTrash,
				text: translate( 'Trash' ),
			} );
		}
	}

	if ( ( 'publish' === post.status || 'private' === post.status ) && userCan( 'edit_post', post ) ) {
		controls.main.push( {
			className: 'copy',
			href: `/post/${ site.slug }?copy=${ post.ID }`,
			icon: 'clipboard',
			onClick: copy,
			text: translate( 'Copy' ),
		} );
	}

	// More Controls (behind ... more link)
	if ( controls.main.length > 4 && fullWidth ) {
		controls.more = controls.main.splice( 4 );
	} else if ( controls.main.length > 2 && ! fullWidth ) {
		controls.more = controls.main.splice( 2 );
	}

	if ( controls.more.length ) {
		controls.main.push( {
			className: 'more',
			icon: 'ellipsis',
			onClick: onShowMore,
			text: translate( 'More' ),
		} );

		controls.more.push( {
			className: 'back',
			icon: 'chevron-left',
			onClick: onHideMore,
			text: translate( 'Back' ),
		} );
	}

	return controls;
};

const getControlElements = controls => controls.map( ( control, index ) =>
	<li
		className={ classNames( { 'post-controls__disabled': control.disabled } ) }
		key={ index }
	>
		<a
			className={ `post-controls__${ control.className }` }
			href={ control.href }
			onClick={ control.disabled ? noop : control.onClick }
			target={ control.target ? control.target : null }
		>
			<Gridicon icon={ control.icon } size={ 18 } />
			<span>
				{ control.text }
			</span>
		</a>
	</li>
);

export const PostControls = props => {
	const { main, more } = getAvailableControls( props );
	const classes = classNames(
		'post-controls',
		{ 'post-controls--desk-nomore': more <= 2 }
	);

	return (
		<div className={ classes }>
			{ more.length > 0 &&
				<ul className="posts__post-controls post-controls__pane post-controls__more-options">
					{ getControlElements( more ) }
				</ul>
			}
			<ul className="posts__post-controls post-controls__pane post-controls__main-options">
				{ getControlElements( main ) }
			</ul>
		</div>
	);
};

const mapStateToProps = ( state, { site, post } ) => {
	const siteId = site && site.ID ? site.ID : null;
	return {
		canUserDeletePost: canCurrentUser( state, siteId, 'delete_posts' ),
		canUserEditPost: canCurrentUser( state, siteId, 'edit_posts' ),
		canUserPublishPost: canCurrentUser( state, siteId, 'publish_posts' ),
		isPublicizeEnabled: isPublicizeEnabled( state, siteId, post.type ),
	};
};

const mapDispatchToProps = {
	recordCopyPost: () => composeAnalytics(
		recordGoogleEvent( 'Posts', 'Clicked Copy Post' ),
		recordTracksEvent( 'calypso_post_controls_copy_post_click' ),
	),
	recordEditPost: () => composeAnalytics(
		recordGoogleEvent( 'Posts', 'Clicked Edit Post' ),
		recordTracksEvent( 'calypso_post_controls_edit_post_click' ),
	),
	recordPreviewPost: () => composeAnalytics(
		recordGoogleEvent( 'Posts', 'Clicked Preview Post' ),
		recordTracksEvent( 'calypso_post_controls_preview_post_click' ),
	),
	recordViewPost: () => composeAnalytics(
		recordGoogleEvent( 'Posts', 'Clicked View Post' ),
		recordTracksEvent( 'calypso_post_controls_view_post_click' ),
	),
	recordViewPostStats: () => composeAnalytics(
		recordGoogleEvent( 'Posts', 'Clicked View Post Stats' ),
		recordTracksEvent( 'calypso_post_controls_view_post_stats_click' ),
	),
};

export default connect( mapStateToProps, mapDispatchToProps )( localize( PostControls ) );
