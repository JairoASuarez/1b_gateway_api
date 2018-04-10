export const pointsTypeDef = `
type Point {
    id: Int!
    name: String!
    address: String!
    category: String!
    contact: String!
    email: String!
    latitude: Float!
    longitude: Float!
    business_hours: String!
}

input PointInput {
    name: String!
    address: String!
    category: String!
    contact: String!
    email: String!
    latitude: Float!
    longitude: Float!
    business_hours: String!
}
`;

export const pointsQueries = `
    allPoints: [Point]!
    pointById(id: Int!): Point!
`;

export const pointsMutations = `
    createPoint(point: PointInput!): Point!
    deletePoint(id: Int!): Point!
    updatePoint(id: Int!, point: PointInput!): Point!
`;
