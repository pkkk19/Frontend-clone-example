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
import { auth } from "../services/firebase";
import { setCookie, parseCookies } from "nookies";
import { clearUser } from "../redux/slices/user";
import { clearAllCart } from "../redux/slices/cart";
import { clearSavedStore } from "../redux/slices/savedStore";
import { clearAddress } from "../redux/slices/savedAddress";
import { clearList } from "../redux/slices/savedProduct";
import { clearViewedList } from "../redux/slices/viewed-product";
import { batch, useDispatch } from "react-redux";
export const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}
export function AuthProvider({ children }) {
  const cookies = parseCookies();
  const dispatch = useDispatch();
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
      batch(() => {
        dispatch(clearUser());
        dispatch(clearAllCart());
        dispatch(clearSavedStore());
        dispatch(clearAddress());
        dispatch(clearList());
        dispatch(clearViewedList());
      });
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
    setCookie(
      null,
      "userLocation",
      `${selectedAddress.latitude},${selectedAddress.longitude}`
    );
    setUserLocation(`${selectedAddress.latitude},${selectedAddress.longitude}`);
  };

  useEffect(() => {
    if (!parseCookies().userLocation)
      navigator.geolocation.getCurrentPosition(
        function (position) {
          setUserDefaultLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        function (error) {
          const defaultLocation =
            process.env.NEXT_PUBLIC_DEFAULT_LOCATION.split(",");
          setUserDefaultLocation({
            latitude: defaultLocation[0],
            longitude: defaultLocation[1],
          });
          console.log(error);
        }
      );
  }, []);

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
