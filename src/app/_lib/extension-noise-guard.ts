/**
 * Wallet extensions (MetaMask and friends) inject `inpage.js` into the main
 * world of every page, whether or not the site asks for a wallet. When their
 * background port isn't there, they reject a promise nobody owns and log the
 * failure themselves:
 *
 *   Error restoring session i: Failed to connect to MetaMask
 *   ⨯ unhandledRejection: i: Failed to connect to MetaMask
 *
 * None of it comes from this site — there is no web3 code here — but the
 * rejections still reach the Next dev overlay, and Next 16 forwards the
 * console lines to the dev server terminal.
 *
 * Two wallet extensions installed side by side add a third line, when the
 * second one to load tries to claim `window.ethereum` after the first has
 * already defined it non-configurably:
 *
 *   Uncaught TypeError: Cannot redefine property: ethereum
 *
 * That one is a plain uncaught error rather than a rejection, so it needs its
 * own listener.
 *
 * This drops all three, and only when the frame actually blames extension
 * code: anything thrown by our own bundles keeps surfacing exactly as before.
 *
 * It ships as an inline script in <head> rather than a component effect for
 * two reasons: it has to be listening before the extension gets around to
 * failing, and `stopImmediatePropagation` only silences the overlay if this
 * listener is registered ahead of the one the overlay installs.
 */
const source = `(function () {
  var EXT = /(chrome|moz|safari-web)-extension:\\/\\//;

  function fromExtension(value) {
    if (!value) return false;
    if (typeof value === 'string') return EXT.test(value);
    return typeof value.stack === 'string' && EXT.test(value.stack);
  }

  addEventListener('unhandledrejection', function (event) {
    if (!fromExtension(event.reason)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  });

  addEventListener('error', function (event) {
    // filename is the script the throw came from; the stack is the fallback
    // for the browsers that leave filename empty on cross-origin scripts.
    if (!fromExtension(event.filename) && !fromExtension(event.error)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  });

  var error = console.error;
  console.error = function () {
    for (var i = 0; i < arguments.length; i++) {
      if (fromExtension(arguments[i])) return;
    }
    return error.apply(console, arguments);
  };
})();`;

/** Ready to hand to a <script dangerouslySetInnerHTML>. */
export const extensionNoiseGuard = { __html: source };
