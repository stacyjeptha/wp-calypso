/**
 * Internal dependencies
 */
import { mergeHandlers } from 'state/data-layer/utils';
import accountRecovery from './account-recovery';
import plans from './plans';
import sites from './sites';

export const handlers = mergeHandlers(
	accountRecovery,
	plans,
	sites,
);

export default handlers;
