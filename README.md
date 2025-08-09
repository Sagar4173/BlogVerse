# BlogVerse - Modern Full-Stack Blog Platform

> A feature-rich, open-source blogging platform built with React, Node.js, Express, and MongoDB. Create, share, and discover amazing content with a modern, intuitive interface.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-%5E18.0.0-blue)](https://reactjs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./docs/contributing.md)

🌐 **Live Demo:** [https://blogversehub.vercel.app](https://blogversehub.vercel.app)

## ✨ Key Features

- 📝 **Rich Content Editor** - Create beautiful posts with a powerful WYSIWYG editor
- 👥 **Social Features** - Follow users, like posts, comment with nested replies
- 🔐 **Secure Authentication** - Email verification, JWT tokens, password reset
- 📊 **Analytics Dashboard** - Track views, engagement, and performance metrics
- 🎨 **Modern UI/UX** - Responsive design with dark/light themes
- ⚡ **Fast Performance** - Optimized with code splitting and caching
- 🔒 **Enterprise Security** - Rate limiting, input validation, XSS protection

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- [Cloudinary](https://cloudinary.com/) account for image storage

### Installation

```bash
# Clone the repository
git clone https://github.com/Sagar4173/BlogVerse.git
cd BlogVerse

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install
```

### Environment Setup

Create `.env` files in both `server/` and `client/` directories:

**Server (.env):**

```env
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret-key-32-characters-minimum
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
CLIENT_URL=http://localhost:5173
```

**Client (.env):**

```env
VITE_API_URL=http://localhost:5000/api
```

### Run the Application

```bash
# Start backend server (from server directory)
npm run dev

# Start frontend server (from client directory)
npm run dev
```

Visit `http://localhost:5173` to see BlogVerse in action! 🎉

## 📚 Documentation

| Topic                                               | Description                                        |
| --------------------------------------------------- | -------------------------------------------------- |
| [📋 Installation Guide](./docs/installation.md)     | Complete setup instructions and configuration      |
| [🏗️ Tech Stack](./docs/tech-stack.md)               | Technologies used and architecture decisions       |
| [📁 Project Structure](./docs/project-structure.md) | Codebase organization and file structure           |
| [🚢 Deployment](./docs/deployment.md)               | Production deployment guides for various platforms |
| [🔧 API Reference](./docs/api-reference.md)         | Complete API documentation with examples           |
| [🔒 Security](./docs/security.md)                   | Security features and best practices               |
| [⚡ Performance](./docs/performance.md)             | Optimization strategies and techniques             |
| [🐛 Troubleshooting](./docs/troubleshooting.md)     | Common issues and solutions                        |
| [🧪 Testing](./docs/testing.md)                     | Testing strategies and guidelines                  |
| [🤝 Contributing](./docs/contributing.md)           | How to contribute to the project                   |
| [🚀 Future Plans](./docs/future-plans.md)           | Roadmap and upcoming features                      |
| [📞 Support](./docs/contact.md)                     | Getting help and support information               |

## 🛠️ Built With

**Frontend:**

- [React 18](https://reactjs.org/) with TypeScript
- [Vite](https://vitejs.dev/) for fast development
- [Material-UI](https://mui.com/) for components
- [Tailwind CSS](https://tailwindcss.com/) for styling

**Backend:**

- [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/) authentication
- [Cloudinary](https://cloudinary.com/) for image management

**DevOps:**

- [Vercel](https://vercel.com/) for deployment
- [GitHub Actions](https://github.com/features/actions) for CI/CD

## 🎯 Core Features

### Content Management

- Rich text editor with formatting options
- Draft/publish workflow
- Category-based organization
- Image uploads with optimization
- SEO-friendly URLs

### Social Platform

- User profiles and bios
- Follow/unfollow system
- Likes and nested comments
- Bookmarking system
- Real-time notifications

### Analytics & Insights

- View tracking and analytics
- Engagement metrics
- User activity timeline
- Performance dashboards

### Security & Performance

- JWT-based authentication
- Email verification system
- Rate limiting and validation
- Responsive design
- Code splitting and caching

## 🤝 Contributing

We love contributions! BlogVerse is open-source and we welcome developers of all skill levels.

**Quick Contribution Steps:**

1. 🍴 Fork the repository
2. 🌿 Create a feature branch
3. ✅ Make your changes and add tests
4. 📝 Update documentation if needed
5. 🚀 Submit a pull request

Read our [Contributing Guidelines](./docs/contributing.md) for detailed information.

## 📞 Getting Help

- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/Sagar4173/BlogVerse/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/Sagar4173/BlogVerse/discussions)
- 📧 **Email:** support@blogverse.com
- 📚 **Documentation:** [Full Documentation](./docs/)

## 🏆 Recognition

BlogVerse is built with ❤️ by:

- [Sagar Wavhal](https://github.com/Sagar4173) - Co-founder
- [Mrunali Patil](https://github.com/Mrunali394) - Co-founder

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

**MIT License Summary:**

- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed

## ⭐ Support Us

If you find BlogVerse helpful, please consider:

- ⭐ **Starring** the repository
- 🐛 **Reporting bugs** or suggesting features
- 🤝 **Contributing** code or documentation
- 📢 **Sharing** with your network

---

<div align="center">

**[Website](https://blogversehub.vercel.app) • [Documentation](./docs/) • [Contributing](./docs/contributing.md) • [Support](./docs/contact.md)**

_Building the future of blogging, one commit at a time_ ✨

</div>
