export function GET_USER(id) { return `query {
    user(where: { id: { _eq: "${id}" }}) {
        login
        auditRatio
    }
  }`}