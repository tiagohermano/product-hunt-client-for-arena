// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
    this.elements = new Set();
    this.mockIsIntersecting = false;
  }

  observe(element) {
    this.elements.add(element);
  }

  unobserve(element) {
    this.elements.delete(element);
  }

  disconnect() {
    this.elements.clear();
  }

  // Helper method to simulate an intersection
  triggerIntersection(isIntersecting) {
    this.mockIsIntersecting = isIntersecting;
    this.callback(
      [...this.elements].map((element) => ({
        isIntersecting,
        target: element,
        intersectionRatio: isIntersecting ? 1 : 0,
      })),
      this,
    );
  }
}

global.IntersectionObserver = MockIntersectionObserver;

// Mock next/navigation
import { jest } from "@jest/globals";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => "/test-path",
  notFound: jest.fn(),
}));

// Mock server actions
jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    useActionState: jest.fn().mockImplementation((action) => {
      return [null, action, false];
    }),
  };
});
