import type { Product } from "./types";

export async function getProducts(
  type: "popular" | "newest",
  cursor?: string,
  limit = 10,
): Promise<{ products: Product[]; nextCursor: string | null }> {
  try {
    const response = await fetch("https://api.producthunt.com/v2/api/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PRODUCT_HUNT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query GetPosts($cursor: String, $first: Int!) {
            posts(first: $first, after: $cursor, order: ${type === "popular" ? "RANKING" : "NEWEST"}) {
              pageInfo {
                endCursor
                hasNextPage
              }
              edges {
                node {
                  id
                  name
                  tagline
                  description
                  votesCount
                  createdAt
                  website
                  thumbnail {
                    url
                  }
                  topics {
                    edges {
                      node {
                        name
                      }
                    }
                  }
                  media {
                    type
                    url
                    videoUrl
                  }
                  featuredAt
                }
              }
            }
          }
        `,
        variables: {
          cursor: cursor || null,
          first: limit,
        },
      }),
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      console.error("GraphQL Errors:", data.errors);
      throw new Error("Error fetching data from Product Hunt API");
    }

    const products = data.data.posts.edges.map((edge: any) => ({
      id: edge.node.id,
      name: edge.node.name,
      tagline: edge.node.tagline,
      description: edge.node.description || edge.node.tagline,
      votes_count: edge.node.votesCount,
      created_at: edge.node.createdAt,
      thumbnail: {
        image_url:
          edge.node.thumbnail?.url || "/placeholder.svg?height=40&width=40",
        background_color: "bg-yellow-400", // Default background color
      },
      platforms: edge.node.topics?.edges?.map((e: any) => e.node.name) || [],
      screenshot_url:
        edge.node.media?.find((m: any) => m.type === "image")?.url ||
        "/placeholder.svg?height=400&width=600",
      ranking: edge.node.featuredAt
        ? {
          position: Math.floor(Math.random() * 10) + 1, // This is a placeholder since the API doesn't provide ranking position
          date: new Date(edge.node.featuredAt).toLocaleDateString(),
        }
        : undefined,
    }));

    return {
      products,
      nextCursor: data.data.posts.pageInfo.hasNextPage
        ? data.data.posts.pageInfo.endCursor
        : null,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], nextCursor: null }; // Return empty array on error
  }
}

export async function getProductById(id: string): Promise<Product> {
  try {
    const response = await fetch("https://api.producthunt.com/v2/api/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PRODUCT_HUNT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query {
            post(id: "${id}") {
              id
              name
              tagline
              description
              votesCount
              createdAt
              website
              thumbnail {
                url
              }
              topics {
                edges {
                  node {
                    name
                  }
                }
              }
              media {
                type
                url
                videoUrl
              }
              featuredAt
            }
          }
        `,
      }),
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      console.error("GraphQL Errors:", data.errors);
      throw new Error("Error fetching data from Product Hunt API");
    }

    const post = data.data.post;

    if (!post) {
      throw new Error(`Product with ID ${id} not found`);
    }

    return {
      id: post.id,
      name: post.name,
      tagline: post.tagline,
      description: post.description || post.tagline,
      votes_count: post.votesCount,
      created_at: post.createdAt,
      website: post.website,
      thumbnail: {
        image_url: post.thumbnail?.url || "/placeholder.svg?height=40&width=40",
        background_color: "bg-yellow-400", // Default background color
      },
      platforms: post.topics?.edges?.map((e: any) => e.node.name) || [],
      screenshot_url:
        post.media?.find((m: any) => m.type === "image")?.url ||
        "/placeholder.svg?height=400&width=600",
      ranking: post.featuredAt
        ? {
          position: Math.floor(Math.random() * 10) + 1, // This is a placeholder since the API doesn't provide ranking position
          date: new Date(post.featuredAt).toLocaleDateString(),
        }
        : undefined,
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product details");
  }
}
