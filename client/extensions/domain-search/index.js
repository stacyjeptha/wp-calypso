/**
 * External dependencies
 */
import debounce from 'lodash/debounce';
import intersection from 'lodash/intersection';
import page from 'page';
import React, { Component } from 'react';
import i18n from 'i18n-calypso';
import inherits from 'inherits';

/**
 * Internal dependencies
 */
import { renderWithReduxStore } from 'lib/react-helpers';
import Button from 'components/button';
import Card from 'components/card';
import { setSection } from 'state/ui/actions';
import wpcom from 'lib/wp';

const domains = wpcom.domains();

function ValidationError( code ) {
	this.code = code;
	this.message = code;
}

inherits( ValidationError, Error );

function canRegister( domainName, onComplete ) {
	if ( ! domainName ) {
		onComplete( new ValidationError( 'empty_query' ) );
		return;
	}

	wpcom.undocumented().isDomainAllTLDsAvailable( domainName, function( serverError, data ) {
		if ( serverError ) {
			onComplete( new ValidationError( serverError.error ) );
			return;
		}

		onComplete( null, data );
		return;
	} );
}

const toptlds = [ // Sorted by gTLD, then popularity https://w3techs.com/technologies/overview/top_level_domain/all
	'com', 'org', 'net', 'info', 'co'
];

const othertlds = [ // Sorted by gTLD, then popularity https://w3techs.com/technologies/overview/top_level_domain/all
	'tv', 'me', 'biz', 'blog', 'coffee', 'fm', 'mx', 'live', 'mobi', 'wtf', 'in', 'nl', 'es', 'be', 'com.br', 'net.br', 'wales'
];

const tlds = toptlds.concat( othertlds );

const prefixes = [ 'my', 'the', 'web', 'go' ];

const sufixes = [ 'online', 'web', 'media', 'world', 'net' ];

class Suggestion extends Component {
	selectSuggestion = () => {
		const domainName = this.props.domainName.split( '.' );
		this.props.changeSearch( domainName[ 0 ] );
	}

	render() {
		return (
			<span><a style={ { borderRadius: '5px' } } onClick={ this.selectSuggestion }>{ this.props.domainName }</a>, </span>
		);
	}
}

class DomanSearch extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			domainSearch: [],
			searchResults: {},
			suggestions: {},
			loadMore: false,
			searchQuery: '',
			mostRecentSearchQuery: ''
		};

		this.onSearchDebounced = debounce( this.onSearch, 300 );
	}

	onSearchChange = ( event ) => {
		const searchQuery = event.target.value;

		this.setState( {
			searchQuery: searchQuery,
			loadMore: false
		} );

		this.onSearchDebounced();
	}

	onSearch = () => {
		const searchQuery = this.state.searchQuery;

		if ( this.state.searchResults[ searchQuery ] ) {
			return; // we already have results
		}

		canRegister( searchQuery, ( error, result ) => {
			const searchResults = this.state.searchResults;

			tlds.some( ( tld ) => {
				if ( result && result[ tld ] ) {
					result[ tld ].bestMatch = true;
					return true;
				}
			} );

			searchResults[ searchQuery ] = result;

			this.setState( {
				searchResults: searchResults
			} );
		} );

		domains.suggestions( {
			query: searchQuery,
			quantity: 10,
			vendor: 'domainsbot',
			includeSubdomain: false
		} ).then( domainSuggestions => {
			const suggestions = this.state.suggestions;

			suggestions[ searchQuery ] = domainSuggestions;

			this.setState( {
				suggestions: suggestions,
				mostRecentSearchQuery: searchQuery
			} );
		} );
	}

	isDomainAvailable( searchQuery, tld ) {
		if ( this.state.searchResults[ searchQuery ] ) {
			if ( this.state.searchResults[ searchQuery ][ tld ] ) {
				return true;
			}

			return false;
		}

		return false;
	}

	getResults( searchQuery, tld ) {
		const styles = { width: '80px' };

		if ( this.state.searchResults[ searchQuery ] ) {
			if ( this.state.searchResults[ searchQuery ][ tld ] ) {
				const details = this.state.searchResults[ searchQuery ][ tld ];
				return (
					<div>
						<span style={ { fontSize: '1.2rem', paddingRight: '1em' } }>{ details[ 2 ] }/year</span>
						<Button primary style={ styles }>Buy</Button>
					</div>
				);
			}

			return <Button disabled style={ styles }>Taken</Button>;
		}

		return <Button disabled style={ styles }>&nbsp;</Button>;
	}

	getTLD( tld, index ) {
		const styles = { clear: 'both', lineHeight: '40px', fontSize: '24px', padding: '10px' };
		let color = '#000';
		if ( ! this.state.searchResults[ this.state.searchQuery ] ) {
			styles.animation = 'loading-fade 1.6s ease-in-out infinite';
			color = '#aaa';
		} else if ( ! this.isDomainAvailable( this.state.searchQuery, tld ) ) {
			color = '#caa';
		} else if ( this.state.searchResults[ this.state.searchQuery ][ tld ] &&
			this.state.searchResults[ this.state.searchQuery ][ tld ].bestMatch ) {
			styles.backgroundColor = '#4ab866';
		}

		styles.color = color;
		return (
			<div key={ index } style={ styles }>
				{ this.state.searchQuery + '.' + tld }
				<div style={ { 'float': 'right' } }>
					{ this.getResults( this.state.searchQuery, tld ) }
				</div>
			</div>
		);
	}

	getPrefix( fix, index ) {
		const styles = { clear: 'both', lineHeight: '40px', fontSize: '24px', padding: '10px' };
		styles.animation = 'loading-fade 1.6s ease-in-out infinite';
		styles.color = '#aaa';
		if ( true ) {
			return null;
		}

		return (
			<div key={ index } style={ styles }>
				{ fix + this.state.searchQuery + '.com' }
				<div style={ { 'float': 'right' } }>
					<Button disabled style={ styles }>&nbsp;</Button>
				</div>
			</div>
		);
	}

	getSufix( fix, index ) {
		const styles = { clear: 'both', lineHeight: '40px', fontSize: '24px', padding: '10px' };
		styles.animation = 'loading-fade 1.6s ease-in-out infinite';
		styles.color = '#aaa';
		if ( true ) {
			return null;
		}

		return (
			<div key={ index } style={ styles }>
				{ this.state.searchQuery + fix + '.com' }
				<div style={ { 'float': 'right' } }>
					<Button disabled style={ styles }>&nbsp;</Button>
				</div>
			</div>
		);
	}

	changeSearch = ( domainName ) => {
		this.setState( {
			searchQuery: domainName
		}, () => {
			this.onSearch();
		} );
	}

	ideas() {
		if ( this.state.suggestions[ this.state.mostRecentSearchQuery ] ) {
			const suggestionText = this.state.suggestions[ this.state.mostRecentSearchQuery ].map( ( suggestion ) => {
				return suggestion.domain_name.split( '.' )[ 0 ];
			} );

			const uniqueSuggestions = intersection( suggestionText );

			const ideas = uniqueSuggestions.map( ( suggestion, index ) => {
				return (
					<Suggestion
						key={ index }
						domainName={ suggestion }
						changeSearch={ this.changeSearch } />
				);
			} );
			return (
				<div style={ { paddingTop: '5px' } }>
					More ideas: { ideas }
				</div>
			);
		}

		return (
			<div>
				&nbsp;
			</div>
		);
	}

	getSuggestions() {
		const styles = { clear: 'both', color: '#000', lineHeight: '40px', fontSize: '24px', padding: '10px' };

		if ( ! this.state.suggestions[ this.state.mostRecentSearchQuery ] ) {
			return null;
		}

		const suggestions = this.state.suggestions[ this.state.mostRecentSearchQuery ].map( ( suggestion, index ) => {
			return (
				<div key={ index } style={ styles }>
					{ suggestion.domain_name }
					<div style={ { 'float': 'right' } }>
						<div>
							<span style={ { fontSize: '1.2rem', paddingRight: '1em' } }>{ suggestion.cost }/year</span>
							<Button primary style={ { width: '80px' } }>Buy</Button>
						</div>
					</div>
				</div>
			);
		} );

		return (
			<div>
				<h2 style={ { marginTop: '2em', fontSize: '2rem', textAlign: 'center' } }>Alternative suggestions</h2>
				{ suggestions }
			</div>
		);
	}

	loadMore = () => {
		this.setState( { loadMore: true } );
	}

	render() {
		return (
			<div>
				<Card>
					<input
						type="search"
						placeholder={ i18n.translate( 'Enter a domain or keyword', { textOnly: true } ) }
						autoFocus={ true }
						onChange={ this.onSearchChange }
						dir="ltr"
						value={ this.state.searchQuery }
					/>
					<div>{ this.ideas() }</div>
				</Card>

				<Card>
					<div>
						{ this.state.searchQuery && toptlds.map( ( tld, index ) => ( this.getTLD( tld, index ) ) ) }
						{ this.state.searchQuery && prefixes.map( ( prefix, index ) => ( this.getPrefix( prefix, index ) ) ) }
						{ this.state.searchQuery && sufixes.map( ( sufix, index ) => ( this.getSufix( sufix, index ) ) ) }
						{
							this.state.searchQuery &&
							! this.state.loadMore &&
							( <div style={ { textAlign: 'center' } }><a onClick={ this.loadMore }>See more</a></div> )
						}
						{
							this.state.loadMore &&
							this.state.searchQuery && othertlds.map( ( tld, index ) => ( this.getTLD( tld, index ) ) )
						}

						{ this.getSuggestions() }
					</div>
				</Card>
			</div>
		);
	}
}

const render = ( context ) => {
	context.store.dispatch( setSection( null, { hasSidebar: false } ) );

	renderWithReduxStore( (
		<div>
			<p style={ { fontSize: 18, fontWeight: 300, textAlign: 'center' } }>Your next big idea starts here</p>
			<DomanSearch />
		</div>
	), document.getElementById( 'primary' ), context.store );
};

export default function() {
	page( '/domain-search/:site?', render );
}
