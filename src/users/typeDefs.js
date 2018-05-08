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

type Session {
  id: Int!
  username: String!
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

input TokenInput {
  token: String!
}

`;

export const usersQueries = `
    checkSession(token: TokenInput!): Session!
`;

export const usersMutations = `
    createUser(user: UserInput!): User!
    deleteUser(id: Int!): User!
    updateUser(id: Int!, user: UserInput!): User!
    createSession(auth: SessionInput!): Token!
`;
