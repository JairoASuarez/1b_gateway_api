export const commentsTypeDef = `
type Comment {
    _id: String!
    content: String!
    score: Double!
    point_id: Integer!
}

input CommentInput{
    _id: String!
    content: String!
    score: Double!
    point_id: Integer!
}
`;

export const commentsQueries = `
    allComments: [Comment]!
    commentById(id: String!): Comment!
`;

export const commentsMutations = `
    createComment(comment: CommentInput!): Comment!
    deleteComment(id: String!): Comment!
    updateComment(id: String!, comment: CommentInput!): Comment!
`;