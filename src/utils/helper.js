import { indianStates } from "../constants";

export const isCoordinate = (str) => /^-?\d+\.\d+$/?.test(str);

export function parseJwt(token) {
  if (!token) {
    return;
  }
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  return JSON.parse(window.atob(base64));
}

export const handleApiRequest = async (apiCall) => {
  try {
    const response = await apiCall();
    // Check if the response status indicates an error
    if (response?.error?.status >= 400) {
      throw response; // Throw the response to trigger catch
    }

    return response; // Return response if it's successful
  } catch (error) {
    // console.log("error", error);
    // Throw the error so it can be caught by the calling function
    const errorMessage =
      error?.error?.data?.messages?.[0] ||
      error?.data?.message ||
      "Something went wrong!";
    throw new Error(errorMessage);
  }
};

export const validatePassword = (password) => {
  const errors = [];

  if (password.length < 6 || password.length > 16) {
    errors.push("Password must be between 6 and 16 characters.");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter.");
  }
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number.");
  }
  // eslint-disable-next-line no-useless-escape
  if (!/[@$\.]/.test(password)) {
    errors.push(
      "Password must contain at least one special character (@, $, or .)."
    );
  }
  return errors;
};

export const validatePhoneNumber = (phone) => {
  const errors = [];
  const phoneNumberPattern = /^[0-9]+$/;
  if (phone.length > 10) {
    errors.push("Phone number cannot exceed 10 digits");
  }
  if (!phoneNumberPattern.test(phone)) {
    errors.push("Phone number can only contain numbers.");
  }
  return errors;
};

export function formatDate(isoDate, format) {
  const date = new Date(isoDate);

  // Extract day, month, and year
  const day = String(date.getDate()).padStart(2, "0"); // Ensure 2 digits
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();

  // Replace format placeholders
  return format.replace("dd", day).replace("mm", month).replace("yyyy", year);
}

export const getAddressFromCoords = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();
    return data.display_name || "";
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return "";
  }
};

export const buildPayload = (
  latitude,
  longitude,
  area,
  district,
  state,
  country,
  pincode,
  street
) => ({
  user: {
    area: street,
    district,
    state,
    country,
    pinCode: +pincode,
    latitude,
    longitude,
  },
});

export const parseAddressComponents = (fullAddress) => {
  if (!fullAddress) return null;

  const parts = fullAddress.split(", ");
  const lastPart = parts.at(-1) ?? "";
  const firstTwoParts = parts.slice(0, 2).join(", ");
  const districtParts = parts.length > 3 ? parts.slice(2, 4).join(", ") : "";

  const matchedState = parts.find((part) =>
    indianStates?.some((s) => s.toLowerCase() === part.toLowerCase())
  );
  const fallbackState = parts.filter((p) => !p.match(/^\d+$/)).at(-2) || "";

  const pinMatch = parts
    .find((part) => part.match(/\d{6}/))
    ?.match(/\d{6}/)?.[0];

  return {
    country: lastPart,
    street: firstTwoParts,
    district: districtParts,
    state: matchedState || fallbackState,
    pincode: pinMatch || "",
  };
};

// Helper function to order address fields properly
export const getOrderedAddress = (addressObj) => {
  if (!addressObj) return "";
  // Define the correct order and keys for address fields
  const addressOrder = [
    "building",
    "landmark",
    "area",
    "district",
    "state",
    "pinCode",
    "country",
  ];
  return addressOrder
    .map((key) => addressObj[key])
    .filter(Boolean)
    .join(", ");
};

export function cleanShippingAddress(shippingAddress) {
  if (!shippingAddress) return "";

  return shippingAddress
    .split(" ")
    .filter((val) => val.trim() !== "") // Remove empty strings
    .filter((item) => !isCoordinate(item)) // Remove coordinates
    .join(" ");
}
