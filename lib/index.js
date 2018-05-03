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
 	console.log(parameters);
	try {
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
    created_date: String
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
  created_date: String
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
  user_id: Int!
  place_id: Int!
  comment: String!
}
`;

const favoritesQueries = `
    allFavorites: [Favorite]!
    FavoriteById(id: Int!): [Favorite]!
`;

const favoritesMutations = `
    createFavorite(favorite: FavoriteInput!): Favorite!
    deleteFavorite(id: Int!): Favorite!
    updateFavorite(id: Int!, favorite: FavoriteInput!): Favorite!
`;

const commentsTypeDef = `
type Comment {
    _id: String!
    content: String!
    score: Float!
    point_id: Int!
}

input CommentInput{
    content: String!
    score: Float!
    point_id: Int!
}
`;

const commentsQueries = `
    allComments: [Comment]!
    commentById(id: String!): Comment!
    commentByPoint(id: Int!): [Comment]!
`;

const commentsMutations = `
    createComment(comment: CommentInput!): Comment!
    deleteComment(id: String!): Comment!
    updateComment(id: String!, comment: CommentInput!): Comment!
`;

const pointsTypeDef = `
type Point {
    id: Int!
    name: String!
    address: String!
    category: String!
    contact: String!
    email: String!
    latitude: Float!
    longitude: Float!
    business_hours: String!
}

input PointInput {
    name: String!
    address: String!
    category: String!
    contact: String!
    email: String!
    latitude: Float!
    longitude: Float!
    business_hours: String!
}
`;

const pointsQueries = `
    allPoints: [Point]!
    pointById(id: Int!): Point!
    pointByName(name: String!): [Point]!
    pointByCategory(category: String!, lat_u: Float!, lat_l: Float!, lng_u: Float!, lng_l: Float!): [Point]!
    pointByPosition(latitude_upper: Float, latitude_lower: Float, longitude_upper: Float, longitude_lower: Float): [Point]!
`;

const pointsMutations = `
    createPoint(point: PointInput!): Point!
    deletePoint(id: Int!): Point!
    updatePoint(id: Int!, point: PointInput!): Point!
`;

const usersTypeDef = `
type User {
  id: Int!
  username: String!
  email: String!
  password: String!
}

type Token {
  jwt: String!
}

input AuthenticationInput {
  email: String!
  password: String!
}

input UserInput {
  username: String!
  email: String!
  password: String!
}

input SessionInput {
  auth: AuthenticationInput!
}

`;

const usersQueries = `
    getCurrentUser: [User]!
`;

const usersMutations = `
    createUser(user: UserInput!): User!
    deleteUser(id: Int!): User!
    updateUser(id: Int!, user: UserInput!): User!
    createSession(auth: SessionInput!): Token!
`;

const disposalPointTypeDef = `
type DisposalPoint {
    id: Int!
    disposal_point_name: String
    disposal_point_address: String
    city: String
    department: String
    country: String
    residue_category: String
    residue_type: String
    residue_name: String
    location: String
    schedule: String
    postconsumption_program_name: String
    contact_person: String
    email: String
}

input DisposalPointInput {
    disposal_point_name: String
    disposal_point_address: String
    city: String
    department: String
    country: String
    residue_category: String
    residue_type: String
    residue_name: String
    location: String
    schedule: String
    postconsumption_program_name: String
    contact_person: String
    email: String
}

type Count {
    item: String
    quantity: Int
}

type Ratio {
    item: String
    quantity: Float
}
`;

const disposalPointQueries = `
    allDisposalPoints: [DisposalPoint]!
    disposalPointById(id: Int!): DisposalPoint!
    
    countPerCity: [Count]!
    countPerCitySorted: [Count]!
    
    countPerDepartment: [Count]!
    countPerDepartmentSorted: [Count]!
    
    countPerResidueName: [Count]!
    countPerResidueNameSorted: [Count]!
    
    countPerResidueType: [Count]!
    countPerResidueTypeSorted: [Count]!
    
    countPerProgramName: [Count]!
    countPerProgramNameSorted: [Count]!
    
    peoplePerDisposal: [Ratio]!
    peoplePerDisposalSorted: [Ratio]!
`;

const disposalPointMutations = `
    createDisposalPoint(disposalPoint: DisposalPointInput!): DisposalPoint!
    deleteDisposalPoint(id: Int!): DisposalPoint!
    updateDisposalPoint(id: Int!, disposalPoint: DisposalPointInput!): DisposalPoint!
`;

const authTypeDef = `
    type Auth {
        email: String!
        password: String!
        answer: String!
    }
    input AuthInput {
        email: String!
        password: String!
    }
`;

const authMutations = `
    auth(auth: AuthInput!): Auth!
`;

const url = process.env.CAMPAIGNS_URL || 'campaigns_ms';
//export const url = process.env.CAMPAIGNS_URL || 'localhost';
const port = process.env.CAMPAIGNS_PORT || '4005';
const entryPoint = process.env.CAMPAIGNS_ENTRY || 'campaigns';

const URL = `http://${url}:${port}/${entryPoint}`;

console.log("URL for Campaigns: " + URL);

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

const url$1 = process.env.FAVORITES_URL || 'favorite_ms';
const port$1 = process.env.FAVORITES_PORT || '3302';
const entryPoint$1 = process.env.FAVORITES_ENTRY || 'favorite';

const URL$1 = `http://${url$1}:${port$1}/${entryPoint$1}`;

console.log("URL for Favorites: " + URL$1);

const resolvers$1 = {
	Query: {
		allFavorites	: (_) =>
			getRequest(URL$1, ''),
		FavoriteById: (_, { id }) =>
			generalRequest(`${URL$1}/${id}/`, 'GET'),
	},
	Mutation: {
		createFavorite: (_, { favorite }) =>
			generalRequest(`${URL$1}/`, 'POST', favorite),
		updateFavorite: (_, { id, favorite }) =>
			generalRequest(`${URL$1}/${id}`, 'PUT', favorite),
		deleteFavorite: (_, { id }) =>
			generalRequest(`${URL$1}/${id}`, 'DELETE')
	}
};

//export const url = process.env.COMMENTS_URL || 'comments_ms';
const url$2 = process.env.COMMENTS_URL || 'localhost';
const port$2 = process.env.COMMENTS_PORT || '3000';
const entryPoint$2 = process.env.COMMENTS_ENTRY || 'comments';

const URL$2 = `http://${url$2}:${port$2}/${entryPoint$2}`;

console.log("URL for Comments: " + URL$2);

const resolvers$2 = {
    Query: {
        allComments: (_) =>
            getRequest(URL$2, ''),
        commentById: (_, { id }) =>
            generalRequest(`${URL$2}/${id}`, 'GET'),
	commentByPoint: (_, { id }) =>
	    generalRequest(`${URL$2}?q[point_id_eq]=${id}`, 'GET')
    },
    Mutation: {
        createComment: (_, { comment }) =>
            generalRequest(`${URL$2}`, 'POST', comment),
        updateComment: (_, { id, comment }) =>
            generalRequest(`${URL$2}/${id}`, 'PUT', comment),
        deleteComment: (_, { id }) =>
            generalRequest(`${URL$2}/${id}`, 'DELETE')
    }
};

//export const url = process.env.POINTS_URL || 'points_ms';
const url$3 = process.env.POINTS_URL || '35.196.104.239';
const port$3 = process.env.POINTS_PORT || '3301';
const entryPoint$3 = process.env.POINTS_ENTRY || 'points';

const URL$3 = `http://${url$3}:${port$3}/${entryPoint$3}`;

console.log("URL for Points: " + URL$3);

const resolvers$3 = {
  Query: {
    allPoints: (_) =>
        getRequest(URL$3, ''),
    pointById: (_, { id }) =>
        generalRequest(`${URL$3}/${id}`, 'GET'),
    pointByName: (_, { name } ) =>
        generalRequest(`${URL$3}?q[name_cont]=${name}`, 'GET'),
    pointByCategory: (_, { category, lat_u, lat_l, lng_u, lng_l } ) =>
        generalRequest(`${URL$3}?q[category_cont]=${category}&q[latitude_lteq]=${lat_u}&q[latitude_gteq]=${lat_l}&q[longitude_lteq]=${lng_u}&q[longitude_gteq]=${lng_l}`, 'GET'),
    pointByPosition: (_, { latitude_upper, latitude_lower, longitude_upper, longitude_lower } ) =>
        generalRequest(`${URL$3}?q[latitude_lteq]=${latitude_upper}&q[latitude_gteq]=${latitude_lower}&q[longitude_lteq]=${longitude_upper}&q[longitude_gteq]=${longitude_lower}`, 'GET'),
  },
  Mutation: {
    createPoint: (_, { point }) =>
        generalRequest(`${URL$3}`, 'POST', point),
    updatePoint: (_, { id, point }) =>
        generalRequest(`${URL$3}/${id}`, 'PUT', point),
    deletePoint: (_, { id }) =>
        generalRequest(`${URL$3}/${id}`, 'DELETE')
  }
};

const url$4 = process.env.USERS_URL || 'users_ms';
const port$4 = process.env.USERS_PORT || '3306';
const entryPoint$4 = process.env.USERS_ENTRY || 'user';

const URL$4 = `http://${url$4}:${port$4}/${entryPoint$4}`;

console.log("URL for Users: " + URL$4);

const resolvers$4 = {
	Query: {
		getCurrentUser: (_) =>
			getRequest(URL$4, ''),
	},
	Mutation: {
		createUser: (_, { user }) =>
			generalRequest(`${URL$4}`, 'POST', user),
		updateUser: (_, { id, user }) =>
			generalRequest(`${URL$4}/${id}`, 'PUT', user),
		deleteUser: (_, { id }) =>
			generalRequest(`${URL$4}/${id}`, 'DELETE'),
		createSession: (_, { auth }) =>
			generalRequest(`${URL$4}/auth`, 'POST', auth),
		}
};

const url$5 = process.env.STATS_URL || "0.0.0.0";
const port$5 = process.env.STATS_PORT || "3000";
const entryPoint$5 = process.env.STATS_ENTRY || "disposal_points";

const URL$5 = `http://${url$5}:${port$5}/${entryPoint$5}`;
const qURL = `http://${url$5}:${port$5}`;

const resolvers$5 = {
	Query: {
		allDisposalPoints: (_) =>
			getRequest(URL$5, ''),
		disposalPointById: (_, { id }) =>
			generalRequest(`${URL$5}/${id}`, 'GET'),
			
    countPerCity: (_) =>
      getRequest(`${qURL}/count_per_city`, ''),
    countPerCitySorted: (_) =>
      getRequest(`${qURL}/count_per_city_sorted`, ''),
      
    countPerDepartment: (_) =>
      getRequest(`${qURL}/count_per_department`, ''),
    countPerDepartmentSorted: (_) =>
      getRequest(`${qURL}/count_per_department_sorted`, ''),
      
      
    countPerResidueName: (_) =>
      getRequest(`${qURL}/count_per_residue_name`, ''),
    countPerResidueNameSorted: (_) =>
      getRequest(`${qURL}/count_per_residue_name_sorted`, ''),
      
    countPerResidueType: (_) =>
      getRequest(`${qURL}/count_per_residue_type`, ''),
    countPerResidueTypeSorted: (_) =>
      getRequest(`${qURL}/count_per_residue_type_sorted`, ''),
 
    countPerProgramName: (_) =>
      getRequest(`${qURL}/count_per_city_program_name`, ''),
    countPerProgramNameSorted: (_) =>
      getRequest(`${qURL}/count_per_program_name_sorted`, ''),
      
    peoplePerDisposal: (_) =>
      getRequest(`${qURL}/people_per_disposal`, ''),
    peoplePerDisposalSorted: (_) => 
      getRequest(`${qURL}/people_per_disposal_sorted`, '')
	},
	Mutation: {
		createDisposalPoint: (_, { disposalPoint }) =>
			generalRequest(`${URL$5}`, 'POST', disposalPoint),
		updateDisposalPoint: (_, { id, disposalPoint }) =>
			generalRequest(`${URL$5}/${id}`, 'PUT', disposalPoint),
		deleteDisposalPoint: (_, { id }) =>
			generalRequest(`${URL$5}/${id}`, 'DELETE')
	}
};

const url$6 = process.env.AUTH_URL || '35.196.104.239';
const port$6 = process.env.AUTH_PORT || '3306';
const entryPoint$6 = process.env.AUTH_ENTRY || 'ldap';

const URL$6 = `http://${url$6}:${port$6}/${entryPoint$6}`;

const resolvers$6 = {
    Mutation: {
        auth: (_, { auth }) =>
            generalRequest(`${URL$6}`, 'POST', auth)
    }
};

// merge the typeDefs
const mergedTypeDefs = mergeSchemas(
	[
		'scalar JSON',
		campaignsTypeDef,
		favoritesTypeDef,
		commentsTypeDef,
		pointsTypeDef,
		usersTypeDef,
    disposalPointTypeDef,
		authTypeDef
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
    disposalPointMutations,
		authMutations
	]
);

// Generate the schema object from your types definition.
var graphQLSchema = graphqlTools.makeExecutableSchema({
	typeDefs: mergedTypeDefs,
	resolvers: merge(
		{ JSON: GraphQLJSON }, // allows scalar JSON
		resolvers$4,
		resolvers$3,
		resolvers$2,
		resolvers,
		resolvers$1,
    resolvers$5,
		resolvers$6
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
