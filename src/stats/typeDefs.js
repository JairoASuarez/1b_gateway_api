export const disposalPointTypeDef = `
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

export const disposalPointQueries = `
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

export const disposalPointMutations = `
    createDisposalPoint(disposalPoint: DisposalPointInput!): DisposalPoint!
    deleteDisposalPoint(id: Int!): DisposalPoint!
    updateDisposalPoint(id: Int!, disposalPoint: DisposalPointInput!): DisposalPoint!
`;
