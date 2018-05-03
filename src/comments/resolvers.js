import { generalRequest, getRequest } from '../utilities';
import { url, port, entryPoint } from './server';

const URL = `http://${url}:${port}/${entryPoint}`;

console.log("URL for Comments: " + URL);

const resolvers = {
    Query: {
        allComments: (_) =>
            getRequest(URL, ''),
        commentById: (_, { id }) =>
            generalRequest(`${URL}/${id}`, 'GET'),
	commentByPoint: (_, { id }) =>
	    generalRequest(`${URL}?q[point_id_eq]=${id}`, 'GET')
    },
    Mutation: {
        createComment: (_, { comment }) =>
            generalRequest(`${URL}`, 'POST', comment),
        updateComment: (_, { id, comment }) =>
            generalRequest(`${URL}/${id}`, 'PUT', comment),
        deleteComment: (_, { id }) =>
            generalRequest(`${URL}/${id}`, 'DELETE')
    }
};

export default resolvers;
