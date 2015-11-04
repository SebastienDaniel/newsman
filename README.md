Getting started
=
**newsman** is a light-weight user notification module for the **Browser**, with no dependencies.
To use newsman, simply install it with NPM and require it with Browserify, as follows:
```console
npm install newsman
```

```console
require("newsman");
```

For your convenience, some basic styles are provided in `newsman/src/styles`.

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
The notification markup is very simple, it consists of a single "div". It gets two state css classes appended to it during its lifecycle (*isInactive* and *isActive*).
```html
<div class="newsman__notification">
    msg
</div>
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
The alert window markup has 5 components (divs). The window event listener is always bound to *newsman__window*.
```html
<div class="newsman__overlay">
  <div class="newsman__window">
    <div class="newsman__window__content"> msg </div>
    <div class="newsman__window__actionBar">
      <div class="newsman__button"> ok </div>
    </div>
  </div>
</div>
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
The confirm window markup has 6 components (divs). The window event listener is always bound to *newsman__window*.
```html
<div class="newsman__overlay">
  <div class="newsman__window">
    <div class="newsman__window__content"> msg </div>
    <div class="newsman__window__actionBar">
      <div class="newsman__button"> cancel </div>
      <div class="newsman__button"> ok </div>
    </div>
  </div>
</div>
```

Only one Alert or Confirm window can be active at any given time. If you try to launch a second such window, newsman's method will return `false` and not do anything until the currently active window is deactivated (*requires user action*).
