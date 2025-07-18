# Nothing Utility Module

A comprehensive JavaScript utility module for handling default "nothing" values, object manipulation, and type-safe operations.

## Overview

The `nothing` module provides a consistent way to work with default empty values across different JavaScript types. It's designed to help with initialization, fallback scenarios, and object manipulation while maintaining type safety.

## Features

- 🎯 **Default Values**: Consistent default "nothing" values for all JavaScript types
- 🔍 **Type Checking**: Built-in type validation and checking utilities
- 🔄 **Object Manipulation**: Merge, purify, and transform objects safely
- 🛡️ **Type Safety**: Runtime type checking with detailed error messages
- 📦 **Zero Dependencies**: Lightweight with minimal footprint
- 🚀 **Performance**: Optimized for common use cases

## Installation

```javascript
import nothing from "./nothing.js";
```

## API Reference

### Core Functions

#### `by_type(type)`
Get the default "nothing" value for a specific type.

```javascript
nothing.by_type("string");   // ""
nothing.by_type("number");   // 0
nothing.by_type("boolean");  // false
nothing.by_type("object");   // {}
nothing.by_type("array");    // []
```

#### `by_value(value)`
Get the default "nothing" value based on the type of the provided value.

```javascript
nothing.by_value("hello");    // "" (empty string)
nothing.by_value(42);         // 0
nothing.by_value(true);       // false
nothing.by_value({a: 1});     // {}
```

#### `is_default(value)`
Check if a value is the default "nothing" value for its type.

```javascript
nothing.is_default("");        // true
nothing.is_default("hello");   // false
nothing.is_default(0);         // true
nothing.is_default([]);        // true
nothing.is_default({});        // true
```

#### `set_default(value, fallback)`
Return the value if it's not default, otherwise return the fallback.

```javascript
nothing.set_default("", "fallback");      // "fallback"
nothing.set_default("hello", "fallback"); // "hello"
nothing.set_default(0, 42);               // 42
nothing.set_default(5, 42);               // 5
```

### Object Manipulation

#### `from_object(source, ...properties)`
Create a copy of an object with only specified properties.

```javascript
const user = { name: "John", age: 30, email: "john@example.com" };
const publicInfo = nothing.from_object(user, "name", "age");
// Result: { name: "John", age: 30 }
```

#### `shallow_merge(target, source)`
Perform a shallow merge of source object properties into target object.

```javascript
const target = { a: 1, b: 2 };
const source = { b: 3, c: 4 };
nothing.shallow_merge(target, source);
// Result: { a: 1, b: 3, c: 4 }
```

#### `deep_merge(target, source, depth = -1)`
Perform a deep merge of source object properties into target object.

```javascript
const target = { a: 1, nested: { x: 1, y: 2 } };
const source = { b: 2, nested: { y: 3, z: 4 } };
nothing.deep_merge(target, source);
// Result: { a: 1, b: 2, nested: { x: 1, y: 3, z: 4 } }
```

#### `purification(source, depth = -1)`
Create a purified copy of an object by removing default values and prototypes.

```javascript
const messy = { 
  name: "John", 
  email: "", 
  age: 0, 
  active: false, 
  tags: [] 
};
const clean = nothing.purification(messy);
// Result: { name: "John" } (only non-default values)
```

#### `cut_default(source, depth = -1)`
Remove properties with default "nothing" values from an object (modifies in place).

```javascript
const obj = { a: "", b: "hello", c: 0, d: 42 };
nothing.cut_default(obj);
// obj becomes: { b: "hello", d: 42 }
```

### Utility Functions

#### `normalize(value)`
Convert null/undefined/NaN values to the default null value, otherwise return the value.

```javascript
nothing.normalize(null);      // null
nothing.normalize(undefined); // null
nothing.normalize(NaN);       // null
nothing.normalize("hello");   // "hello"
```

#### `do_nothing()`
A function that does nothing and returns undefined. Useful as a placeholder callback.

```javascript
nothing.do_nothing();  // undefined

// Useful as placeholder
someAsyncFunction(data, nothing.do_nothing);
```

#### `object`
A default empty object with no prototype.

```javascript
const emptyObj = nothing.object; // [Object: null prototype] {}
```

## Usage Examples

### Form Data Validation
```javascript
function validateForm(formData) {
  // Remove empty fields
  nothing.cut_default(formData);
  
  // Set defaults for missing required fields
  formData.name = nothing.set_default(formData.name, "Anonymous");
  formData.role = nothing.set_default(formData.role, "user");
  
  return formData;
}
```

### API Response Processing
```javascript
function processApiResponse(response) {
  // Create clean response object
  const cleanResponse = nothing.purification(response);
  
  // Merge with defaults
  const defaultConfig = { timeout: 5000, retries: 3 };
  return nothing.deep_merge(defaultConfig, cleanResponse);
}
```

### Configuration Management
```javascript
function createConfig(userConfig = {}) {
  const defaultConfig = {
    debug: false,
    apiUrl: "https://api.example.com",
    timeout: 10000,
    features: {
      logging: true,
      analytics: false
    }
  };
  
  return nothing.deep_merge(defaultConfig, userConfig);
}
```

### Safe Object Access
```javascript
function getUserProfile(user) {
  // Extract only safe public properties
  return nothing.from_object(
    user, 
    "name", 
    "avatar", 
    "bio", 
    "publicEmail"
  );
}
```

## Type Safety

The module integrates with the `typec` utility for comprehensive type checking:

```javascript
import typec from "./typec.js";

// All functions validate input types
try {
  nothing.shallow_merge("not an object", {});
} catch (error) {
  console.error(error.message); // "Both target and source must be objects."
}
```

## Performance Considerations

- **Shallow vs Deep Operations**: Use shallow operations when possible for better performance
- **Depth Limiting**: Use depth parameters to prevent infinite recursion
- **In-place Modification**: `cut_default` modifies objects in place for memory efficiency
- **Caching**: Consider caching results of expensive purification operations

## Best Practices

1. **Always validate inputs** before processing
2. **Use depth limits** for recursive operations on unknown data structures
3. **Prefer immutable operations** except when memory is a concern
4. **Handle edge cases** like circular references in complex objects
5. **Document expected object shapes** when using with APIs

## Error Handling

The module provides detailed error messages for common mistakes:

```javascript
// TypeError: Source must be an object
nothing.cut_default("not an object");

// TypeError: Property name must be a string, but got number
nothing.from_object(obj, 123);

// TypeError: Both target and source must be objects
nothing.shallow_merge(null, {});
```

## Browser Compatibility

- Modern browsers (ES6+)
- Node.js 12+
- Supports all JavaScript environments with ES6 module support

## Version History

- **v1.0.4** - Current version with comprehensive object manipulation
- Enhanced JSDoc documentation
- Improved type safety with `typec` integration
- Added purification and normalization utilities

## Author

**Andrew M. Pines** - *2025*

## License

This module is part of the HuaBot project utilities.

---

*For more examples and advanced usage, check the source code documentation and tests.*
