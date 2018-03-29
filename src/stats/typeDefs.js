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
`;

export const disposalPointQueries = `
    allDisposalPoints: [DisposalPoint]!
    disposalPointById(id: Int!): DisposalPoint!
`;

export const disposalPointMutations = `
    createPoint(disposalPoint: DisposalPointInput!): DisposalPoint!
    deletePoint(id: Int!): DisposalPoint!
    updatePoint(id: Int!, disposalPoint: DisposalPointInput!): DisposalPoint!
`;
