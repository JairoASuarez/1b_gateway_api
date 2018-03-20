import { generalRequest, getRequest } from '../utilities';
import { url, port, entryPoint } from './server';

const URL = `http://${url}:${port}/${entryPoint}`;

const resolvers = {
	Query: {
		allFavorites	: (_) =>
			getRequest(URL, ''),
		FavoriteById: (_, { id }) =>
			generalRequest(`${URL}/${id}`, 'GET'),
	},
	Mutation: {
		createFavorite: (_, { favorite }) =>
			generalRequest(`${URL}`, 'POST', favorite),
		updateFavorite: (_, { id, favorite }) =>
			generalRequest(`${URL}/${id}`, 'PUT', favorite),
		deleteFavorite: (_, { id }) =>
			generalRequest(`${URL}/${id}`, 'DELETE')
	}
};

export default resolvers;
