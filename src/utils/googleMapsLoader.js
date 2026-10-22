// Google Maps JavaScript API Loader with script caching and auth failure handling
//
// Design notes:
// - googleMapsPromise caches the in-flight / completed load so the script is never
//   injected twice across different components.
// - currentApiKey tracks the active key. If the key changes (e.g. user updated .env),
//   the loader automatically purges the old script and retries with the new key.
// - authFailed is tracked per key session.
// - authCallbacks collects every onAuthFailure callback registered across all
//   concurrent callers so each one gets notified when auth fails.

let googleMapsPromise = null;
let authFailed = false;
let currentApiKey = null;
const authCallbacks = new Set();

/**
 * Reset loader state (useful if API was just enabled in Google Cloud Console
 * and user wants to retry without refreshing the entire browser tab).
 */
export function resetGoogleMapsLoader() {
  authFailed = false;
  googleMapsPromise = null;
  const existing = document.getElementById('google-maps-script');
  if (existing) existing.remove();
  if (window.google) {
    try { delete window.google.maps; } catch (_) {}
  }
}

/**
 * loadGoogleMapsScript
 *
 * @param {string}   apiKey         - The VITE_GOOGLE_MAPS_API_KEY value.
 * @param {Function} onAuthFailure  - Called when Google Maps auth fails (bad key,
 *                                    billing disabled, API not enabled).
 * @returns {Promise<object>}        - Resolves with window.google.maps when ready.
 */
export function loadGoogleMapsScript(apiKey, onAuthFailure) {
  // If the API key changed, purge the old script tag & state immediately
  if (currentApiKey && currentApiKey !== apiKey) {
    resetGoogleMapsLoader();
  }
  currentApiKey = apiKey;

  // Register caller's auth-failure callback so it is notified even when the
  // gm_authFailure fired on a previous caller's load attempt.
  if (typeof onAuthFailure === 'function') {
    authCallbacks.add(onAuthFailure);
  }

  // Auth already failed for this key — reject immediately and notify this caller.
  if (authFailed) {
    if (typeof onAuthFailure === 'function') {
      onAuthFailure();
    }
    return Promise.reject(new Error('GMAPS_AUTH_FAILURE'));
  }

  // API already in the DOM and initialised — resolve immediately.
  if (window.google && window.google.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
    return Promise.reject(new Error('NO_API_KEY'));
  }

  // Return the cached in-flight promise if a load is already underway.
  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  // Install gm_authFailure ONCE before the script tag is created.
  // Google Maps calls this global function when the API key is rejected,
  // billing is inactive, or the Maps JavaScript API is not enabled.
  window.gm_authFailure = () => {
    console.error(
      '[GoogleMapsLoader] gm_authFailure: API key rejected, billing inactive, ' +
      'or Maps JavaScript API not enabled in Google Cloud Console.'
    );
    authFailed = true;

    // Notify every registered caller.
    authCallbacks.forEach((cb) => {
      try { cb(); } catch (_) {}
    });
    authCallbacks.clear();

    googleMapsPromise = null;
  };

  googleMapsPromise = new Promise((resolve, reject) => {
    // Guard: check if an existing script tag has the correct key
    const existing = document.getElementById('google-maps-script');
    if (existing) {
      if (!existing.src.includes(`key=${apiKey}`)) {
        existing.remove();
      } else {
        const handleLoad = () => {
          if (!authFailed && window.google && window.google.maps) {
            resolve(window.google.maps);
          } else if (authFailed) {
            reject(new Error('GMAPS_AUTH_FAILURE'));
          } else {
            reject(new Error('Google Maps script loaded but window.google.maps is not available'));
          }
        };
        existing.addEventListener('load', handleLoad, { once: true });
        existing.addEventListener('error', (e) => {
          googleMapsPromise = null;
          reject(e);
        }, { once: true });
        return;
      }
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.type = 'text/javascript';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry&loading=async&language=en&region=MY`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      // gm_authFailure may have already fired by the time onload runs.
      if (authFailed) {
        reject(new Error('GMAPS_AUTH_FAILURE'));
        return;
      }
      if (window.google && window.google.maps) {
        resolve(window.google.maps);
      } else {
        reject(new Error('Google Maps script loaded but window.google.maps is not available'));
      }
    };

    script.onerror = (err) => {
      googleMapsPromise = null;
      reject(err);
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
}
