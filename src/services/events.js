class Events {

  on(element, eventName, callback) {
    element.addEventListener(eventName, callback, false);
  }

  subscribe(eventName, callback) {
    document.addEventListener(eventName, callback, false);
  }

  send(eventName, details) {
    details = details || {};

    const event = new CustomEvent(eventName, {
      detail: details
    });

    document.dispatchEvent(event);
  }

  deleteEvent() {
    document.removeEventListener(eventName, callback, false);
  }
}

const events = new Events();
