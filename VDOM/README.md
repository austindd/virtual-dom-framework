# Virtual DOM Framework Pattern in Vanilla JavaScript
### Reverse-Engineering Features of ReactJS

[Take a look at the code](https://github.com/austinddavis/virtual-dom-framework/);

### About:

An opinionated DOM manipulation framework based loosely on React.

***Note**: This framework is currently under construction. The 'example-app' folder is my testing ground for the library, and the main 'VDOM' folder is currently out of date*

The core algorithm constructs a virtual representation of a desired DOM tree, a "virtual DOM," and compares it against a previous version of itself, and updates the real DOM based on their differences. This should be a familiar concept for those who have used front-end JS frameworks.

This library is just a different take on that concept. I just wanted to explore the concepts for myself. This repository is the result of my self-education.



### Project Goals:

This started as a personal project to improve my understanding of DOM manipulation frameworks. For now, it is FAR from production-ready, but I intend to improve this library over time. Eventually I would like to turn this into a stable and reliable framework, and build quality web apps with it.

There are still plenty of known and unknown bugs. Contributions are welcomed for code improvements, documentation, bug reports/fixes, testing, and feature requests. Just let me know.

Documentation is still pending as of March 12, 2019. Will be updated soon with a basic API guide.

### To-Do List:

- Fix DOM event handling by implementing top-level event delegation (a technique used by React to solve the same problem).
- Settle on ideal component composition structure.
- Normalize component class composition for ES5 and ES6 classes.
- Provide basic API documentaion.
- Improve error handling for edge cases during the construction and diffing of virtual DOM's.
- Add API for global state management (should implement this as a plugin to avoid conflicts with other state management libraries).

### Additional Notes:

The API looks a lot like the ES5 version of ReactJS without JSX. Personally, this works pretty well. I prefer ES5 classes for a variety of reasons that will be documented later.