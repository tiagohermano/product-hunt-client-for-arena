import { fetchMoreProducts } from "@/app/actions";
import { getProducts } from "@/lib/api";
import { mockProducts } from "@/lib/test-utils";

// Mock the API function
jest.mock("@/lib/api", () => ({
  getProducts: jest.fn(),
}));

describe("Server Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetchMoreProducts calls getProducts with correct parameters", async () => {
    // Mock the API response
    (getProducts as jest.Mock).mockResolvedValue({
      products: mockProducts,
      nextCursor: "next-cursor",
    });

    const result = await fetchMoreProducts("popular", "test-cursor");

    expect(getProducts).toHaveBeenCalledWith("popular", "test-cursor");
    expect(result.products).toEqual(mockProducts);
    expect(result.nextCursor).toBe("next-cursor");
  });
});
