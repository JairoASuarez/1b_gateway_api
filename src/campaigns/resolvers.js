import { generalRequest, getRequest } from '../utilities';
import { url, port, entryPoint } from './server';

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

export default resolvers;
