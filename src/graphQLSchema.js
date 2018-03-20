import merge from 'lodash.merge';
import GraphQLJSON from 'graphql-type-json';
import { makeExecutableSchema } from 'graphql-tools';

import { mergeSchemas } from './utilities';

import {
	campaignsMutations,
	campaignsQueries,
	campaignsTypeDef
} from './campaigns/typeDefs';

import {
	favoritesMutations,
	favoritesQueries,
	favoritesTypeDef
} from './favorites/typeDefs';

import {
	commentsMutations,
	commentsQueries,
	commentsTypeDef
} from './comments/typeDefs';

import campaignsResolvers from './campaigns/resolvers';
import favoritesResolvers from './favorites/resolvers';
import commentsResolvers from './comments/resolvers';

// merge the typeDefs
const mergedTypeDefs = mergeSchemas(
	[
		'scalar JSON',
		campaignsTypeDef,
		favoritesTypeDef,
		commentsTypeDef
	],
	[
		campaignsQueries,
		favoritesQueries,
		commentsQueries
	],
	[
		campaignsMutations,
		favoritesMutations,
		commentsMutations
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
