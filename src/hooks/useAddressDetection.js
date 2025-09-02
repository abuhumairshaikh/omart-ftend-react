import { useState } from "react";
import {
  buildPayload,
  getAddressFromCoords,
  parseAddressComponents,
} from "../utils/helper";
import {
  checkGeolocationSupport,
  getCurrentPosition,
  getErrorMessage,
  isPayloadValid,
} from "../utils/location";

const useAddressDetection = () => {
  const [address, setAddress] = useState({
    country: "",
    street: "",
    district: "",
    state: "",
    pincode: "",
    latitude: null,
    longitude: null,
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const parseAndSetAddress = (addressData) => {
    const addressComponents = parseAddressComponents(addressData);
    if (addressComponents) {
      setAddress((prev) => ({
        ...prev,
        country: addressComponents.country,
        street: addressComponents.street,
        district: addressComponents.district,
        state: addressComponents.state,
        pincode: addressComponents.pincode,
      }));
    }
    return addressComponents;
  };

  const buildAndValidatePayload = (lat, lng, addressComponents) => {
    const { user } = buildPayload(
      lat,
      lng,
      address.area,
      addressComponents.district,
      addressComponents.state,
      addressComponents.country,
      addressComponents.pincode,
      addressComponents.street
    );

    return isPayloadValid(user) ? user : null;
  };

  const detectLocation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const isSupported = await checkGeolocationSupport();
      if (!isSupported) {
        throw new Error("Geolocation is not supported by this browser.");
      }

      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;

      setAddress((prev) => ({ ...prev, latitude, longitude }));

      const addressData = await getAddressFromCoords(latitude, longitude);
      const addressComponents = parseAndSetAddress(addressData);

      if (!addressComponents) {
        throw new Error("Could not parse address components");
      }

      const validPayload = buildAndValidatePayload(
        latitude,
        longitude,
        addressComponents
      );
      return validPayload;
    } catch (err) {
      setError(err.message || getErrorMessage(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    address,
    error,
    isLoading,
    detectLocation,
    setAddress,
  };
};

export default useAddressDetection;
