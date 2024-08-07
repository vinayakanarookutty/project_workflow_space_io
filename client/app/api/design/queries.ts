import { gql } from "@apollo/client";

export const GET_DESIGN = gql`
  query getDesigns {
    getDesigns {
      workflowId
      workflowName
      category
      description
      created
      xmlCode
      processMap
      formSelection
      addToProject
    }
  }
`;
