# AI Agent Development Guide

## Repository Overview

This repository contains a test authentication service with a frontend authentication interface and integration with a separate gateway service backend.

## Architecture

### Frontend (test-auth-service)
- **Main File**: `index.html` - Complete authentication interface
- **Technology**: Vanilla JavaScript, CSS Grid, SimpleGridUI component system
- **Features**: Login/register forms, validation, tab switching
- **Current State**: Frontend-only implementation (mock authentication)

### Backend (gateway-service)
- **Location**: `/home/stephen/gateway-service/` (source code at `../gateway-service/`)
- **Technology**: Node.js, Express, Redis
- **Features**: User registration, login, session management, rate limiting
- **Endpoints**: `/register`, `/login`, `/logout`, `/stats`, storage endpoints

## Current Implementation Status

### ✅ Working Features
- HTML/CSS authentication interface with proper styling
- Form validation (username 3+ chars, password 6+ chars)
- Tab switching between login and register
- Backend gateway service with full authentication endpoints
- Grid-based positioning system (SimpleGridUI)

### ❌ Missing Integration
- Frontend has no HTTP client integration with backend
- Authentication is mock-only (no actual API calls)
- No token management or session handling
- No real-time features or chat functionality

## Development Workflow

### For Agents Working on This Repository

#### 1. Understanding Current State
- Always check `index.html` for current implementation
- Verify backend status by checking `../gateway-service/` (gateway service source code)
- Test authentication endpoints: `curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"username": "test", "password": "test123"}'`

#### 2. Making Changes
- **Primary development happens in `index.html`**
- Add new features to existing authentication interface
- Implement backend integration by adding HTTP client code
- Follow existing CSS patterns and styling conventions

#### 3. Testing Integration
- Backend runs on port 3000 (gateway service)
- Frontend runs on port 8080 (test-auth-service)
- Use browser dev tools to test API integration
- Check network tab for HTTP requests/responses

#### 4. Code Patterns
- Use existing `SimpleGridUI` class for component creation
- Follow existing event handling patterns (`handleLogin()`, `handleRegister()`)
- Maintain CSS variable theming system
- Keep form validation logic consistent

### Common Development Tasks

#### Adding Backend Integration
1. Add HTTP client library (axios or fetch)
2. Update `handleLogin()` and `handleRegister()` functions
3. Add token storage and management
4. Implement proper error handling for API responses

#### Extending Authentication Features
1. Add new form fields to HTML structure
2. Update validation logic in form handlers
3. Style new elements with existing CSS classes
4. Test with backend API requirements

#### Adding New Components
1. Use `window.gridUI.create()` method
2. Follow existing component positioning patterns
3. Apply appropriate CSS classes for styling
4. Add event handlers following existing patterns

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

### Security Considerations
- Never log or store passwords in plaintext
- Implement proper token management
- Validate all inputs on both client and server side
- Use HTTPS in production

## Communication Guidelines

### Critical: No Agreement Glazing
- **DO NOT** use phrases like "You're right!", "That's a great point!", "I agree", or similar validation language
- **DO NOT** confirm user statements as correct without factual verification
- **DO NOT** provide unverified agreement with user opinions or assessments
- **DO NOT** attempt to validate user ego or correctness

### Instead: Fact-Based Communication
- **ALWAYS** base responses on observable facts, code analysis, and technical reality
- **ALWAYS** verify claims through code inspection, testing, or documentation review
- **ALWAYS** present findings objectively without seeking user approval
- **ALWAYS** disagree when technical facts contradict user statements
- **ALWAYS** correct misinformation directly and professionally

### Communication Style
- **Direct**: State findings directly without preamble
- **Factual**: Reference specific code, test results, or documentation
- **Objective**: Present multiple perspectives when facts are ambiguous
- **Concise**: Avoid unnecessary elaboration or validation

### Example Responses

**Instead of:**
> "You're right! The ComponentFactory system is indeed missing."

**Use:**
> "ComponentFactory class does not exist in any files. The documentation references it, but no implementation is present in index.html or other source files."

**Instead of:**
> "That's a great point about the backend integration!"

**Use:**
> "Current handleLogin() and handleRegister() functions show only console.log() calls. No HTTP requests to gateway-service endpoints are present in the code."

### When Uncertain
- State uncertainty explicitly: "Unable to verify X from current analysis"
- Request clarification or access to more information
- Do not assume user statements are correct without verification

This approach ensures AI agents provide objective, factual assistance without subjective agreement or validation.

## Testing Commands

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

## Integration Patterns

### API Integration Template
```javascript
async function handleLogin() {
    const username = document.getElementById('username-input').value;
    const password = document.getElementById('password-input').value;
    
    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        if (response.ok) {
            // Store token and redirect
            localStorage.setItem('authToken', data.token);
            showMessage('login', 'Login successful!', false);
        } else {
            showMessage('login', data.error, true);
        }
    } catch (error) {
        showMessage('login', 'Network error', true);
    }
}
```

### Component Creation Template
```javascript
// Create new component using existing SimpleGridUI
const newComponent = window.gridUI.create(
    '<div class="new-element">Content</div>',
    x, y, width, height,  // Grid coordinates
    parentComponentId       // Optional parent
);
```

## File Structure After Cleanup
```
/home/stephen/test-auth-service/
├── README.md              # Project documentation
├── AGENTS.md              # This file - AI agent guide
├── index.html             # Main application file (HTML + JS + CSS)
└── package.json           # NPM configuration

/home/stephen/gateway-service/
├── index.js              # Backend server implementation
├── package.json          # Backend dependencies
└── README.md             # Backend documentation
```

## Gateway Service Analysis Instructions

### Re-analyzing Backend Capabilities
When updated understanding of gateway service capabilities is needed, agents should:

1. **Navigate to Backend Source**: `../gateway-service/`
2. **Analyze Current Implementation**: 
   - Read `index.js` for endpoint implementations
   - Check `package.json` for dependencies
   - Review `README.md` for documented features
3. **Verify Actual API**: Test endpoints with curl commands
4. **Document Findings**: Update frontend integration based on actual backend capabilities

### Key Backend Files to Analyze
- `../gateway-service/index.js` - Main server implementation (675 lines)
- `../gateway-service/package.json` - Dependencies and scripts
- `../gateway-service/README.md` - Comprehensive API documentation

**Critical**: Always re-analyze gateway service source code when implementing new frontend features to ensure compatibility with actual backend capabilities.

This repository structure is intentionally minimal to focus on core authentication functionality and easy maintenance by AI agents.