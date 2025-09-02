// utils/geolocationService.js
export const getGeolocationOptions = () => ({
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 60000,
});

export const getErrorMessage = (error) => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "Location permission denied. Enable it in browser settings.";
    case error.TIMEOUT:
      return "Location request timed out. Check your internet.";
    default:
      return "Could not get your location. Please enter it manually.";
  }
};

export const isPayloadValid = (payload) =>
  Object.values(payload).every((val) => val != null && val !== "");

export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      resolve,
      reject,
      getGeolocationOptions()
    );
  });
};

export const checkGeolocationSupport = () => {
  if (!navigator.geolocation) {
    if (window.isSecureContext) {
      return new Promise((resolve) => {
        // eslint-disable-next-line no-unused-vars
        const retryTimer = setTimeout(() => {
          resolve(!!navigator.geolocation);
        }, 500);
      });
    }
    return false;
  }
  return true;
};
