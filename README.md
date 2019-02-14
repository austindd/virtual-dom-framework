# Virtual DOM Framework Pattern in Vanilla JavaScript
### Reverse-Engineering Features of ReactJS

[Take a look at the code](https://github.com/austinddavis/virtual-dom-framework/blob/master/vdom.js)

### About:

This JavaScript library provides an opinionated DOM manipulation framework based loosely on ReactJS.

At its core is an algorithm that constructs a virtual representation of a desired DOM tree, a "virtual DOM," and compares it against a previous version of itself, and updates the real DOM based on their differences. This should be a familiar concept for those who have used front-end JS frameworks.

This library is just a different take on that concept. I just wanted to explore the concepts for myself, and this is the result of my self-education.



### Project Goals:

This is, in part, a personal project to help me understand DOM manipulation frameworks on a much deeper level. For now, it is not intended for production, but I intend to improve this library over time. Eventually I would like this to turn into a stable and reliable framework.

While this framework is currently working on a basic level, there are still plenty of known and unknown bugs. Contributions are welcomed for code improvements, documentation, bug reports/fixes, testing, and feature requests. Just let me know.

Documentation is still pending as of February 14, 2019. Will be updated soon with a basic API guide.

### To-Do List:

- Provide basic API documentaion (top priority).
- Fix implementation of HTML inline 'on-event' event handlers.
- Add ability to nest component constructors inside each other within a single 'render' function. This will require some refactoring of the `VDOM.createClass` method.
- Improve error handling for edge cases during the construction and diffing of virtual DOM's.
- Add API for global state management (use event emitters as get/set methods for global state access).

### Additional Notes:

The API looks a lot like the ES5 version of ReactJS without JSX. Personally, this works pretty well. I prefer ES5 classes for a variety of reasons that will be documented later.