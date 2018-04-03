import { generalRequest, getRequest } from '../utilities';
import { url, port, entryPoint } from './server';

const URL = `http://${url}:${port}/${entryPoint}`;
const qURL = `http://${url}:${port}`;

const resolvers = {
	Query: {
		allDisposalPoints: (_) =>
			getRequest(URL, ''),
		disposalPointById: (_, { id }) =>
			generalRequest(`${URL}/${id}`, 'GET'),
			
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
			generalRequest(`${URL}`, 'POST', disposalPoint),
		updateDisposalPoint: (_, { id, disposalPoint }) =>
			generalRequest(`${URL}/${id}`, 'PUT', disposalPoint),
		deleteDisposalPoint: (_, { id }) =>
			generalRequest(`${URL}/${id}`, 'DELETE')
	}
};

export default resolvers;
