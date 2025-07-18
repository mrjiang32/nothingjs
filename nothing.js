"use strict";

import typec from "./typec.js";

/**
 * @fileoverview Utility module for providing default "nothing" values
 * Provides default empty/null values for different JavaScript types.
 * Useful for initializations, fallbacks, and placeholder values.
 * @author Andrew M. Pines
 */

/**
 * Frozen object containing default "nothing" values for each JavaScript type
 * @type {Object.<string, *>}
 * @readonly
 * @property {Function} function - Returns undefined function
 * @property {Object} object - Empty object
 * @property {string} string - Empty string
 * @property {number} number - Zero
 * @property {boolean} boolean - False
 * @property {Array} array - Empty array
 * @property {null} null - Null value
 * @property {undefined} undefined - Undefined value
 */
const NOTHING = Object.freeze({
    "object": Object.create(null), // Empty object
    "string": String(""), // Empty string
    "number": Number(0), // Zero
    "boolean": Boolean(false), // False
    "array": Array.from([]), // Empty array
    "function": () => undefined,
    "null": null,
    "undefined": undefined
});

/**
 * Gets the default "nothing" value for a specific type
 * @param {string} type - The type name (e.g., "string", "number", "object", etc.)
 * @returns {*} The default "nothing" value for the specified type, or undefined if type not found
 * @example
 * by_type("string");   // ""
 * by_type("number");   // 0
 * by_type("boolean");  // false
 * by_type("unknown");  // undefined
 */
const by_type = (type) => {
    return NOTHING[type] || NOTHING["undefined"];
}

/**
 * Gets the default "nothing" value based on the type of the provided value
 * @param {*} value - Any value to determine the type from
 * @returns {*} The default "nothing" value for the same type as the input value
 * @example
 * by_value("hello");    // "" (empty string)
 * by_value(42);         // 0
 * by_value(true);       // false
 * by_value({a: 1});     // {}
 * by_value([1, 2, 3]);  // []
 */
const by_value = (value) => {
    return by_type(typeof value);
}

/**
 * Checks if a value is the default "nothing" value for its type
 * @param {*} value - The value to check
 * @returns {boolean} True if the value is the default "nothing" value for its type, false otherwise
 * @example
 * is_default("");        // true (empty string is default for string)
 * is_default("hello");   // false (non-empty string)
 * is_default(0);         // true (zero is default for number)
 * is_default(42);        // false (non-zero number)
 * is_default(false);     // true (false is default for boolean)
 * is_default(true);      // false (true is not default for boolean)
 * is_default([]);        // true (empty array is default for array)
 * is_default([1, 2]);    // false (non-empty array)
 * is_default({});        // true (empty object is default for object)
 * is_default({a: 1});    // false (non-empty object)
 * is_default(null);      // true (null is default for null)
 * is_default(undefined); // true (undefined is default for undefined)
 */
const is_default = (value) => {
    const valueType = typeof value;

    if (typec.is_null(value)) {
        return true; // null is the default "nothing" for null
    }

    // Handle arrays (typeof returns "object" for arrays)
    if (Array.isArray(value)) {
        return value.length === 0; // empty array is default
    }

    // Handle objects (but not arrays or null)
    if (valueType === "object") {
        return Object.keys(value).length === 0; // empty object is default
    }

    // For primitive types, use direct comparison
    return value === by_value(value);
}

/**
 * Returns the value if it's not a default "nothing" value, otherwise returns the provided default
 * @param {*} value - The value to check
 * @param {*} default_value - The fallback value to return if the input value is default
 * @returns {*} The original value if it's not default, otherwise the provided default value
 * @example
 * set_default("", "fallback");      // "fallback" (empty string is default)
 * set_default("hello", "fallback"); // "hello" (non-empty string)
 * set_default(0, 42);               // 42 (zero is default for number)
 * set_default(5, 42);               // 5 (non-zero number)
 * set_default([], [1, 2, 3]);       // [1, 2, 3] (empty array is default)
 * set_default([4, 5], [1, 2, 3]);   // [4, 5] (non-empty array)
 * set_default({}, {name: "John"});  // {name: "John"} (empty object is default)
 * set_default({age: 25}, {name: "John"}); // {age: 25} (non-empty object)
 * set_default(null, "not null");    // "not null" (null is default)
 * set_default(undefined, "defined"); // "defined" (undefined is default)
 */
const set_default = (value, default_value) => {
    if (!is_default(value)) {
        return value; // If value is not default, return it
    } else {
        return default_value; // If value is default, return the provided default value
    }
}

/**
 * Make a copy of an object with only specified properties
 * @param {Object} source - The source object to copy properties from
 * @param {...string} properties - The property names to copy from the source object
 * @returns {Object} A new object containing only the specified properties from the source
 * @example
 * from_object({ a: 1, b: 2, c: 3 }, "a", "c"); // { a: 1, c: 3 }
 */
const from_object = (source, ...properties) => {
    if (!typec.type_check(source, "object")) {
        throw new TypeError("Source must be an object.");
    }

    let result = object;

    for (const prop of properties) {
        if (!typec.type_check(prop, "string")) {
            throw new TypeError(`Property name must be a string, but got ${typeof prop}`);
        }
        if (Object.prototype.hasOwnProperty.call(source, prop)) {
            result[prop] = source[prop]; // Copy property from source to result
        }
    }

    return result; // Return the new object with selected properties
}

/**
 * Make your objects more simple by removing default "nothing" values and prototypes.
 * @param {*} source - The source object to purify (remove default "nothing" values, and no prototype)
 * @param {*} [deep=-1] - Maximum recursion depth (-1 for unlimited, 0 to disable recursion) 
 * @returns 
 */
const purification = (source, deep = -1) => {
    if (deep <= 0 && deep !== -1) {
        return source; // Stop recursion if depth limit reached
    }

    if (!typec.type_check(source, "object")) {
        throw new TypeError("Source must be an object.");
    }

    let result = object;

    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (is_default(source[key])) {
                continue; // Skip default "nothing" values
            } else if (typec.type_check(source[key], "object")) {
                // If the property is an object, recursively purify
                result[key] = purification(source[key], deep === -1 ? -1 : deep - 1);
            } else {
                result[key] = source[key]; // Otherwise, just copy the value
            }
        }
    }

    return result; // Return the purified object
}

/**
 * Performs a shallow merge of source object properties into target object
 * @param {Object} target - The target object to merge into (will be modified)
 * @param {Object} source - The source object to merge from
 * @returns {Object} The modified target object
 * @throws {TypeError} When target or source is not an object
 * @example
 * const target = { a: 1, b: 2 };
 * const source = { b: 3, c: 4 };
 * shallow_merge(target, source); // { a: 1, b: 3, c: 4 }
 * 
 * // Nested objects are copied by reference
 * const target2 = { nested: { x: 1 } };
 * const source2 = { nested: { y: 2 } };
 * shallow_merge(target2, source2); // { nested: { y: 2 } } - overwrites nested object
 */
const shallow_merge = (target, source) => {
    if (!(typec.type_check(target, "object") && typec.type_check(source, "object"))) {
        throw new TypeError("Both target and source must be objects.");
    }

    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key]; // Shallow copy properties from source to target
        }
    }

    return target; // Return the modified target object
}

/**
 * Performs a deep merge of source object properties into target object
 * @param {Object} target - The target object to merge into (will be modified)
 * @param {Object} source - The source object to merge from
 * @returns {Object} The modified target object
 * @throws {TypeError} When target or source is not an object
 * @example
 * const target = { a: 1, nested: { x: 1, y: 2 } };
 * const source = { b: 2, nested: { y: 3, z: 4 } };
 * deep_merge(target, source); // { a: 1, b: 2, nested: { x: 1, y: 3, z: 4 } }
 * 
 * // Arrays are replaced, not merged
 * const target2 = { arr: [1, 2, 3] };
 * const source2 = { arr: [4, 5] };
 * deep_merge(target2, source2); // { arr: [4, 5] }
 * 
 * // Handles null values safely
 * const target3 = { nested: null };
 * const source3 = { nested: { a: 1 } };
 * deep_merge(target3, source3); // { nested: { a: 1 } }
 */
const deep_merge = (target, source, deep = -1) => {
    if (deep <= 0 && deep !== -1) {
        return target; // Stop recursion if depth limit reached
    }

    if (!(typec.type_check(target, "object") && typec.type_check(source, "object"))) {
        throw new TypeError("Both target and source must be objects.");
    }

    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (typec.type_check(source[key], "object") && !Array.isArray(source[key])) {
                // If the property is an object, recursively merge
                target[key] = deep_merge(target[key] || {}, source[key], deep === -1 ? -1 : deep - 1);
            } else {
                // Otherwise, just assign the value
                target[key] = source[key];
            }
        }
    }

    return target; // Return the modified target object
}

/**
 * Removes properties with default "nothing" values from an object
 * @param {Object} source - The source object to clean (will be modified in place)
 * @param {number} [deep=-1] - Maximum recursion depth (-1 for unlimited, 0 to disable recursion)
 * @returns {void} Modifies the source object in place
 * @throws {TypeError} When source is not an object
 * @example
 * const obj = { a: "", b: "hello", c: 0, d: 42, nested: { x: [], y: [1, 2] } };
 * cut_default(obj);
 * // obj becomes: { b: "hello", d: 42, nested: { y: [1, 2] } }
 * 
 * // With depth limit
 * const obj2 = { a: "", nested: { b: "", deep: { c: "" } } };
 * cut_default(obj2, 1); // Only goes 1 level deep
 * // obj2 becomes: { nested: { deep: { c: "" } } }
 * 
 * // Removes various default values
 * const obj3 = { str: "", num: 0, bool: false, arr: [], obj: {}, func: undefined };
 * cut_default(obj3);
 * // obj3 becomes: {} (all properties removed as they are defaults)
 */
const cut_default = (source, deep = -1) => {
    if (!typec.type_check(source, "object")) {
        throw new TypeError("Source must be an object.");
    }

    if (deep <= 0 && deep !== -1) {
        return; // Stop recursion if depth limit reached
    }

    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (is_default(source[key])) {
                delete source[key]; // Remove properties that are default "nothing" values
            } else if (typec.type_check(source[key], "object")) {
                // If the property is an object, recursively cut defaults
                cut_default(source[key], deep === -1 ? -1 : deep - 1);
            }
        }
    }
}

/**
 * If the value is null (`null`, `undefined`, `NaN`), 
 * returns the default "nothing" value for null.
 * Otherwise, returns the value itself
 * @param {*} value 
 * @returns 
 */
const normalize = (value) => {
    if (typec.is_null(value)) {
        return by_type("null");
    }
    return value;
}

/**
 * A function that does nothing and returns undefined
 * @type {Function}
 * @returns {undefined} Always returns undefined
 * @example
 * do_nothing();  // undefined
 * 
 * // Useful as a placeholder callback
 * someFunction(data, do_nothing);
 */
const do_nothing = by_type("function");

/**
 * An object that represents the default "nothing" value for objects
 * @type {Object}
 * @example
 * const emptyObject = object; // [Object: null prototype] {}
 */
const object = by_type("object");

/**
 * Nothing utility module
 * It's small yet powerful, providing default values and utility functions
 * @namespace nothing
 * @version 1.0.4
 * @author Andrew M. Pines
 * @copyright 2025 Andrew M. Pines
 */
export default Object.freeze({
    /** @type {Function} Get default value by type name */
    by_type,
    /** @type {Function} Get default value by example value's type */
    by_value,
    /** @type {Function} Check if value is default for its type */
    is_default,
    /** @type {Function} Return value or fallback if value is default */
    set_default,
    /** @type {Function} Make a little copy of given object with specified properties */
    from_object,
    /** @type {Function} Purify an object by removing default "nothing" values and prototypes */
    purification,
    /** @type {Function} Normalize the nulls */
    normalize,
    /** @type {Function} Shallow merge objects */
    shallow_merge,
    /** @type {Function} Deep merge objects recursively */
    deep_merge,
    /** @type {Function} Remove default values from object */
    cut_default,
    /** @type {Function} Function that does nothing */
    do_nothing,
    /** @type {Object} Default empty object */
    object
});