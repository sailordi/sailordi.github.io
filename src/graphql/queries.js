export function GET_DATA(id) { return `query {
    user(where: { id: { _eq: "${id}" }}) {
        id
        login
        firstName
        lastName
        email
        auditRatio
    }
  }`}