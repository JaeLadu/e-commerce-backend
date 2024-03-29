import algoliasearch from "algoliasearch";

const client = algoliasearch(
   process.env.ALGOLIA_APPLICATION_ID,
   process.env.ALGOLIA_ADMIN_API_KEY
);

export const AlgoliaProductsIndex = client.initIndex("products");
