export const usersTypeDef = `
type User {
  id: Int!
  username: String!
  email: String!
  password: String!
}

type Token {
  jwt: String!
}

input AuthenticationInput {
  email: String!
  password: String!
}

input UserInput {
  username: String!
  email: String!
  password: String!
}

input SessionInput {
  auth: AuthenticationInput!
}

`;

export const usersQueries = `
    getCurrentUser: [User]!
`;

export const usersMutations = `
    createUser(user: UserInput!): User!
    deleteUser(id: Int!): User!
    updateUser(id: Int!, user: UserInput!): User!
    createSession(auth: SessionInput!): Token!
`;
