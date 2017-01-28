/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import page from 'page';
import { localize } from 'i18n-calypso';
import { flowRight, get } from 'lodash';

/**
 * Internal dependencies
 */
import Emojify from 'components/emojify';
import PostSummary from '../stats-post-summary';
import PostMonths from '../stats-detail-months';
import PostWeeks from '../stats-detail-weeks';
import HeaderCake from 'components/header-cake';
import { decodeEntities } from 'lib/formatting';
import Main from 'components/main';
import StatsFirstView from '../stats-first-view';
import PostLikes from '../stats-post-likes';
import QueryPosts from 'components/data/query-posts';
import Button from 'components/button';
import WebPreview from 'components/web-preview';
import Gridicon from 'components/gridicon';
import { getSelectedSiteId } from 'state/ui/selectors';
import { getSiteSlug } from 'state/sites/selectors';
import { getSitePost, isRequestingSitePost } from 'state/posts/selectors';

class StatsPostDetail extends Component {
	static propTypes = {
		path: PropTypes.string,
		siteId: PropTypes.number,
		postId: PropTypes.number,
		translate: PropTypes.func,
		context: PropTypes.object,
		siteSlug: PropTypes.string,
	};

	state = {
		showPreview: false
	};

	goBack = () => {
		const pathParts = this.props.path.split( '/' );
		const defaultBack = '/stats/' + pathParts[ pathParts.length - 1 ];

		page( this.props.context.prevPath || defaultBack );
	}

	componentDidMount() {
		window.scrollTo( 0, 0 );
	}

	openPreview = () => {
		this.setState( {
			showPreview: true
		} );
	}

	closePreview = () => {
		this.setState( {
			showPreview: false
		} );
	}

	render() {
		const { isRequesting, post, postId, siteId, translate, siteSlug } = this.props;
		const postOnRecord = post && post.title !== null;
		const postUrl = get( post, 'URL' );

		let title;
		if ( postOnRecord ) {
			if ( typeof post.title === 'string' && post.title.length ) {
				title = <Emojify>{ decodeEntities( post.title ) }</Emojify>;
			}
		}
		if ( ! postOnRecord && ! isRequesting ) {
			title = this.props.translate( 'We don\'t have that post on record yet.' );
		}

		return (
			<Main wideLayout>
				<QueryPosts siteId={ siteId } postId={ postId } />
				<StatsFirstView />

				<HeaderCake onClick={ this.goBack }>
					{ title }
				</HeaderCake>

				<PostSummary siteId={ this.props.siteId } postId={ this.props.postId } />

				{ !! this.props.postId && <PostLikes siteId={ this.props.siteId } postId={ this.props.postId } /> }

				<PostMonths
					dataKey="years"
					title={ this.props.translate( 'Months and Years' ) }
					total={ this.props.translate( 'Total' ) }
					siteId={ this.props.siteId }
					postId={ this.props.postId }
				/>

				<PostMonths
					dataKey="averages"
					title={ this.props.translate( 'Average per Day' ) }
					total={ this.props.translate( 'Overall' ) }
					siteId={ this.props.siteId }
					postId={ this.props.postId }
				/>

				<PostWeeks siteId={ this.props.siteId } postId={ this.props.postId } />
				<div className="stats-post-detail__footer">
					<Button borderless compact onClick={ this.openPreview }>
						<Gridicon icon="external" /> { translate( 'View Post' ) }
					</Button>
					<Button borderless compact href={ `/post/${ siteSlug }/${ postId }` }>
						<Gridicon icon="pencil" /> { translate( 'Edit Post' ) }
					</Button>
				</div>
				<WebPreview
					showPreview={ this.state.showPreview }
					defaultViewportDevice="tablet"
					previewUrl={ postUrl }
					externalUrl={ postUrl }
					onClose={ this.closePreview }
					loadingMessage="Beep beep boop…"
				/>
			</Main>
		);
	}
}

const connectComponent = connect(
	( state, { postId } ) => {
		const siteId = getSelectedSiteId( state );

		return {
			post: getSitePost( state, siteId, postId ),
			isRequesting: isRequestingSitePost( state, siteId, postId ),
			siteSlug: getSiteSlug( state, siteId ),
			siteId,
		};
	}
);

export default flowRight(
	connectComponent,
	localize,
)( StatsPostDetail );
