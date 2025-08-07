# Testing Guide

## 🧪 Testing Strategy

BlogVerse uses a comprehensive testing approach to ensure code quality, reliability, and maintainability across both frontend and backend components.

## Testing Philosophy

### Testing Pyramid

- **Unit Tests (70%)** - Fast, isolated tests for individual functions/components
- **Integration Tests (20%)** - Test component interactions and API endpoints
- **End-to-End Tests (10%)** - Full user journey testing

### Test-Driven Development (TDD)

While not strictly required, we encourage TDD practices:

1. Write failing tests first
2. Write minimal code to pass tests
3. Refactor while keeping tests green

## Frontend Testing

### Testing Stack

- **Vitest** - Fast unit test runner (Vite-based)
- **React Testing Library** - Component testing utilities
- **Jest DOM** - Custom DOM matchers
- **MSW (Mock Service Worker)** - API mocking
- **Playwright** - End-to-end testing

### Setup and Configuration

#### Vitest Configuration

```javascript
// vite.config.ts
import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    exclude: [...configDefaults.exclude, "e2e/*"],
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "src/test/", "**/*.d.ts", "**/*.config.ts"],
    },
  },
});
```

#### Test Setup File

```javascript
// src/test/setup.ts
import "@testing-library/jest-dom";
import { server } from "./mocks/server";

// Establish API mocking before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

// Reset any request handlers between tests
afterEach(() => server.resetHandlers());

// Clean up after all tests
afterAll(() => server.close());

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

### Unit Testing Components

#### Basic Component Test

```javascript
// src/components/__tests__/BlogCard.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import BlogCard from "../BlogCard";
import { formatDate } from "../../utils/dateUtils";

const mockBlog = {
  id: "1",
  title: "Test Blog Post",
  content: "This is test content",
  author: {
    id: "1",
    name: "John Doe",
    avatar: "avatar.jpg",
  },
  category: "Technology",
  likesCount: 5,
  createdAt: new Date("2023-01-01"),
  isLiked: false,
};

describe("BlogCard", () => {
  const mockOnLike = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders blog information correctly", () => {
    render(<BlogCard blog={mockBlog} onLike={mockOnLike} />);

    expect(screen.getByText("Test Blog Post")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Technology")).toBeInTheDocument();
    expect(screen.getByText("5 likes")).toBeInTheDocument();
  });

  it("calls onLike when like button is clicked", async () => {
    render(<BlogCard blog={mockBlog} onLike={mockOnLike} />);

    const likeButton = screen.getByRole("button", { name: /like/i });
    fireEvent.click(likeButton);

    await waitFor(() => {
      expect(mockOnLike).toHaveBeenCalledWith(mockBlog.id);
    });
  });

  it("shows liked state correctly", () => {
    const likedBlog = { ...mockBlog, isLiked: true };
    render(<BlogCard blog={likedBlog} onLike={mockOnLike} />);

    expect(screen.getByRole("button", { name: /unlike/i })).toBeInTheDocument();
  });
});
```

#### Testing Custom Hooks

```javascript
// src/hooks/__tests__/useAuth.test.ts
import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import useAuth from "../useAuth";
import * as AuthContext from "../../context/AuthContext";

const mockAuthContext = {
  user: null,
  login: vi.fn(),
  logout: vi.fn(),
  loading: false,
};

vi.mock("../../context/AuthContext", () => ({
  useAuthContext: () => mockAuthContext,
}));

describe("useAuth", () => {
  it("returns auth context values", () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(typeof result.current.login).toBe("function");
  });

  it("calls login function correctly", async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login("test@example.com", "password");
    });

    expect(mockAuthContext.login).toHaveBeenCalledWith(
      "test@example.com",
      "password"
    );
  });
});
```

### Integration Testing

#### API Integration Tests

```javascript
// src/services/__tests__/blogService.test.ts
import { http, HttpResponse } from "msw";
import { server } from "../test/mocks/server";
import { blogService } from "../blogService";

describe("blogService", () => {
  it("fetches blogs successfully", async () => {
    const mockBlogs = [
      { id: "1", title: "Test Blog 1" },
      { id: "2", title: "Test Blog 2" },
    ];

    server.use(
      http.get("/api/blogs", () => {
        return HttpResponse.json({ blogs: mockBlogs });
      })
    );

    const result = await blogService.getBlogs();
    expect(result.blogs).toHaveLength(2);
    expect(result.blogs[0].title).toBe("Test Blog 1");
  });

  it("handles API errors gracefully", async () => {
    server.use(
      http.get("/api/blogs", () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    await expect(blogService.getBlogs()).rejects.toThrow(
      "Failed to fetch blogs"
    );
  });
});
```

### Testing with Context Providers

```javascript
// src/test/utils.tsx
import { render, RenderOptions } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { AuthProvider } from "../context/AuthContext";
import theme from "../theme";

interface CustomRenderOptions extends RenderOptions {
  initialEntries?: string[];
}

const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

const customRender = (ui: React.ReactElement, options?: CustomRenderOptions) =>
  render(ui, { wrapper: AllProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
```

## Backend Testing

### Testing Stack

- **Jest** - Test runner and assertion library
- **Supertest** - HTTP assertions
- **MongoDB Memory Server** - In-memory database for testing
- **Factory-bot** - Test data generation

### Setup and Configuration

#### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.js"],
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/test/**",
    "!src/config/**",
    "!**/node_modules/**",
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

#### Test Setup

```javascript
// src/test/setup.js
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

let mongod;

// Connect to in-memory database before tests
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

// Clean up database between tests
beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Disconnect and stop in-memory database after tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});
```

### Unit Testing Routes

#### Authentication Route Tests

```javascript
// src/routes/__tests__/auth.test.js
const request = require("supertest");
const app = require("../../server");
const User = require("../../models/User");
const { createUser } = require("../test/factories/userFactory");

describe("Auth Routes", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("userId");

      // Verify user was created in database
      const user = await User.findById(response.body.userId);
      expect(user).toBeTruthy();
      expect(user.email).toBe(userData.email);
    });

    it("should return 400 for missing required fields", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({ email: "test@example.com" })
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });

    it("should return 409 for duplicate email", async () => {
      await createUser({ email: "existing@example.com" });

      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "John Doe",
          email: "existing@example.com",
          password: "password123",
        })
        .expect(409);

      expect(response.body.error).toContain("already exists");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login user with correct credentials", async () => {
      const user = await createUser({
        email: "test@example.com",
        password: "password123",
        isVerified: true,
      });

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "password123",
        })
        .expect(200);

      expect(response.body).toHaveProperty("token");
      expect(response.body.user.email).toBe("test@example.com");
    });

    it("should reject unverified users", async () => {
      await createUser({
        email: "unverified@example.com",
        password: "password123",
        isVerified: false,
      });

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "unverified@example.com",
          password: "password123",
        })
        .expect(401);

      expect(response.body.error).toContain("verify");
    });
  });
});
```

### Testing Models

```javascript
// src/models/__tests__/User.test.js
const User = require("../User");
const bcrypt = require("bcryptjs");

describe("User Model", () => {
  describe("Password hashing", () => {
    it("should hash password before saving", async () => {
      const user = new User({
        name: "John Doe",
        email: "john@example.com",
        password: "plainpassword",
      });

      await user.save();
      expect(user.password).not.toBe("plainpassword");
      expect(user.password).toMatch(/^\$2[ayb]\$.{56}$/);
    });
  });

  describe("comparePassword method", () => {
    it("should return true for correct password", async () => {
      const user = new User({
        name: "John Doe",
        email: "john@example.com",
        password: "testpassword",
      });
      await user.save();

      const isMatch = await user.comparePassword("testpassword");
      expect(isMatch).toBe(true);
    });

    it("should return false for incorrect password", async () => {
      const user = new User({
        name: "John Doe",
        email: "john@example.com",
        password: "testpassword",
      });
      await user.save();

      const isMatch = await user.comparePassword("wrongpassword");
      expect(isMatch).toBe(false);
    });
  });
});
```

### Factory Pattern for Test Data

```javascript
// src/test/factories/userFactory.js
const User = require("../../models/User");

const createUser = async (overrides = {}) => {
  const defaultUser = {
    name: "Test User",
    email: "test@example.com",
    password: "password123",
    isVerified: true,
    ...overrides,
  };

  const user = new User(defaultUser);
  await user.save();
  return user;
};

const createManyUsers = async (count, overrides = {}) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    const user = await createUser({
      email: `user${i}@example.com`,
      ...overrides,
    });
    users.push(user);
  }
  return users;
};

module.exports = { createUser, createManyUsers };
```

## End-to-End Testing

### Playwright Configuration

```javascript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Examples

```javascript
// e2e/auth.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test("should register and login user", async ({ page }) => {
    // Navigate to registration page
    await page.goto("/register");

    // Fill registration form
    await page.fill('[name="name"]', "E2E Test User");
    await page.fill('[name="email"]', "e2e@example.com");
    await page.fill('[name="password"]', "password123");
    await page.fill('[name="confirmPassword"]', "password123");

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to email verification page
    await expect(page).toHaveURL("/verify-email");
    await expect(page.locator("text=Check your email")).toBeVisible();

    // For testing purposes, simulate email verification
    // In real tests, you might have a test endpoint to verify emails

    // Navigate to login
    await page.goto("/login");

    // Fill login form
    await page.fill('[name="email"]', "e2e@example.com");
    await page.fill('[name="password"]', "password123");
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL("/dashboard");
    await expect(page.locator("text=Welcome back")).toBeVisible();
  });

  test("should show error for invalid login", async ({ page }) => {
    await page.goto("/login");

    await page.fill('[name="email"]', "invalid@example.com");
    await page.fill('[name="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Invalid credentials")).toBeVisible();
  });
});
```

### Blog Flow E2E Tests

```javascript
// e2e/blog.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Blog Management", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto("/login");
    await page.fill('[name="email"]', "testuser@example.com");
    await page.fill('[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/dashboard");
  });

  test("should create and publish blog post", async ({ page }) => {
    // Navigate to create post
    await page.click("text=Create Post");
    await expect(page).toHaveURL("/create-post");

    // Fill blog form
    await page.fill('[name="title"]', "E2E Test Blog Post");
    await page.selectOption('[name="category"]', "Technology");

    // Fill rich text editor
    const editor = page.locator(".ql-editor");
    await editor.fill("This is the content of the test blog post.");

    // Add tags
    await page.fill('[name="tags"]', "testing, e2e, playwright");

    // Publish post
    await page.click('button:has-text("Publish")');

    // Should redirect to the new post
    await expect(
      page.locator('h1:has-text("E2E Test Blog Post")')
    ).toBeVisible();
    await expect(page.locator("text=Technology")).toBeVisible();
  });

  test("should like and comment on blog post", async ({ page }) => {
    // Assume there's a blog post already available
    await page.goto("/blogs/1");

    // Like the post
    const likeButton = page.locator('button:has-text("Like")');
    await likeButton.click();
    await expect(page.locator('button:has-text("Unlike")')).toBeVisible();

    // Add a comment
    await page.fill('[name="comment"]', "Great blog post!");
    await page.click('button:has-text("Post Comment")');

    // Comment should appear
    await expect(page.locator("text=Great blog post!")).toBeVisible();
  });
});
```

## Test Commands

### Frontend Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test BlogCard.test.tsx

# Run tests matching pattern
npm test --testNamePattern="should render"
```

### Backend Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test suite
npm test -- --testPathPattern=auth

# Run tests in watch mode
npm run test:watch

# Run integration tests only
npm run test:integration
```

### E2E Tests

```bash
# Run all e2e tests
npm run e2e

# Run e2e tests in headed mode
npm run e2e:headed

# Run specific test file
npm run e2e auth.spec.ts

# Generate test report
npm run e2e:report
```

## Coverage and Quality

### Coverage Thresholds

- **Statements:** 80%
- **Branches:** 75%
- **Functions:** 80%
- **Lines:** 80%

### Quality Gates

- All tests must pass before merging
- Coverage thresholds must be met
- No console errors in tests
- E2E tests must pass on CI

## Testing Best Practices

### Writing Good Tests

1. **Test Behavior, Not Implementation**

   ```javascript
   // ❌ Testing implementation details
   expect(component.state.isLoading).toBe(true);

   // ✅ Testing user-visible behavior
   expect(screen.getByText("Loading...")).toBeInTheDocument();
   ```

2. **Use Descriptive Test Names**

   ```javascript
   // ❌ Vague test name
   test("user test", () => {});

   // ✅ Descriptive test name
   test("should display error message when login fails with invalid credentials", () => {});
   ```

3. **Follow AAA Pattern**
   ```javascript
   test("should calculate total price with tax", () => {
     // Arrange
     const items = [{ price: 10 }, { price: 20 }];
     const taxRate = 0.1;

     // Act
     const total = calculateTotal(items, taxRate);

     // Assert
     expect(total).toBe(33);
   });
   ```

### Test Organization

- Group related tests with `describe` blocks
- Use `beforeEach`/`afterEach` for test setup/cleanup
- Keep tests independent of each other
- Use factories for test data creation

### Mock Guidelines

- Mock external dependencies only
- Use real implementations when possible
- Keep mocks simple and focused
- Reset mocks between tests

## Continuous Integration

### GitHub Actions Test Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"
          cache-dependency-path: client/package-lock.json

      - name: Install dependencies
        run: cd client && npm ci

      - name: Run tests
        run: cd client && npm test

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: client/coverage/lcov.info

  backend-tests:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:5.0
        ports:
          - 27017:27017

    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"
          cache-dependency-path: server/package-lock.json

      - name: Install dependencies
        run: cd server && npm ci

      - name: Run tests
        run: cd server && npm test
        env:
          MONGODB_URI: mongodb://localhost:27017/test
          JWT_SECRET: test-secret-key-for-testing-only

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: |
          cd client && npm ci
          cd ../server && npm ci

      - name: Install Playwright
        run: npx playwright install

      - name: Start application
        run: |
          cd server && npm start &
          cd client && npm run build && npm run preview &
          sleep 30  # Wait for services to start

      - name: Run E2E tests
        run: npm run e2e

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

This comprehensive testing guide ensures BlogVerse maintains high quality and reliability across all components.
