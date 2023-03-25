import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  FacebookAuthProvider,
} from "firebase/auth";
import { auth } from "../../services/firebase";
import { setCookie, parseCookies } from "nookies";
import { clearUser } from "../../redux/slices/user";
import { clearAllCart } from "../../redux/slices/cart";
import { clearSavedStore } from "../../redux/slices/savedStore";
import { clearAddress } from "../../redux/slices/savedAddress";
import { clearList } from "../../redux/slices/savedProduct";
import { clearViewedList } from "../../redux/slices/viewed-product";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const cookies = parseCookies();
  const dispatch = useDispatch();
  const router = useRouter();
  const defaultLocation = cookies.userLocation
    ? cookies.userLocation.split(",")
    : process.env.DEFAULT_LOCATION.split(",");

  const [user, setUser] = useState({});
  const [userLocation, setUserLocation] = useState("");

  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  function logOut() {
    return signOut(auth);
  }
  function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
  }
  function facebookSignIn() {
    const facebookAuthProvider = new FacebookAuthProvider();
    return signInWithPopup(auth, facebookAuthProvider);
  }
  function setUpRecaptcha(number) {
    const recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      { size: "invisible" },
      auth
    );
    recaptchaVerifier.render();
    return signInWithPhoneNumber(auth, number, recaptchaVerifier);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      setUser(currentuser);
    });
    if (!cookies?.access_token) {
      dispatch(clearUser());
      dispatch(clearAllCart());
      dispatch(clearSavedStore());
      dispatch(clearAddress());
      dispatch(clearList());
      dispatch(clearViewedList());
      document.cookie =
        "access_token" + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie =
        "userLocation" + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }
    return () => {
      unsubscribe();
    };
  }, []);

  const setUserDefaultLocation = (selectedAddress) => {
    if (selectedAddress) {
      setCookie(
        null,
        "userLocation",
        `${selectedAddress.latitude},${selectedAddress.longitude}`
      );
      setUserLocation(
        `${selectedAddress.latitude},${selectedAddress.longitude}`
      );
    } else if (defaultLocation?.length) {
      setCookie(
        null,
        "userLocation",
        `${defaultLocation[0]},${defaultLocation[1]}`
      );
      setUserLocation(`${defaultLocation[0]},${defaultLocation[1]}`);
    } else if (Object.keys(navigator.geolocation).length !== 0) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setCookie(
          null,
          "userLocation",
          `${position.coords.latitude},${position.coords.longitude}`
        );
      });
      setUserLocation(
        `${position.coords.latitude},${position.coords.longitude}`
      );
    }
  };

  useEffect(() => {
    setUserDefaultLocation();
  }, [cookies.userLocation]);

  return (
    <AuthContext.Provider
      value={{
        user,
        logIn,
        signUp,
        logOut,
        googleSignIn,
        setUpRecaptcha,
        facebookSignIn,
        userLocation,
        setUserDefaultLocation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
