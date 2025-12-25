// Minimal functional chat client
let ws = null;
let currentUser = null;
let token = localStorage.getItem('chatToken');
let currentRoom = 'global';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, checking for ui-container...');
    const container = document.getElementById('ui-container');
    if (!container) {
        console.error('ui-container element not found in HTML!');
        return;
    }
    console.log('ui-container found, initializing connection...');
    connect();
});

function connect() {
    // Close existing connection if any
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
    }
    
    // Detect environment and set appropriate WebSocket URL
    const isProduction = !['localhost', '127.0.0.1'].includes(window.location.hostname);
    const isSecure = window.location.protocol === 'https:';
    
    let wsProtocol = isSecure ? 'wss://' : 'ws://';
    let wsHost = isProduction ? 'storage-service-kvn1.onrender.com' : 'localhost:3000';
    let wsUrl = `${wsProtocol}${wsHost}`;
    
    if (token) {
        wsUrl += `/?token=${token}`;
    }
    
    console.log('Connecting to:', wsUrl);
    console.log('Environment:', isProduction ? 'Production' : 'Development');
    ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
        console.log('Connected to gateway');
        if (token) {
            console.log('Token exists, waiting for server auth response...');
        } else {
            console.log('No token stored, showing auth UI immediately');
            showAuthUI();
        }
    };
    
    ws.onmessage = (event) => {
        console.log('Received message:', event.data);
        const message = JSON.parse(event.data);
        handleServerMessage(message);
    };
    
    ws.onclose = () => {
        console.log('Disconnected from gateway');
        // Clear authentication state on disconnect
        currentUser = null;
        // Don't clear token on normal disconnect - might be valid for reconnection
        setTimeout(() => connect(), 3000);
    };
    
    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
}

function handleServerMessage(message) {
    switch (message.type) {
        case 'registered':
            showMessage('Registration successful! Please login.', 'success');
            break;
            
        case 'authenticated':
            currentUser = message.username;
            if (message.token) token = message.token;
            localStorage.setItem('chatToken', token);
            showChatUI();
            joinRoom('global');
            break;
            
        case 'list:latestResult':
            // Load initial room history
            const historyDiv = document.getElementById('chat-messages');
            if (historyDiv && message.items) {
                historyDiv.innerHTML = '';
                message.items.forEach(item => {
                    const chatData = item.data;
                    appendMessage(chatData.message, item.owner === currentUser ? 'user' : 'other', item.owner);
                });
                historyDiv.scrollTop = historyDiv.scrollHeight;
            }
            break;
            
        case 'list:appended':
            if (message.list === `chat/${currentRoom}/messages`) {
                const chatData = message.item.data;
                appendMessage(chatData.message, message.item.owner === currentUser ? 'user' : 'other', message.item.owner);
            }
            break;
            
        case 'error':
            console.log('Authentication error, clearing token and showing UI immediately');
            // Immediate error handling - no complex timeout chains
            localStorage.removeItem('chatToken');
            token = null;
            showAuthUI();
            break;
    }
}

function showAuthUI() {
    console.log('Showing auth UI...');
    const container = document.getElementById('ui-container');
    if (!container) {
        console.error('ui-container element not found!');
        return;
    }
    container.innerHTML = `
        <div class="auth-container auth-unauthenticated">
            <div style="grid-column: 5 / 16; grid-row: 5 / 7;">
                <button class="tab-button active" onclick="showLoginForm()">Login</button>
                <button class="tab-button" onclick="showRegisterForm()">Register</button>
            </div>
            
            <div id="auth-forms" style="grid-column: 5 / 16; grid-row: 8 / 16;">
                <!-- Login/Register forms will be inserted here -->
            </div>
            
            <div id="auth-message" class="form-message" style="grid-column: 5 / 16; grid-row: 16 / 18;"></div>
        </div>
    `;
    
    showLoginForm();
}

function showLoginForm() {
    const formsDiv = document.getElementById('auth-forms');
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(btn => btn.classList.remove('active'));
    buttons[0].classList.add('active');
    
    formsDiv.innerHTML = `
        <div>
            <label class="form-label">Username</label>
            <input type="text" id="username" class="form-input" placeholder="Enter username">
            
            <label class="form-label">Password</label>
            <input type="password" id="password" class="form-input" placeholder="Enter password">
            
            <button class="submit-button" onclick="doLogin()">Login</button>
        </div>
    `;
    
    document.getElementById('password').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') doLogin();
    });
}

function showRegisterForm() {
    const formsDiv = document.getElementById('auth-forms');
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(btn => btn.classList.remove('active'));
    buttons[1].classList.add('active');
    
    formsDiv.innerHTML = `
        <div>
            <label class="form-label">Username</label>
            <input type="text" id="username" class="form-input" placeholder="Choose username">
            
            <label class="form-label">Password</label>
            <input type="password" id="password" class="form-input" placeholder="Choose password (min 6 chars)">
            
            <button class="submit-button" onclick="doRegister()">Register</button>
        </div>
    `;
    
    document.getElementById('password').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') doRegister();
    });
}

function doLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        showMessage('Please enter username and password', 'error');
        return;
    }
    
    showMessage('Logging in...', 'loading');
    ws.send(JSON.stringify({
        type: 'login',
        username,
        password,
        persistent: true  // Persist login session
    }));
}

function doRegister() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        showMessage('Please enter username and password', 'error');
        return;
    }
    
    if (username.length < 3) {
        showMessage('Username must be at least 3 characters', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters', 'error');
        return;
    }
    
    showMessage('Registering...', 'loading');
    ws.send(JSON.stringify({
        type: 'register',
        username,
        password,
        persistent: true  // Persist user registration
    }));
}

function showChatUI() {
    const container = document.getElementById('ui-container');
    container.innerHTML = `
        <div class="auth-container auth-authenticated">
            <div class="chat-ui">
                <div class="chat-header">
                    <span>Room: ${currentRoom} | User: ${currentUser}</span>
                    <button class="chat-logout-btn" onclick="doLogout()">Logout</button>
                </div>
                <div id="chat-messages" class="chat-messages"></div>
                <div class="chat-input-container">
                    <input type="text" id="chat-input" class="chat-input" placeholder="Type a message..." onkeypress="handleChatKeypress(event)">
                    <button class="chat-send-btn" onclick="sendChatMessage()">Send</button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('chat-input').focus();
}

function joinRoom(roomName) {
    currentRoom = roomName;
    
    // Get recent messages for this room
    ws.send(JSON.stringify({
        type: 'list:getLatest',
        list: `chat/${roomName}/messages`,
        count: 50,
        persistent: false
    }));
    
    // Add user to room members
    ws.send(JSON.stringify({
        type: 'list:append',
        list: `chat/${roomName}/members`,
        item: {
            data: {
                username: currentUser, 
                type: 'join',
                joinedAt: Date.now()
            },
            public: true
        },
        persistent: false
    }));
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    ws.send(JSON.stringify({
        type: 'list:append',
        list: `chat/${currentRoom}/messages`,
        item: {
            data: {
                message: message,
                type: 'message'
            },
            public: true
        },
        persistent: false
    }));
    
    input.value = '';
    input.focus();
}

function handleChatKeypress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function appendMessage(message, senderType, username = null) {
    const messagesDiv = document.getElementById('chat-messages');
    if (!messagesDiv) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${senderType}`;
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (senderType === 'user') {
        messageDiv.innerHTML = `
            <div class="content">${escapeHtml(message)}</div>
            <div class="timestamp">${timestamp}</div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="sender">${escapeHtml(username)}</div>
            <div class="content">${escapeHtml(message)}</div>
            <div class="timestamp">${timestamp}</div>
        `;
    }
    
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function doLogout() {
    if (ws && ws.readyState === WebSocket.OPEN) {
        // Remove from current room members
        ws.send(JSON.stringify({
            type: 'list:append',
            list: `chat/${currentRoom}/members`,
            item: {
                data: {
                    username: currentUser,
                    type: 'leave',
                    leftAt: Date.now()
                },
                public: true
            },
            persistent: false
        }));
    }
    
    localStorage.removeItem('chatToken');
    token = null;
    currentUser = null;
    currentRoom = 'global';
    
    showAuthUI();
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('auth-message');
    if (!messageDiv) return;
    
    messageDiv.textContent = text;
    messageDiv.className = `form-message ${type}`;
    
    if (type === 'loading') {
        setTimeout(() => {
            if (messageDiv.textContent === text) {
                messageDiv.textContent = '';
                messageDiv.className = 'form-message';
            }
        }, 5000);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}