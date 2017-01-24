
export const rawOffsetsSchema = {
	type: 'array',
	items: {
		type: 'object',
		additionalProperties: false,
		properties: {
			label: { type: 'string' },
			value: { type: 'string' }
		}
	}
};

export const timezonesSchema = {
	type: 'object',
	additionalProperties: false,
	patternProperties: {
		'^[A-Z][a-zA-Z]+$': {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					label: { type: 'string' },
					value: { type: 'string' }
				}
			}
		}
	}
};
