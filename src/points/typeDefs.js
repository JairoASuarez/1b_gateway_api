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
    city: String
    departament: String
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
    city: String
    departament: String
}
`;

export const pointsQueries = `
    allPoints: [Point]!
    pointById(id: Int!): Point!
    pointByName(name: String!): [Point]!
    pointByCategory(category: String!, lat_u: Float!, lat_l: Float!, lng_u: Float!, lng_l: Float!): [Point]!
    pointByPosition(latitude_upper: Float, latitude_lower: Float, longitude_upper: Float, longitude_lower: Float): [Point]!
`;

export const pointsMutations = `
    createPoint(point: PointInput!): Point!
    deletePoint(id: Int!): Point!
    updatePoint(id: Int!, point: PointInput!): Point!
`;
