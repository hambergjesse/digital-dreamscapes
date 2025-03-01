import { gql } from "graphql-tag";

const typeDefs = gql`
  type Art {
    id: ID!
    data: String!
    title: String
    palette: String
    complexity: Int
    createdAt: String
    updatedAt: String
  }

  type DeleteResponse {
    id: ID!
    success: Boolean!
  }

  type Query {
    arts: [Art]
    art(id: ID!): Art
  }

  type Mutation {
    saveArt(data: String!, title: String, palette: String, complexity: Int): Art
    deleteArt(id: ID!): DeleteResponse
  }
`;

export default typeDefs;
