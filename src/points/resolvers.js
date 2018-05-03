import { generalRequest, getRequest } from '../utilities';
import { url, port, entryPoint } from './server';

const URL = `http://${url}:${port}/${entryPoint}`;

console.log("URL for Points: " + URL);

const resolvers = {
  Query: {
    allPoints: (_) =>
        getRequest(URL, ''),
    pointById: (_, { id }) =>
        generalRequest(`${URL}/${id}`, 'GET'),
    pointByName: (_, { name } ) =>
        generalRequest(`${URL}?q[name_cont]=${name}`, 'GET'),
    pointByCategory: (_, { category, lat_u, lat_l, lng_u, lng_l } ) =>
        generalRequest(`${URL}?q[category_cont]=${category}&q[latitude_lteq]=${lat_u}&q[latitude_gteq]=${lat_l}&q[longitude_lteq]=${lng_u}&q[longitude_gteq]=${lng_l}`, 'GET'),
    pointByPosition: (_, { latitude_upper, latitude_lower, longitude_upper, longitude_lower } ) =>
        generalRequest(`${URL}?q[latitude_lteq]=${latitude_upper}&q[latitude_gteq]=${latitude_lower}&q[longitude_lteq]=${longitude_upper}&q[longitude_gteq]=${longitude_lower}`, 'GET'),
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
