import "@testing-library/jest-dom";

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
