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
		createDisposalPoint: (_, { disposalPoint }) =>
			generalRequest(`${URL}`, 'POST', disposalPoint),
		updateDisposalPoint: (_, { id, disposalPoint }) =>
			generalRequest(`${URL}/${id}`, 'PUT', disposalPoint),
		deleteDisposalPoint: (_, { id }) =>
			generalRequest(`${URL}/${id}`, 'DELETE')
	}
};

export default resolvers;
