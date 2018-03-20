export const pointsTypeDef = `
type Point {
    id: Integer!
    latitude: Float!
    longitude: Float!
    name: String!
    category: String!
    subcategory: String!
}

input PointInput {
    id: Integer!
    latitude: Float!
    longitude: Float!
    name: String!
    category: String!
    subcategory: String!
}
`;

export const pointsQueries = `
    createPoint(point: PointInput!): Point!
    deletePoint(id: Integer!): Point!
    updatePoint(id: Integer!, point: PointInput!): Point!
`;
