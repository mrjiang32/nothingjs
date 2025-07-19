# Nothing Utility Library (`nothing.js`)

A lightweight JavaScript utility library for handling default values, empty states, and object operations with comprehensive type safety.

## Features

- Default "nothing" values for all JavaScript types
- Type-safe object operations (merge, purify, normalize)
- Empty state detection
- Recursive object processing
- Comprehensive error handling

## Installation

```javascript
import nothing from './nothing.js';
```

## API Reference

### Core Utilities

#### `by_type(type)`
Returns default empty value for specified type.

```javascript
nothing.by_type("string"); // ""
nothing.by_type("array"); // []
```

#### `by_value(value)`
Returns default empty value matching input's type.

```javascript
nothing.by_value(42); // 0
nothing.by_value({a:1}); // {}
```

#### `is_default(value)`
Checks if value is empty/default for its type.

```javascript
nothing.is_default(""); // true
nothing.is_default([]); // true
nothing.is_default(0); // true
```

### Object Operations

#### `from_object(source, ...properties)`
Creates new object with only specified properties.

```javascript
const obj = {a:1, b:2, c:3};
nothing.from_object(obj, "a", "c"); // {a:1, c:3}
```

#### `purification(source, depth=-1)`
Removes default values and prototypes from object.

```javascript
const obj = {a:"", b:null, c:42, nested: {d:0}};
nothing.purification(obj); // {c:42}
```

#### `shallow_merge(target, ...sources)`
Merges objects (shallow, modifies target).

```javascript
const merged = nothing.shallow_merge({a:1}, {b:2}, {a:3});
// {a:3, b:2}
```

#### `deep_merge(target, ...sources)`
Recursively merges objects (modifies target).

```javascript
const merged = nothing.deep_merge(
  {a:1, nested:{x:1}}, 
  {b:2, nested:{y:2}}
);
// {a:1, b:2, nested:{x:1, y:2}}
```

#### `cut_default(source, depth=-1)`
Removes default values from object in-place.

```javascript
const obj = {a:"", b:0, c:null, d:42};
nothing.cut_default(obj); // {d:42}
```

### Value Handling

#### `normalize(value)`
Converts null/undefined/NaN to proper null.

```javascript
nothing.normalize(undefined); // null
nothing.normalize("hello"); // "hello"
```

#### `fallback(value, default)`
Returns fallback if value is null/undefined/NaN.

```javascript
nothing.fallback(null, "default"); // "default"
nothing.fallback(0, "default"); // 0
```

#### `is_empty(value)`
Checks for empty states (string, array, object).

```javascript
nothing.is_empty(""); // true
nothing.is_empty([]); // true
nothing.is_empty({}); // true
nothing.is_empty(0); // false
```

### Constants

#### `object`
Default empty object (`{}` with null prototype).

```javascript
const emptyObj = nothing.object;
```

#### `do_nothing`
No-op function that returns undefined.

```javascript
nothing.do_nothing(); // undefined
```

## Examples

### Basic Usage
```javascript
// Get defaults
const emptyString = nothing.by_type("string"); // ""

// Check empty states
if (nothing.is_empty(userInput)) {
  userInput = "default";
}

// Safe property access
const userName = nothing.fallback(user.name, "Anonymous");
```

### Object Handling
```javascript
// Merge configurations
const config = nothing.deep_merge(
  {db: {host:"localhost"}},
  {db: {port:5432}}
);

// Clean API response
const cleanData = nothing.purification(apiResponse);

// Selective copy
const userPublic = nothing.from_object(
  user, 
  "name", "avatar"
);
```

## Version
1.0.5

## License
MIT © Andrew M. Pines
