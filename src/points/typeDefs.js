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
    pointByName(name: String!): [Point]!
    pointByPosition(latitude_upper: Float, latitude_lower: Float, longitude_upper: Float, longitude_lower: Float): [Point]!
`;

export const pointsMutations = `
    createPoint(point: PointInput!): Point!
    deletePoint(id: Int!): Point!
    updatePoint(id: Int!, point: PointInput!): Point!
`;
