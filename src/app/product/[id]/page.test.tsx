import { render, screen } from "@testing-library/react";
import ProductPage from "@/app/product/[id]/page";
import { getProductById } from "@/lib/api";
import { notFound } from "next/navigation";
import { mockProducts } from "@/lib/test-utils";

// Mock the API function
jest.mock("@/lib/api", () => ({
  getProductById: jest.fn(),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

describe("ProductPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => { });
  });

  it("renders product details correctly", async () => {
    // Mock the API response
    (getProductById as jest.Mock).mockResolvedValue(mockProducts[1]);

    const page = await ProductPage({ params: { id: "2" } });
    render(page);

    expect(screen.getByText("Test Product 2")).toBeInTheDocument();
    expect(screen.getByText("Another test product")).toBeInTheDocument();
    expect(
      screen.getByText(
        "This is another test product with a different description",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("iOS, ANDROID")).toBeInTheDocument();
    expect(screen.getByText("Get It")).toBeInTheDocument();

    // Check for ranking information
    expect(screen.getByText("#2 Product of theDay")).toBeInTheDocument();
    expect(screen.getByText("2 days ago")).toBeInTheDocument();
  });

  it("calls notFound when product is not found", async () => {
    // Mock API error
    (getProductById as jest.Mock).mockRejectedValue(
      new Error("Product not found"),
    );

    await ProductPage({ params: { id: "999" } });

    expect(notFound).toHaveBeenCalled();
  });
});
