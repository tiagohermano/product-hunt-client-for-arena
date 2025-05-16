import { render, screen, waitFor, act } from "@testing-library/react";
import InfiniteProductList from "@/components/infinite-product-list";
import { fetchMoreProducts } from "@/app/actions";
import { mockProducts } from "@/lib/test-utils";

// Mock the server action
jest.mock("@/app/actions", () => ({
  fetchMoreProducts: jest.fn().mockResolvedValue({
    products: [
      {
        id: "3",
        name: "Test Product 3",
        tagline: "A third test product",
        description: "This is the third test product",
        votes_count: 300,
        created_at: "2023-01-03T00:00:00Z",
        website: "https://example.com",
        thumbnail: {
          image_url: "/placeholder.svg?height=40&width=40",
          background_color: "bg-green-400",
        },
        platforms: ["WEB"],
        screenshot_url: "/placeholder.svg?height=400&width=600",
      },
    ],
    nextCursor: null,
  }),
}));

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockImplementation((callback) => {
  const instance = {
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    triggerIntersection: (isIntersecting: boolean) => {
      callback([{ isIntersecting }]);
    },
  };

  // Attach the mock instance to the element for later access
  return instance;
});

window.IntersectionObserver = mockIntersectionObserver;

describe("InfiniteProductList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders initial products correctly", () => {
    render(
      <InfiniteProductList
        initialProducts={mockProducts}
        initialNextCursor="next-cursor"
        type="popular"
      />,
    );

    expect(screen.getByText("Test Product 1")).toBeInTheDocument();
    expect(screen.getByText("Test Product 2")).toBeInTheDocument();
  });

  it("shows no products message when empty", () => {
    render(
      <InfiniteProductList
        initialProducts={[]}
        initialNextCursor={null}
        type="popular"
      />,
    );

    expect(
      screen.getByText("No products found. Please try again later."),
    ).toBeInTheDocument();
  });

  it("loads more products when scrolled to bottom", async () => {
    const { container } = render(
      <div style={{ height: "400px", overflow: "auto" }}>
        <InfiniteProductList
          initialProducts={mockProducts}
          initialNextCursor="next-cursor"
          type="popular"
        />
      </div>,
    );

    const sentinel = container.querySelector(
      '[data-testid="infinite-scroll-sentinel"]',
    );
    expect(sentinel).toBeInTheDocument();

    act(() => {
      const mockIntersectionObserverInstance = mockIntersectionObserver(() =>
        fetchMoreProducts("popular", "next-cursor"),
      );
      mockIntersectionObserverInstance.triggerIntersection(true);
    });

    expect(fetchMoreProducts).toHaveBeenCalledWith("popular", "next-cursor");
  });

  it("resets products when type changes", () => {
    const { rerender } = render(
      <InfiniteProductList
        initialProducts={mockProducts}
        initialNextCursor="next-cursor"
        type="popular"
      />,
    );

    expect(screen.getByText("Test Product 1")).toBeInTheDocument();

    // New products for the "newest" tab
    const newestProducts = [
      {
        id: "4",
        name: "Newest Product",
        tagline: "A newest product",
        description: "This is the newest product",
        votes_count: 50,
        created_at: "2023-01-04T00:00:00Z",
        website: "https://example.com",
        thumbnail: {
          image_url: "/placeholder.svg?height=40&width=40",
          background_color: "bg-purple-400",
        },
        platforms: ["WEB"],
        screenshot_url: "/placeholder.svg?height=400&width=600",
      },
    ];

    // Rerender with different type and products
    rerender(
      <InfiniteProductList
        initialProducts={newestProducts}
        initialNextCursor="different-cursor"
        type="newest"
      />,
    );

    // Check that the products have been reset
    expect(screen.queryByText("Test Product 1")).not.toBeInTheDocument();
    expect(screen.getByText("Newest Product")).toBeInTheDocument();
  });
});
