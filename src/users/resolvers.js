import { generalRequest, getRequest, authRequest } from '../utilities';
import { url, port, entryPoint } from './server';

const URL = `http://${url}:${port}/${entryPoint}`;

console.log("URL for Users: " + URL);

const resolvers = {
	Query: {
		checkSession: (_, { token }) =>
        authRequest(`${URL}`, 'GET', token),
	},
	Mutation: {
		createUser: (_, { user }) =>
			generalRequest(`${URL}`, 'POST', user),
		updateUser: (_, { id, user, token }) =>
			authRequest(`${URL}/${id}`, 'PATCH', token, user),
		deleteUser: (_, { id }) =>
			generalRequest(`${URL}/${id}`, 'DELETE'),
		createSession: (_, { auth }) =>
			generalRequest(`${URL}/auth`, 'POST', auth),
		}
};

export default resolvers;
