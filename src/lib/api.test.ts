import { getProducts, getProductById } from "@/lib/api";
import { jest } from "@jest/globals";

// Mock fetch
global.fetch = jest.fn();

describe("API Functions", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("getProducts", () => {
    it("should fetch products successfully", async () => {
      // Mock successful API response
      const mockResponse = {
        data: {
          posts: {
            pageInfo: {
              endCursor: "cursor123",
              hasNextPage: true,
            },
            edges: [
              {
                node: {
                  id: "1",
                  name: "Test Product 1",
                  tagline: "This is a test product",
                  description:
                    "This is a detailed description of the test product",
                  votesCount: 100,
                  createdAt: "2023-01-01T00:00:00Z",
                  website: "https://example.com",
                  thumbnail: {
                    url: "/placeholder.svg?height=40&width=40",
                  },
                  topics: {
                    edges: [
                      {
                        node: {
                          name: "WEB",
                        },
                      },
                    ],
                  },
                  media: [
                    {
                      type: "image",
                      url: "/placeholder.svg?height=400&width=600",
                    },
                  ],
                  featuredAt: null,
                },
              },
            ],
          },
        },
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getProducts("popular");

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(result.products).toHaveLength(1);
      expect(result.products[0].name).toBe("Test Product 1");
      expect(result.nextCursor).toBe("cursor123");
    });

    it("should handle API errors gracefully", async () => {
      // Mock API error
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const result = await getProducts("newest");

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(result.products).toHaveLength(0);
      expect(result.nextCursor).toBeNull();
    });

    it("should handle GraphQL errors", async () => {
      // Mock GraphQL error
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          errors: [{ message: "GraphQL Error" }],
        }),
      });

      const result = await getProducts("popular");

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(result.products).toHaveLength(0);
      expect(result.nextCursor).toBeNull();
    });
  });

  describe("getProductById", () => {
    it("should fetch a product by ID successfully", async () => {
      // Mock successful API response
      const mockResponse = {
        data: {
          post: {
            id: "1",
            name: "Test Product 1",
            tagline: "This is a test product",
            description: "This is a detailed description of the test product",
            votesCount: 100,
            createdAt: "2023-01-01T00:00:00Z",
            website: "https://example.com",
            thumbnail: {
              url: "/placeholder.svg?height=40&width=40",
            },
            topics: {
              edges: [
                {
                  node: {
                    name: "WEB",
                  },
                },
              ],
            },
            media: [
              {
                type: "image",
                url: "/placeholder.svg?height=400&width=600",
              },
            ],
            featuredAt: null,
          },
        },
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getProductById("1");

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(result.id).toBe("1");
      expect(result.name).toBe("Test Product 1");
    });

    it("should throw an error when product is not found", async () => {
      // Mock API response with no post
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            post: null,
          },
        }),
      });

      await expect(getProductById("999")).rejects.toThrow(
        "Failed to fetch product details",
      );
    });
  });
});
