export const commentsTypeDef = `
type Comment {
    _id: String!
    content: String!
    score: Float!
    point_id: Int!
}

input CommentInput{
    content: String!
    score: Float!
    point_id: Int!
}
`;

export const commentsQueries = `
    allComments: [Comment]!
    commentById(id: String!): Comment!
    commentByPoint(id: Int!): [Comment]!
`;

export const commentsMutations = `
    createComment(comment: CommentInput!): Comment!
    deleteComment(id: String!): Comment!
    updateComment(id: String!, comment: CommentInput!): Comment!
`;
