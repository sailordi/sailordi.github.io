export const GET_USER = `query {
    user(where: { id: { _eq: $id }}) {
        login
        auditRatio
    }
  }`