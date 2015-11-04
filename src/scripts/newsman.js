"use strict";
/**
* newsman is a notification center for browser user interfaces. It handles basic interaction-free notifications,
* alert-like notification requiring user action, and a confirm-like notification requiring user acceptance or refusal
*
* @namespace newsman
*/
var config = {
        notificationDuration: 4000,
        maxNotifications: 6
    },
    cache = {
        notifications: [],
        newsmanWindow: null
    };

/**
 * Event listener bound to a newsman window object, listens for clicks on newsman window buttons. Kills the
 * newsman window object upon user interaction.
 * @memberof newsman
 * @private
 * @param {object} e - event object
 */
function newsmanWindowListener(e) {
    e.stopPropagation();

    if (e.target === cache.newsmanWindow.acceptButton || e.target === cache.newsmanWindow.refuseButton) {
        // trigger callback
        cache.newsmanWindow.cb(e.target === cache.newsmanWindow.acceptButton);

        // remove listener
        cache.newsmanWindow.container.removeEventListener("click", newsmanWindowListener, true);

        // kill
        document.body.removeChild(cache.newsmanWindow.overlay);
        cache.newsmanWindow = null;
    }
}

Notification.prototype = {
    /**
     * @memberof Notification.prototype
     * @function
     * @summary sets the notification's container CSS class name to "isActive" and removes the timeout to automate
     * the call to "activate".
     */
    activate: function() {
        this.container.className = "newsman__notification isActive";
        window.clearTimeout(this.t2);
    },
    /**
     * @memberof Notification.prototype
     * @function
     * @summary clears everything bound to this notification, removes the notification from cache and from DOM and adjusts
     * remaining notifications' styles.
     */
    die: function() {
        window.clearTimeout(this.t1);
        window.clearTimeout(this.t2);

        cache.notifications.splice(cache.notifications.indexOf(this), 1);

        this.container.parentNode.removeChild(this.container);
        cache.notifications.forEach(function(n, i) {
            n.container.setAttribute("style", "margin-bottom:" + i * 80 + "px;");
        });
    }
};

/**
 * injects a non-interactive UI element to notify user of an event or result of. Notifications can be chained
 * and will stack. Notifications have pre-determined extinction delay.
 * @memberof newsman
 * @private
 * @constructor
 * @param {string} msg - the message to notify of. Maxlength = 120 characters
 * @return {Notification}
 */
function Notification(msg) {
    /**
     * @typedef Notification
     * @prop {object} container - HTML element of the notification item
     * @prop {number} t1 - timeout id for self-destruction
     * @prop {number} t2 - timeout id for auto-activation
     */
    this.container = document.createElement("div");
    this.container.className = "newsman__notification isInactive";
    this.container.textContent = msg.slice(0, 120);
    this.t1 = window.setTimeout(this.die.bind(this), config.notificationDuration);
    this.t2 = window.setTimeout(this.activate.bind(this), 10);
}

/**
 * @memberof newsman
 * @private
 * @summary adjusts current notification to respect count limit and injects notification "n" into cache and DOM
 * @param {Notification} n - notification object
 */
function injectNotification(n) {
    if (cache.notifications.length >= config.maxNotifications) {
        cache.notifications[cache.notifications.length  - 1].die();
    }
    cache.notifications.unshift(n);

    cache.notifications.forEach(function(note, i) {
        note.container.setAttribute("style", "margin-bottom:" + i * 80 + "px;");
    });

    document.body.appendChild(n.container);
}

/**
 * compiles a newsmanWindow object into a UI component, binds it's listener and injects it into the DOM
 * @memberof newsman
 * @private
 * @param {NewsmanWindow} w - newman window object to compile
 */
function renderNewsmanWindow(w) {
    if (w.refuseButton) {
        w.actionBar.appendChild(w.refuseButton);
    }

    if (w.acceptButton) {
        w.actionBar.appendChild(w.acceptButton);
    }

    w.container.appendChild(w.content);
    w.container.appendChild(w.actionBar);

    w.overlay.appendChild(w.container);
    w.container.addEventListener("click", newsmanWindowListener, true);
    document.body.appendChild(w.overlay);
    cache.newsmanWindow = w;
}

/**
 * Builds a NewsmanWindow object
 * @memberof newsman
 * @private
 * @constructor
 * @param {function} cb - callback function
 * @returns {NewsmanWindow}
 */
function NewsmanWindow(cb) {
    /**
     * @typedef NewsmanWindow
     * @prop {object} overlay - HTML element wrapping entire viewport and containing container element.
     * @prop {object} container - HTML element wrapping the window
     * @prop {object} content - HTML element containing message
     * @prop {object} actionBar - HTML element containing NewsmanWindow buttons
     */
    this.overlay = document.createElement("div");
    this.overlay.className = "newsman__overlay";

    this.container = document.createElement("div");
    this.container.className = "newsman__window";

    this.content = document.createElement("div");
    this.content.className = "newsman__window__content";

    this.actionBar = document.createElement("div");
    this.actionBar.className = "newsman__window__actionBar";
    this.cb = cb;
}

/**
 * displays an alert-like message to the user containing an acceptance button to notify callback of user interaction.
 * @memberof newsman
 * @private
 * @constructor
 * @extends NewsmanWindow
 *
 * @param {function} cb - callback function
 * @returns {Alert}
 */
function Alert(cb) {
    /**
     * @typedef Alert
     * @type {NewsmanWindow}
     * @prop {object} acceptButton - HTML element used for user approval
     */
    return Object.create(new NewsmanWindow(cb), {
        acceptButton: {
            value: (function() {
                var acceptButton = document.createElement("div");
                acceptButton.className = "newsman__button";

                return acceptButton;
            }()),
            enumerable: true
        }
    });
}

/**
 * displays an confirm-like message to the user. It contains two buttons, acceptance (true) and refusal (false),
 * which trigger the provided callback with relevant boolean value.
 * @memberof newsman
 * @private
 * @constructor
 * @extends Alert
 *
 * @param {function} cb - callback function
 * @returns {Confirm}
 */
function Confirm(cb) {
    /**
     * @typedef Confirm
     * @type {Alert}
     * @prop {object} refuseButton - HTML element used for user refusal
     */
    return Object.create(new Alert(cb), {
        refuseButton: {
            value: (function() {
                var refuseButton = document.createElement("div");
                refuseButton.className = "newsman__button";

                return refuseButton;
            }()),
            enumerable: true
        }
    });
}

/**
 * @memberof newsman
 * @summary slide a non-interactive notification into the UI, which self destructs
 *
 * @param {string} msg - message to inject into notification object
 */
module.exports.notify = function(msg) {
    injectNotification(new Notification(msg));
};

/**
 * @memberof newsman
 * @summary inject an alert-like window into the UI
 *
 * @param {string} msg - message to inject into the alert window
 * @param {function} cb - callback triggered on alert button click
 */
module.exports.alert = function(msg, cb) {
    var w;
    if (cache.newsmanWindow === null) {
        w = new Alert(cb);
        w.content.textContent = msg;
        w.acceptButton.textContent = "ok";

        renderNewsmanWindow(w);
        return true;
    } else {
        return false;
    }
};

/**
 * @memberof newsman
 * @summary prompt the user to confirm an action or to refuse it, with an confirm-like window
 *
 * @param {string} msg - message to inject into confirm window
 * @param {function} cb - callback function triggered when confirm is accepted or rejected.
 */
module.exports.confirm = function(msg, cb) {
    var w;
    if (cache.newsmanWindow === null) {
        w = new Confirm(cb);
        w.content.textContent = msg;
        w.acceptButton.textContent = "ok";
        w.refuseButton.textContent = "cancel";

        renderNewsmanWindow(w);
        return true;
    } else {
        return false;
    }
};

