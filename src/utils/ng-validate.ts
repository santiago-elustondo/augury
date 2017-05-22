import {MessageFactory} from '../communication/message-factory';
import {MessageType} from '../communication/message-type';

declare const getAllAngularTestabilities: Function;

let unsubscribe: () => void;

const handler = () => {
  // variable getAllAngularTestabilities will be defined by Angular
  // in debug mode for an Angular application.
  if (typeof getAllAngularTestabilities === 'function') {
    // messageJumpContext(MessageFactory.frameworkLoaded());

    if (unsubscribe) {
      unsubscribe();
    }

    return true;
  }

  return false;
};

if (!handler()) {
  const subscribe = () => {
    if (MutationObserver) {
      const observer = new MutationObserver(mutations => handler());
      observer.observe(document, { childList: true, subtree: true });

      return () => observer.disconnect();
    }

    const eventKeys = ['DOMNodeInserted', 'DOMNodeRemoved'];

    eventKeys.forEach(k => document.addEventListener(k, handler, false));

    return () => eventKeys.forEach(k => document.removeEventListener(k, handler, false));
  };

  unsubscribe = subscribe();
}
