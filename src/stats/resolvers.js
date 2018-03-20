import { generalRequest, getRequest } from '../utilities';
import { url, port, entryPoint } from './server';

const URL = `http://${url}:${port}/${entryPoint}`;

const resolvers = {
	Query: {
		allDisposalPoints: (_) =>
			getRequest(URL, ''),
		disposalPointById: (_, { id }) =>
			generalRequest(`${URL}/${id}`, 'GET'),
	},
	Mutation: {
		createPoint: (_, { point }) =>
			generalRequest(`${URL}`, 'POST', point),
		updatePoint: (_, { id, point }) =>
			generalRequest(`${URL}/${id}`, 'PUT', point),
		deletePoint: (_, { id }) =>
			generalRequest(`${URL}/${id}`, 'DELETE')
	}
};

export default resolvers;
