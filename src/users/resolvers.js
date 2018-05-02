import { generalRequest, getRequest } from '../utilities';
import { url, port, entryPoint } from './server';

const URL = `http://${url}:${port}/${entryPoint}`;

console.log("URL for Users: " + URL);

const resolvers = {
	Query: {
		getCurrentUser: (_) =>
			getRequest(URL, ''),
	},
	Mutation: {
		createUser: (_, { user }) =>
			generalRequest(`${URL}`, 'POST', user),
		updateUser: (_, { id, user }) =>
			generalRequest(`${URL}/${id}`, 'PUT', user),
		deleteUser: (_, { id }) =>
			generalRequest(`${URL}/${id}`, 'DELETE'),
		createSession: (_, { auth }) =>
			generalRequest(`${URL}/auth`, 'POST', auth),
		}
};

export default resolvers;
