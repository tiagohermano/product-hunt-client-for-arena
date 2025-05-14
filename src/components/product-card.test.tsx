import { render, screen } from "@testing-library/react";
import ProductCard from "@/components/product-card";
import { mockProducts } from "@/lib/test-utils";

describe("ProductCard", () => {
  it("renders product information correctly", () => {
    render(<ProductCard product={mockProducts[0]} />);

    expect(screen.getByText("Test Product 1")).toBeInTheDocument();
    expect(screen.getByText("This is a test product")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });
});
