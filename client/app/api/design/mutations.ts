import { gql } from "@apollo/client";
export const CREATE_DESIGN = gql`
  mutation createDesign($input: CreateDesignInput!) {
    createDesign(input: $input) {
      workflowId
      workflowName
      description
      category
      created
      xmlCode
      processMap
      formSelection
      addToProject
    }
  }
`;

export const UPDATE_DESIGN_XML = gql`
  mutation updateDesignXml($workflowId: String!, $input:UpdateDesignXmlInput!) {
    updateDesignXml(workflowId: $workflowId, input: $input) {
      workflowId
      xmlCode
     
    }
  }
`;

export const DELETE_DESIGN_XML = gql`
  mutation deleteDesignXml($id: String!) {
    deleteDesignXml(id: $id) {
      workflowId
      xmlCode
    }
  }
`;