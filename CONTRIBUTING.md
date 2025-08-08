# Contributing to Smoke Runner

Thank you for your interest in contributing to Smoke Runner! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/smoke-runner.git
   cd smoke-runner
   ```
3. **Install dependencies**:
   ```bash
   pnpm install
   ```
4. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📋 Development Setup

### Prerequisites
- Node.js 18+
- pnpm (preferred) or npm
- A test Next.js application for development

### Local Development
```bash
# Install Playwright browsers
pnpm exec playwright install --with-deps

# Run tests against a sample app
BASE_URL=http://localhost:3000 pnpm smoke:test

# Run in development mode with file watching
pnpm smoke:dev
```

## 🏗️ Project Structure

```
smoke-runner/
├── packages/
│   ├── auto-smoke/           # Core testing engine
│   │   ├── src/
│   │   │   ├── routeDiscovery.ts    # Route discovery logic
│   │   │   ├── lighthouse.ts        # Performance testing
│   │   │   ├── auth.ts             # Authentication handling
│   │   │   └── reporters/          # Report generators
│   │   └── tests/                  # Playwright test files
│   └── ai-sidecar/           # AI test suggestions
│       ├── src/
│       │   ├── index.ts            # Core AI interfaces
│       │   └── cli.ts              # Command-line interface
└── scripts/
    └── seedTestData.ts       # Test data management
```

## 🧪 Testing

### Running Tests
```bash
# Run all smoke tests
pnpm smoke:test

# Run visual regression tests
VISUAL=1 pnpm smoke:visual

# Run Lighthouse performance tests
pnpm smoke:lhci

# Generate AI proposals
pnpm ai:propose
```

### Writing Tests
- Add new test cases to relevant `.spec.ts` files
- Use data-testid attributes for stable selectors
- Follow existing patterns for route discovery and testing

## 📝 Code Style

### TypeScript
- Use TypeScript for all new code
- Provide proper type definitions
- Follow existing patterns for interfaces and types

### Naming Conventions
- Use camelCase for variables and functions
- Use PascalCase for classes and interfaces
- Use kebab-case for file names
- Use meaningful, descriptive names

### Comments
- Add JSDoc comments for public APIs
- Explain complex logic with inline comments
- Keep comments up-to-date with code changes

## 🔧 Making Changes

### Bug Fixes
1. Create a test case that reproduces the bug
2. Fix the issue
3. Verify the test passes
4. Update documentation if needed

### New Features
1. **Discuss first**: Open an issue to discuss the feature before implementing
2. **Design**: Consider the API design and user experience
3. **Implement**: Write the feature with tests
4. **Document**: Update README and add examples
5. **Test**: Ensure all tests pass

### Breaking Changes
- Clearly mark breaking changes in commit messages
- Update version numbers appropriately
- Provide migration guides for users

## 📋 Pull Request Process

### Before Submitting
- [ ] All tests pass locally
- [ ] Code follows the project style
- [ ] Documentation is updated
- [ ] Commit messages are clear and descriptive

### PR Description
Include:
- **What**: Brief description of changes
- **Why**: Reason for the changes
- **How**: Implementation approach
- **Testing**: How you tested the changes
- **Screenshots**: For UI changes

### Review Process
1. Automated checks must pass
2. At least one maintainer review required
3. Address review feedback
4. Maintainer merges approved PRs

## 🐛 Reporting Issues

### Bug Reports
Use the bug report template and include:
- **Environment**: OS, Node.js version, pnpm version
- **Steps to reproduce**: Clear, numbered steps
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Logs**: Relevant error messages or logs

### Feature Requests
Use the feature request template and include:
- **Problem**: What problem does this solve?
- **Solution**: Describe your proposed solution
- **Alternatives**: Other solutions you considered
- **Use cases**: Real-world scenarios where this helps

## 🎯 Areas for Contribution

### High Priority
- **AI Integration**: Replace dummy proposer with real AI models
- **Framework Support**: Add support for other frameworks beyond Next.js
- **Performance**: Optimize test execution and memory usage
- **Documentation**: Improve guides and examples

### Good First Issues
- **Example Applications**: Create sample apps for testing
- **CLI Improvements**: Enhance command-line interface
- **Reporter Formats**: Add new report formats (JSON, JUnit, etc.)
- **Selector Improvements**: Better element detection strategies

### Advanced Features
- **Self-Healing Tests**: Auto-update selectors when they break
- **Smart Retry Logic**: Handle dynamic content and loading states
- **Multi-Browser Testing**: Support Firefox, Safari, Edge
- **Database Integrations**: More database types for test data seeding

## 📜 Code of Conduct

- **Be respectful**: Treat all contributors with respect
- **Be collaborative**: Work together to solve problems
- **Be constructive**: Provide helpful feedback and suggestions
- **Be patient**: Remember that everyone is learning

## 🏆 Recognition

Contributors will be:
- Listed in the README contributors section
- Mentioned in release notes for significant contributions
- Invited to join the maintainer team for sustained contributions

## 📞 Getting Help

- **GitHub Discussions**: General questions and ideas
- **GitHub Issues**: Bug reports and feature requests
- **Discord**: Real-time chat (link in README)

## 📄 License

By contributing to Smoke Runner, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make Smoke Runner better for everyone! 🎉