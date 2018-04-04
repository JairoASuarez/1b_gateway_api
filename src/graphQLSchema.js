import merge from 'lodash.merge';
import GraphQLJSON from 'graphql-type-json';
import { makeExecutableSchema } from 'graphql-tools';

import { mergeSchemas } from './utilities';

import {
	campaignsMutations,
	campaignsQueries,
	campaignsTypeDef,

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

import {
	pointsMutations,
	pointsQueries,
	pointsTypeDef
} from './points/typeDefs';

import {
	usersMutations,
	usersQueries,
	usersTypeDef
} from './users/typeDefs';

import {
    disposalPointTypeDef,
    disposalPointQueries,
    disposalPointMutations
} from './stats/typeDefs';


import campaignsResolvers from './campaigns/resolvers';
import favoritesResolvers from './favorites/resolvers';
import commentsResolvers from './comments/resolvers';
import pointsResolvers from './points/resolvers';
import usersResolvers from './users/resolvers';
import disposalPointResolvers from './stats/resolvers';

// merge the typeDefs
const mergedTypeDefs = mergeSchemas(
	[
		'scalar JSON',
		campaignsTypeDef,
		favoritesTypeDef,
		commentsTypeDef,
		pointsTypeDef,
		usersTypeDef,
    disposalPointTypeDef
	],
	[
		campaignsQueries,
		favoritesQueries,
		commentsQueries,
		pointsQueries,
		usersQueries,
    disposalPointQueries
	],
	[
		campaignsMutations,
		favoritesMutations,
		commentsMutations,
		pointsMutations,
		usersMutations,
    disposalPointMutations
	]
);

// Generate the schema object from your types definition.
export default makeExecutableSchema({
	typeDefs: mergedTypeDefs,
	resolvers: merge(
		{ JSON: GraphQLJSON }, // allows scalar JSON
		pointsResolvers,
		commentsResolvers,
		campaignsResolvers,
		favoritesResolvers,
    disposalPointResolvers
	)
});
