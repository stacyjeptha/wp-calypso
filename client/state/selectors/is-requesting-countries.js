export function isRequestingCountries( state, type ) {
	return state.countries.isRequesting[ type ];
}
