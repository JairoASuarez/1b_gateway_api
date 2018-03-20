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

export const favoritesQueries = `
    allFavorites: [Favorite]!
    FavoriteById(id: Int!): Favorite!
`;

export const favoritesMutations = `
    createFavorite(favorite: FavoriteInput!): Favorite!
    deleteFavorite(id: Int!): Favorite!
    updateFavorite(id: Int!, favorite: FavoriteInput!): Favorite!
`;
