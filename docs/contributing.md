# Contributing Guidelines

## 🤝 Welcome Contributors!

We welcome contributions to BlogVerse! Whether you're fixing bugs, adding features, improving documentation, or suggesting enhancements, your help makes BlogVerse better for everyone.

## Getting Started

### Prerequisites for Contributors

- **Node.js** (v16 or higher)
- **Git** for version control
- **Code editor** (VS Code recommended)
- **Basic knowledge** of React, Node.js, and MongoDB
- **Familiarity** with TypeScript (helpful but not required)

### Development Setup

1. **Fork the Repository**

   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/BlogVerse.git
   cd BlogVerse
   ```

2. **Set Up Upstream Remote**

   ```bash
   git remote add upstream https://github.com/Sagar4173/BlogVerse.git
   ```

3. **Install Dependencies**

   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

4. **Set Up Environment**

   - Follow the [Installation Guide](installation.md) to set up your `.env` files
   - Use development/testing credentials, not production ones

5. **Verify Setup**

   ```bash
   # Start backend
   cd server
   npm run dev

   # Start frontend (in another terminal)
   cd client
   npm run dev
   ```

## Contribution Workflow

### 1. Before You Start

- **Check existing issues** to see if someone is already working on it
- **Create or comment on an issue** to discuss your planned changes
- **Keep changes focused** - one feature/fix per pull request
- **Follow our coding standards** (see below)

### 2. Creating a Branch

```bash
# Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/amazing-feature
# or
git checkout -b fix/bug-description
# or
git checkout -b docs/documentation-update
```

### 3. Making Changes

#### Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

#### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

**Examples:**

```bash
feat(auth): add email verification system
fix(blog): resolve image upload timeout issue
docs(api): update authentication endpoint documentation
refactor(user): simplify profile update logic
test(blog): add tests for blog creation
chore(deps): update dependencies to latest versions
```

**Types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks
- `perf` - Performance improvements
- `style` - Code style changes (formatting, etc.)

### 4. Code Standards

#### JavaScript/TypeScript Guidelines

**General Principles:**

- Write clean, readable, and self-documenting code
- Follow existing code patterns and conventions
- Use meaningful variable and function names
- Add comments for complex logic only

**Formatting:**

- Use **2 spaces** for indentation
- Use **single quotes** for strings
- Add **semicolons** at the end of statements
- Keep **line length under 100 characters**

**React/Frontend Guidelines:**

```javascript
// ✅ Good
const BlogCard = ({ blog, onLike, className }) => {
  const [isLiked, setIsLiked] = useState(blog.isLiked);

  const handleLike = useCallback(async () => {
    try {
      await onLike(blog.id);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  }, [blog.id, isLiked, onLike]);

  return (
    <Card className={`blog-card ${className}`}>
      <CardContent>
        <Typography variant="h6">{blog.title}</Typography>
        <Button onClick={handleLike}>{isLiked ? "Unlike" : "Like"}</Button>
      </CardContent>
    </Card>
  );
};
```

**Backend/Node.js Guidelines:**

```javascript
// ✅ Good
const createBlog = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        error: "Title and content are required",
      });
    }

    const blog = new Blog({
      title,
      content,
      category,
      author: userId,
    });

    await blog.save();

    res.status(201).json({
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};
```

#### File Organization

- **Components:** PascalCase (`BlogCard.tsx`)
- **Pages:** PascalCase (`CreatePost.tsx`)
- **Utilities:** camelCase (`dateUtils.ts`)
- **API files:** camelCase (`blogService.ts`)
- **Backend routes:** lowercase (`auth.js`)

#### Import/Export Guidelines

```javascript
// ✅ Preferred import order
import React, { useState, useCallback } from "react";

import { Button, Card, Typography } from "@mui/material";
import { formatDate } from "../utils/dateUtils";
import { BlogService } from "../services/blogService";

import BlogCard from "./BlogCard";
import "../styles/BlogList.css";
```

### 5. Testing Guidelines

#### Frontend Testing

```javascript
// Example test for BlogCard component
import { render, screen, fireEvent } from "@testing-library/react";
import BlogCard from "./BlogCard";

const mockBlog = {
  id: "1",
  title: "Test Blog",
  content: "Test content",
  author: { name: "Test Author" },
};

describe("BlogCard", () => {
  it("renders blog title correctly", () => {
    render(<BlogCard blog={mockBlog} />);
    expect(screen.getByText("Test Blog")).toBeInTheDocument();
  });

  it("calls onLike when like button is clicked", () => {
    const onLike = jest.fn();
    render(<BlogCard blog={mockBlog} onLike={onLike} />);

    fireEvent.click(screen.getByRole("button", { name: /like/i }));
    expect(onLike).toHaveBeenCalledWith("1");
  });
});
```

#### Backend Testing

```javascript
// Example test for auth endpoint
const request = require("supertest");
const app = require("../server");

describe("Auth Endpoints", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("userId");
    });

    it("should return error for missing required fields", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({ email: "test@example.com" })
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });
  });
});
```

### 6. Documentation Guidelines

#### Code Comments

```javascript
// ✅ Good comments explain WHY, not WHAT
// Calculate reading time based on average 200 words per minute
const calculateReadingTime = (content) => {
  const wordsPerMinute = 200;
  const wordCount = content.split(" ").length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// ❌ Avoid obvious comments
// Increment the counter by 1
counter++;
```

#### API Documentation

When adding new endpoints, update the [API Reference](api-reference.md):

````markdown
### New Endpoint Name

```http
POST /api/new-endpoint
```
````

**Request Body:**

```json
{
  "field": "value"
}
```

**Response:**

```json
{
  "result": "success"
}
```

````

### 7. Pull Request Process

#### Before Submitting

1. **Test your changes thoroughly:**
   ```bash
   # Run frontend tests
   cd client
   npm test

   # Run backend tests
   cd server
   npm test

   # Test the application manually
````

2. **Update documentation** if needed

3. **Check code quality:**

   ```bash
   # Run linting
   npm run lint

   # Run type checking
   npm run type-check
   ```

4. **Sync with upstream:**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

#### Pull Request Template

When creating a PR, use this template:

```markdown
## Description

Brief description of changes made.

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Changes Made

- List specific changes
- Include any breaking changes
- Mention new dependencies

## Testing

- [ ] Tested manually
- [ ] Added unit tests
- [ ] Updated existing tests
- [ ] All tests passing

## Screenshots/GIFs

Include screenshots for UI changes.

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or clearly marked)

## Related Issues

Fixes #123, Closes #456
```

#### PR Guidelines

- **Keep PRs focused** - one feature/fix per PR
- **Write descriptive titles** and descriptions
- **Include screenshots** for UI changes
- **Reference related issues** using `Fixes #123`
- **Respond to feedback** promptly and professionally
- **Update PR** based on review feedback

## Types of Contributions

### 🐛 Bug Fixes

- Look for issues labeled `bug`
- Reproduce the bug first
- Write tests to prevent regression
- Include steps to reproduce in PR

### ✨ New Features

- Discuss feature in an issue first
- Follow existing patterns and conventions
- Include comprehensive tests
- Update documentation

### 📚 Documentation

- Fix typos or unclear explanations
- Add examples and use cases
- Improve API documentation
- Create tutorials or guides

### 🎨 UI/UX Improvements

- Follow existing design patterns
- Ensure responsive design
- Test across different browsers
- Include before/after screenshots

### ⚡ Performance Optimizations

- Profile before and after changes
- Include performance metrics
- Ensure no functionality is broken
- Document the improvement

### 🧪 Testing

- Add tests for untested code
- Improve existing test coverage
- Add integration tests
- Fix flaky tests

## Community Guidelines

### Code of Conduct

We follow the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating, you are expected to uphold this code.

**Key points:**

- **Be respectful** and inclusive
- **Welcome newcomers** and help them learn
- **Provide constructive feedback**
- **Focus on what is best** for the community
- **Show empathy** towards other community members

### Communication

- **Be patient** with review processes
- **Ask questions** when something is unclear
- **Provide context** when reporting issues
- **Be specific** about problems and solutions
- **Use clear, professional language**

### Issue Reporting

When reporting bugs:

1. **Check existing issues** first
2. **Use the issue template**
3. **Provide reproduction steps**
4. **Include system information**
5. **Add relevant screenshots/logs**

### Feature Requests

When requesting features:

1. **Explain the problem** you're trying to solve
2. **Describe your proposed solution**
3. **Consider alternative solutions**
4. **Explain why this benefits users**

## Recognition

Contributors who make significant contributions will be:

- **Added to the contributors list** in README
- **Mentioned in release notes** for their contributions
- **Invited to join** as maintainers (for ongoing contributors)

## Getting Help

### For Development Questions

- **Read the documentation** first
- **Check existing issues** and PRs
- **Ask in discussions** for general questions
- **Create an issue** for specific problems

### For Code Reviews

- **Be patient** - maintainers review in their free time
- **Address feedback** constructively
- **Ask for clarification** if feedback is unclear
- **Learn from the process** - reviews are learning opportunities

## Quick Reference

### Useful Commands

```bash
# Setup development environment
npm run setup

# Run all tests
npm run test:all

# Check code quality
npm run lint
npm run type-check

# Build for production
npm run build

# Run database migrations (if any)
npm run migrate

# Generate documentation
npm run docs:generate
```

### Common Issues

- **Port conflicts:** Check if ports 3000/5000/5173 are available
- **Environment variables:** Ensure all required variables are set
- **Database connection:** Verify MongoDB is running
- **Dependencies:** Run `npm install` if packages are missing

Thank you for contributing to BlogVerse! 🎉
