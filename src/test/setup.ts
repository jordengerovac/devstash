import { vi } from "vitest";

// Mock Next.js server-only modules so server actions and utilities
// can be imported and tested outside of a Next.js request context.

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockReturnValue({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
    has: vi.fn(),
  }),
  headers: vi.fn().mockReturnValue({
    get: vi.fn(),
    has: vi.fn(),
  }),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  unstable_cache: vi.fn((fn: () => unknown) => fn),
}));
