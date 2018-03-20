'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Koa = _interopDefault(require('koa'));
var KoaRouter = _interopDefault(require('koa-router'));
var koaLogger = _interopDefault(require('koa-logger'));
var koaBody = _interopDefault(require('koa-bodyparser'));
var koaCors = _interopDefault(require('@koa/cors'));
var apolloServerKoa = require('apollo-server-koa');
var merge = _interopDefault(require('lodash.merge'));
var GraphQLJSON = _interopDefault(require('graphql-type-json'));
var graphqlTools = require('graphql-tools');
var request = _interopDefault(require('request-promise-native'));
var graphql = require('graphql');

/**
 * Creates a request following the given parameters
 * @param {string} url
 * @param {string} method
 * @param {object} [body]
 * @param {boolean} [fullResponse]
 * @return {Promise.<*>} - promise with the error or the response object
 */

async function generalRequest(url, method, body, fullResponse) {
	const parameters = {
		method,
		uri: encodeURI(url),
		body,
		json: true,
		resolveWithFullResponse: fullResponse
	};
	if (process.env.SHOW_URLS) {
		// eslint-disable-next-line
		console.log(url);
	}

	try {
		console.log(parameters);
		return await request(parameters);
	} catch (err) {
		return err;
	}
}

/**
 * Adds parameters to a given route
 * @param {string} url
 * @param {object} parameters
 * @return {string} - url with the added parameters
 */
function addParams(url, parameters) {
	let queryUrl = `${url}?`;
	for (let param in parameters) {
		// check object properties
		if (
			Object.prototype.hasOwnProperty.call(parameters, param) &&
			parameters[param]
		) {
			if (Array.isArray(parameters[param])) {
				queryUrl += `${param}=${parameters[param].join(`&${param}=`)}&`;
			} else {
				queryUrl += `${param}=${parameters[param]}&`;
			}
		}
	}
	console.log(queryUrl);
	return queryUrl;
}

/**
 * Generates a GET request with a list of query params
 * @param {string} url
 * @param {string} path
 * @param {object} parameters - key values to add to the url path
 * @return {Promise.<*>}
 */
function getRequest(url, path, parameters) {
	const queryUrl = addParams(`${url}/${path}`, parameters);
	return generalRequest(queryUrl, 'GET');
}

/**
 * Merge the schemas in order to avoid conflicts
 * @param {Array<string>} typeDefs
 * @param {Array<string>} queries
 * @param {Array<string>} mutations
 * @return {string}
 */
function mergeSchemas(typeDefs, queries, mutations) {
	return `${typeDefs.join('\n')}
    type Query { ${queries.join('\n')} }
    type Mutation { ${mutations.join('\n')} }`;
}

function formatErr(error) {
	const data = graphql.formatError(error);
	const { originalError } = error;
	if (originalError && originalError.error) {
		const { path } = data;
		const { error: { id: message, code, description } } = originalError;
		return { message, code, description, path };
	}
	return data;
}

const campaignsTypeDef = `
type Campaign {
    _id: String!
    name: String!
    city: String!
    address: String!
    ubication: [Int]!
    created_date: String!
    start_date: String!
    end_date: String!
    status: String!
    program: String!
}

input CampaignInput {
  name: String!
  city: String!
  address: String!
  ubication: [Int]!
  created_date: String!
  start_date: String!
  end_date: String!
  status: String!
  program: String!
}
`;

const campaignsQueries = `
    allCampaigns: [Campaign]!
    campaignById(id: String!): Campaign!
`;

const campaignsMutations = `
    createCampaign(campaign: CampaignInput!): Campaign!
    deleteCampaign(id: String!): Campaign!
    updateCampaign(id: String!, campaign: CampaignInput!): Campaign!
`;

const favoritesTypeDef = `
type Favorite {
  id: Int!
  user_id: Int!
  place_id: Int!
  comment: String!
}

input FavoriteInput {
  id: Int!
  user_id: Int!
  place_id: Int!
  comment: String!
}
`;

const favoritesQueries = `
    allFavorites: [Favorite]!
    FavoriteById(id: Int!): Favorite!
`;

const favoritesMutations = `
    createFavorite(favorite: FavoriteInput!): Favorite!
    deleteFavorite(id: Int!): Favorite!
    updateFavorite(id: Int!, favorite: FavoriteInput!): Favorite!
`;

//export const url = process.env.CAMPAIGNS_URL || 'campaigns_ms';
const url = process.env.CAMPAIGNS_URL || 'localhost';
const port = process.env.CAMPAIGNS_PORT || '4005';
const entryPoint = process.env.CAMPAIGNS_ENTRY || 'campaigns';

const URL = `http://${url}:${port}/${entryPoint}`;

const resolvers = {
	Query: {
		allCampaigns: (_) =>
			getRequest(URL, ''),
		campaignById: (_, { id }) =>
			generalRequest(`${URL}/${id}`, 'GET'),
	},
	Mutation: {
		createCampaign: (_, { campaign }) =>
			generalRequest(`${URL}`, 'POST', campaign),
		updateCampaign: (_, { id, campaign }) =>
			generalRequest(`${URL}/${id}`, 'PUT', campaign),
		deleteCampaign: (_, { id }) =>
			generalRequest(`${URL}/${id}`, 'DELETE')
	}
};

// merge the typeDefs
const mergedTypeDefs = mergeSchemas(
	[
		'scalar JSON',
		campaignsTypeDef,
		favoritesTypeDef
	],
	[
		campaignsQueries,
		favoritesQueries
	],
	[
		campaignsMutations,
		favoritesMutations
	]
);

// Generate the schema object from your types definition.
var graphQLSchema = graphqlTools.makeExecutableSchema({
	typeDefs: mergedTypeDefs,
	resolvers: merge(
		{ JSON: GraphQLJSON }, // allows scalar JSON
		resolvers
	)
});

const app = new Koa();
const router = new KoaRouter();
const PORT = process.env.PORT || 5000;

app.use(koaLogger());
app.use(koaCors());

// read token from header
app.use(async (ctx, next) => {
	if (ctx.header.authorization) {
		const token = ctx.header.authorization.match(/Bearer ([A-Za-z0-9]+)/);
		if (token && token[1]) {
			ctx.state.token = token[1];
		}
	}
	await next();
});

// GraphQL
const graphql$1 = apolloServerKoa.graphqlKoa((ctx) => ({
	schema: graphQLSchema,
	context: { token: ctx.state.token },
	formatError: formatErr
}));
router.post('/graphql', koaBody(), graphql$1);
router.get('/graphql', graphql$1);

// test route
router.get('/graphiql', apolloServerKoa.graphiqlKoa({ endpointURL: '/graphql' }));

app.use(router.routes());
app.use(router.allowedMethods());
// eslint-disable-next-line
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
