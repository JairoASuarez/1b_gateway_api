export const campaignsTypeDef = `
type Campaign {
    _id: String!
    name: String!
    city: String!
    address: String!
    ubication: [Int]!
    created_date: String!
    start_date: String!
    end_date: String!
    status: String!
    program: String!
}

input CampaignInput {
  name: String!
  city: String!
  address: String!
  ubication: [Int]!
  created_date: String!
  start_date: String!
  end_date: String!
  status: String!
  program: String!
}
`;

export const campaignsQueries = `
    allCampaigns: [Campaign]!
    campaignById(id: String!): Campaign!
`;

export const campaignsMutations = `
    createCampaign(campaign: CampaignInput!): Campaign!
    deleteCampaign(id: String!): Campaign!
    updateCampaign(id: String!, campaign: CampaignInput!): Campaign!
`;
