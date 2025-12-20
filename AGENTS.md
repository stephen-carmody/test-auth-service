# Test Auth Service

A test authentication service with frontend interface and backend gateway integration.

## Global AGENTS Rules

**FIRST RULE**: Read global AGENTS.md from ~/.config/opencode/AGENTS.md (if exists) before proceeding with any task. Follow both global and local rules, with global rules taking precedence.

## Project Overview

This repository contains a frontend authentication interface that integrates with a separate gateway service backend. The frontend uses vanilla JavaScript with a custom SimpleGridUI system, while the backend provides Node.js/Express authentication endpoints with Redis storage.

## Setup Commands

- Install dependencies: `npm install`
- Start frontend dev server: `npm start`
- Backend runs on port 3000 (gateway-service)
- Frontend runs on port 8080 (test-auth-service)

## Architecture

### Frontend (test-auth-service)
- **Main File**: `index.html` - Complete authentication interface
- **Technology**: Vanilla JavaScript, CSS Grid, SimpleGridUI component system
- **Features**: Login/register forms, validation, tab switching

### Backend (gateway-service)
- **Location**: `../gateway-service/`
- **Technology**: Node.js, Express, Redis
- **Endpoints**: `/register`, `/login`, `/logout`, `/stats`, storage endpoints

## Code Style

- Use existing SimpleGridUI class for component creation
- Follow existing event handling patterns (`handleLogin()`, `handleRegister()`)
- Maintain CSS variable theming system
- Keep form validation logic consistent
- Use fetch API for HTTP requests to backend

## Important Notes

### Do NOT
- Remove or modify the existing SimpleGridUI system unless specifically requested
- Change CSS variable names or theming system
- Break existing form validation logic
- Remove backend integration hooks

### DO
- Test backend connectivity before implementing frontend changes
- Maintain existing UI/UX patterns
- Follow current error handling approach
- Add proper loading states and user feedback

## Testing

### Backend Testing
```bash
cd ../gateway-service
npm start
# Test health: curl http://localhost:3000/
# Test login: curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"username": "alice", "password": "password123"}'
```

### Frontend Testing
```bash
cd /home/stephen/test-auth-service
npm start
# Open http://localhost:8080 in browser
# Check browser console for errors
# Use Network tab to monitor API calls
```

## Security Considerations

- Never log or store passwords in plaintext
- Implement proper token management
- Validate all inputs on both client and server side
- Use HTTPS in production

## Development Workflow

1. Always check `index.html` for current implementation
2. Verify backend status by checking `../gateway-service/`
3. Primary development happens in `index.html`
4. Test with browser dev tools for API integration