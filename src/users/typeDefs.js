export const usersTypeDef = `
type User {
  id: Int!
  name: String!
  lastname: String!
  email: String!
  password: String!

}

input UserInput {
  id: Int!
  name: String!
  lastname: String!
  email: String!
  password: String!
}
`;

export const usersQueries = `
    allUsers: [User]!
    UserById(id: Int!): User!
`;

export const usersMutations = `
    createUser(user: UserInput!): User!
    deleteUser(id: Int!): User!
    updateUser(id: Int!, user: UserInput!): User!
`;
