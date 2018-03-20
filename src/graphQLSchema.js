import merge from 'lodash.merge';
import GraphQLJSON from 'graphql-type-json';
import { makeExecutableSchema } from 'graphql-tools';

import { mergeSchemas } from './utilities';

import {
	campaignsMutations,
	campaignsQueries,
	campaignsTypeDef
} from './campaigns/typeDefs';

import campaignsResolvers from './campaigns/resolvers';

// merge the typeDefs
const mergedTypeDefs = mergeSchemas(
	[
		'scalar JSON',
		campaignsTypeDef
	],
	[
		campaignsQueries
	],
	[
		campaignsMutations
	]
);

// Generate the schema object from your types definition.
export default makeExecutableSchema({
	typeDefs: mergedTypeDefs,
	resolvers: merge(
		{ JSON: GraphQLJSON }, // allows scalar JSON
		campaignsResolvers
	)
});
