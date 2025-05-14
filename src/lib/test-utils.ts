export const mockProducts = [
  {
    id: "1",
    name: "Test Product 1",
    tagline: "This is a test product",
    description: "This is a detailed description of the test product",
    votes_count: 100,
    created_at: "2023-01-01T00:00:00Z",
    website: "https://example.com",
    thumbnail: {
      image_url: "/placeholder.svg?height=40&width=40",
      background_color: "bg-yellow-400",
    },
    platforms: ["WEB"],
    screenshot_url: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "2",
    name: "Test Product 2",
    tagline: "Another test product",
    description: "This is another test product with a different description",
    votes_count: 200,
    created_at: "2023-01-02T00:00:00Z",
    website: "https://example.com",
    thumbnail: {
      image_url: "/placeholder.svg?height=40&width=40",
      background_color: "bg-blue-400",
    },
    platforms: ["iOS", "ANDROID"],
    screenshot_url: "/placeholder.svg?height=400&width=600",
    ranking: {
      position: 2,
      date: "2 days ago",
    },
  },
];
