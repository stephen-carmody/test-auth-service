# ComponentFactory API Documentation

## Overview

The ComponentFactory is a unified UI component creation system that allows you to dynamically create any UI component with parameters for position, size, color, and behavior. It integrates seamlessly with the existing ColorAllocationSystem and grid positioning system.

## Quick Start

```javascript
// Initialize the ComponentFactory (automatically done on page load)
const factory = initializeComponentFactory();

// Create a simple button
const button = factory.create({
    id: 'my-button',
    type: 'button',
    position: {
        grid: { startCol: 5, endCol: 8, startRow: 10, endRow: 12 }
    },
    content: {
        text: 'Click Me'
    },
    behavior: {
        onClick: 'myClickHandler'
    }
});
```

## API Reference

### ComponentFactory Class

#### Constructor
```javascript
new ComponentFactory(colorSystem = ColorAllocationSystem)
```

#### Methods

##### `create(config)`
Creates a new component with the given configuration.

**Parameters:**
- `config` (Object): Component configuration object

**Returns:**
- `Object`: Component object containing id, type, element, config, children, parent, state, and eventHandlers

##### `register(type, definition)`
Registers a new component type.

**Parameters:**
- `type` (String): Component type name
- `definition` (Object): Component definition with createElement, defaultStyles, etc.

##### `update(componentId, updates)`
Updates an existing component.

**Parameters:**
- `componentId` (String): ID of component to update
- `updates` (Object): Configuration updates to apply

##### `destroy(componentId)`
Removes a component and all its children.

**Parameters:**
- `componentId` (String): ID of component to destroy

##### `get(componentId)`
Retrieves a component object.

**Parameters:**
- `componentId` (String): ID of component to retrieve

**Returns:**
- `Object`: Component object or undefined if not found

##### `addChild(parent, child)`
Adds a child component to a parent.

**Parameters:**
- `parent` (Object): Parent component object
- `child` (Object): Child component object

##### `list()`
Returns all component IDs.

**Returns:**
- `Array`: Array of component ID strings

##### `clear()`
Destroys all components.

## Component Configuration

### Basic Structure

```javascript
const config = {
    id: 'unique-id',           // Required: Unique identifier
    type: 'button',             // Required: Component type
    position: { /* positioning */ },
    size: { /* sizing */ },
    appearance: { /* styling */ },
    content: { /* content */ },
    behavior: { /* events */ },
    state: { /* initial state */ }
};
```

### Positioning

#### Grid Positioning (Primary)
```javascript
position: {
    grid: {
        startCol: 5,    // Starting column (0-based)
        endCol: 8,      // Ending column (exclusive)
        startRow: 10,    // Starting row (0-based)
        endRow: 12       // Ending row (exclusive)
    }
}
```

#### Absolute Positioning
```javascript
position: {
    absolute: {
        x: '100px',     // X position (string or number)
        y: '50px',      // Y position (string or number)
        width: '200px', // Width (string or number)
        height: '60px'  // Height (string or number)
    }
}
```

#### Relative Positioning
```javascript
position: {
    relative: {
        parent: 'parent-id',  // Parent component ID
        anchor: 'top-left',    // Anchor point
        offset: { x: 10, y: 5 } // Offset from anchor
    }
}
```

### Sizing

```javascript
size: {
    width: 'auto',           // 'auto', '100%', '200px', or number
    height: 'auto',          // 'auto', '100%', '200px', or number
    aspectRatio: '1'         // '1', '16/9', etc.
}
```

### Appearance

```javascript
appearance: {
    color: 'auto',           // 'auto', 'specific-color', 'transparent'
    theme: 'primary',        // 'primary', 'secondary', 'accent', 'custom'
    style: 'elevated'        // 'minimal', 'bordered', 'elevated', 'flat'
}
```

### Content

#### Text Content
```javascript
content: {
    text: 'Button Label'     // Text content for buttons, text components
}
```

#### Input Content
```javascript
content: {
    placeholder: 'Enter text...', // Input placeholder
    type: 'password'              // Input type (text, password, etc.)
}
```

#### Icon Content
```javascript
content: {
    symbol: '⚡',           // Icon symbol
    size: '24px'            // Icon size
}
```

#### Nested Components
```javascript
content: {
    children: [
        { /* child component config */ },
        { /* child component config */ }
    ]
}
```

### Behavior

```javascript
behavior: {
    onClick: 'functionName',        // Global function name
    onHover: 'functionName',        // Hover handler
    events: {                        // Custom events
        'change': 'handleChange',
        'focus': 'handleFocus'
    }
}
```

#### Direct Function Handler
```javascript
behavior: {
    onClick: (component, event) => {
        console.log('Clicked:', component.id);
    }
}
```

### State

```javascript
state: {
    initial: 'active',     // 'normal', 'active', 'disabled', 'hidden'
    transitions: true,      // Enable state transitions
    animation: 'fade'      // 'fade', 'slide', 'scale', 'none'
}
```

## Built-in Component Types

### Button
```javascript
{
    type: 'button',
    content: { text: 'Click Me' },
    // Inherits default button styling with hover effects
}
```

### Panel
```javascript
{
    type: 'panel',
    // Container with borders and background
}
```

### Input
```javascript
{
    type: 'input',
    content: { placeholder: 'Enter text...' },
    inputType: 'text'  // Optional input type
}
```

### Text
```javascript
{
    type: 'text',
    content: { text: 'Display text' }
}
```

### Container
```javascript
{
    type: 'container',
    layout: {
        direction: 'column',     // 'row', 'column'
        justify: 'center',       // 'flex-start', 'center', 'flex-end'
        align: 'stretch',        // 'flex-start', 'center', 'stretch'
        gap: '16px'             // Gap between children
    }
}
```

### Icon
```javascript
{
    type: 'icon',
    content: { 
        symbol: '⚡',
        size: '24px'
    }
}
```

## Event Handling

### Global Function Handlers
```javascript
function myClickHandler(component, event) {
    console.log('Component clicked:', component.id);
    console.log('Event:', event);
    // Access component properties
    component.config.content.text = 'Clicked!';
    component.element.textContent = component.config.content.text;
}
```

### Inline Handlers
```javascript
const button = factory.create({
    id: 'inline-handler-btn',
    type: 'button',
    content: { text: 'Inline Handler' },
    behavior: {
        onClick: (component, event) => {
            alert('Inline handler executed!');
        }
    }
});
```

## Color System Integration

The ComponentFactory automatically integrates with the existing ColorAllocationSystem:

```javascript
// Use automatic color assignment
const coloredPanel = factory.create({
    id: 'colored-panel',
    type: 'panel',
    appearance: {
        color: 'specific-color'  // Automatically assigned unique color
    }
});
```

## Component Lifecycle

1. **Creation**: Component element is created and styled
2. **Positioning**: Component is positioned on the grid or absolutely
3. **Event Binding**: Event handlers are attached
4. **DOM Addition**: Component is added to the document
5. **State Management**: Component state is tracked and manageable
6. **Cleanup**: Components can be destroyed with proper cleanup

## Examples

### Basic Button
```javascript
const basicButton = factory.create({
    id: 'basic-btn',
    type: 'button',
    position: {
        grid: { startCol: 1, endCol: 3, startRow: 5, endRow: 6 }
    },
    content: { text: 'Basic Button' },
    behavior: {
        onClick: 'handleBasicClick'
    }
});
```

### Form with Input and Button
```javascript
const form = factory.create({
    id: 'my-form',
    type: 'container',
    position: {
        grid: { startCol: 2, endCol: 8, startRow: 8, endRow: 12 }
    },
    layout: { direction: 'column', gap: '12px' },
    content: {
        children: [
            {
                id: 'form-input',
                type: 'input',
                content: { placeholder: 'Enter your name...' }
            },
            {
                id: 'form-button',
                type: 'button',
                content: { text: 'Submit' },
                behavior: {
                    onClick: 'handleSubmit'
                }
            }
        ]
    }
});
```

### Floating Menu
```javascript
const floatingMenu = factory.create({
    id: 'floating-menu',
    type: 'panel',
    position: {
        absolute: { x: '20px', y: '100px', width: '250px', height: 'auto' }
    },
    appearance: { style: 'elevated' },
    content: {
        children: [
            {
                id: 'menu-title',
                type: 'text',
                content: { text: 'Menu' }
            },
            {
                id: 'menu-btn-1',
                type: 'button',
                content: { text: 'Option 1' },
                behavior: { onClick: 'handleOption1' }
            }
        ]
    }
});
```

## Custom Component Types

Register your own component types:

```javascript
factory.register('custom-card', {
    createElement: (config) => {
        const element = document.createElement('div');
        element.className = 'custom-card';
        element.innerHTML = `
            <h3>${config.title || 'Card Title'}</h3>
            <p>${config.description || 'Card description'}</p>
        `;
        return element;
    },
    defaultStyles: {
        background: 'var(--surface)',
        border: '2px solid var(--text)',
        borderRadius: '8px',
        padding: '16px',
        margin: '8px'
    },
    hoverStyles: {
        boxShadow: '0 0 15px var(--accent)'
    }
});

// Use the custom component
const customCard = factory.create({
    id: 'my-card',
    type: 'custom-card',
    title: 'My Custom Card',
    description: 'This is a custom component type',
    position: {
        grid: { startCol: 5, endCol: 10, startRow: 15, endRow: 18 }
    }
});
```

## Chat Commands

The ComponentFactory includes demo commands that can be used in the chat interface:

- `/components` - Create demo components to test the system
- `/manage-components` - Show component management examples  
- `/clear-components` - Remove all demo components

## Integration with Existing Systems

### ColorAllocationSystem
Components automatically use the existing color system for consistent theming and can request specific colors.

### Grid System
Components can be positioned using the existing grid overlay system for precise layout control.

### Event System
Components integrate with the existing chat command system and can be managed through the same interface.

## Best Practices

1. **Use descriptive IDs** for easy component management
2. **Leverage grid positioning** for consistent layouts
3. **Use event delegation** for better performance with many components
4. **Clean up components** when no longer needed
5. **Use the color system** for consistent theming
6. **Component composition** for complex UI structures
7. **State management** for interactive components

## Troubleshooting

### Common Issues

**Component not appearing:**
- Check that the grid system is initialized
- Verify grid coordinates are valid
- Check component visibility state

**Events not firing:**
- Ensure handler functions exist in global scope
- Check for JavaScript errors in console
- Verify component is not disabled

**Styling issues:**
- Check CSS variables are defined
- Verify component type is registered
- Check for conflicting styles

### Debug Tools

```javascript
// List all components
console.log('All components:', UIComponentFactory.list());

// Get component details
const component = UIComponentFactory.get('component-id');
console.log('Component:', component);

// Check component configuration
console.log('Component config:', component.config);
```