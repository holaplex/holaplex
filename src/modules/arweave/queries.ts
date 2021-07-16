const transactionBySubdomain = `query GetStorefrontTheme($subdomain: String!) {
  transactions(tags:[{ name: "holaplex:metadata:subdomain", values: [$subdomain]}], first: 1) {
    edges {
      node {
        id
        owner { 
          address
        }
        tags {
          name
          value
        }
      }
    }
  }
}`;

export default {
  transactionBySubdomain
}