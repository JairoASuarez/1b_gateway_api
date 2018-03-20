export const favoritesTypeDef = `
type Favorite {
  id: Int!
  user_id: Int!
  place_id: Int!
  comment: String!
}

input FavoriteInput {
  id: Int!
  user_id: Int!
  place_id: Int!
  comment: String!
}
`;

export const favoritessQueries = `
    allFavorites: [Favorite]!
    FavoriteById(id: Int!): Favorite!
`;

export const favoritessMutations = `
    createFavorite(favorite: FavoriteInput!): Favorite!
    deleteFavorite(id: Int!): Favorite!
    updateFavorite(id: Int!, favorite: FavoriteInput!): Favorite!
`;
