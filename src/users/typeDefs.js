export const usersTypeDef = `
type User {
  id: Int!
  username: String!
  email: String!
  password: String!
}

type Auth {
  email: String!
  password: String!
  token: String!
}

input UserInput {
  username: String!
  email: String!
  password: String!
}

input SessionInput {
  email: String!
  password: String!
}

`;

export const usersQueries = `
    getCurrentUser: [User]!
`;

export const usersMutations = `
    createUser(user: UserInput!): User!
    deleteUser(id: Int!): User!
    updateUser(id: Int!, user: UserInput!): User!
    createSession(auth: SessionInput!): Auth!
`;
