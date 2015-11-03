Getting started
=
**newsman** is a light-weight user notification module for the **Browser**, with no dependencies.
To use newsman, simply install it with NPM and require it with Browserify, as follows:
```
npm install newsman
```

```
require("newsman");
```

Methods
==

notify()
--
Sends a small, non-interactive notification to the user. By default it is located at the bottom-right of the screen.
```js
/**
* @param {string} msg - text message to display to user, max 120 characters.
*/
newsman.notify(msg);
```

alert()
--
Displays a small modal window containing the provided message and a button (*ok*).
```js
/**
* @param {string} msg - text message to display to users.
* @param {function} cb - callback function triggered when the user clicks the button.
*/
newsman.alert(msg, cb);
```

confirm()
--
Displays a small modal window containing the provided message and two buttons (*ok and cancel*).
```js
/**
* @param {string} msg - text message to display to user.
* @param {function} cb - callback function triggered when the user clicks one of the buttons.
* If "ok", it calls the provided callback with the "true" argument, otherwise "false".
*/
newsman.confirm(msg, cb);
```

Only one Alert or Confirm window can be active at any given time. If you try to launch a second such window, newsman's method will return `false` and not do anything until the currently active window is deactivated (*requires user action*).
