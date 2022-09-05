import { firebaseConfig } from './firebaseConfig';
import { FirebaseApp, initializeApp } from "firebase/app";
import { Analytics, getAnalytics } from "firebase/analytics";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithRedirect,
  onAuthStateChanged,
  signOut,
  Auth,
  NextOrObserver,
  User,
  Unsubscribe,
} from "firebase/auth";
import {
  Firestore,
  getFirestore,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import {
  UserInfo
} from "../redux/sessionSlice";

export default class FirebaseApi {
  app: FirebaseApp;
  analytics: Analytics;
  firestore: Firestore;
  auth: Auth;
  googleAuthProvider: GoogleAuthProvider;
  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.analytics = getAnalytics(this.app);
    this.firestore = getFirestore(this.app);
    this.auth = getAuth(this.app);
    this.googleAuthProvider = new GoogleAuthProvider();
  }

  onAuthStateChanged = (nextOrObserver: NextOrObserver<User>): Unsubscribe => {
    return onAuthStateChanged(this.auth, nextOrObserver);
  };

  signInWithGoogleRedirect = () => {
    return signInWithRedirect(this.auth, this.googleAuthProvider);
  };

  signOut = () => {
    return signOut(this.auth);
  }

  getUserRef = (userId: string) => {
    return doc(this.firestore, "users", userId);
  };

  asyncSetUserInfo = async (userId: string, userInfo: UserInfo) => {
    await setDoc(this.getUserRef(userId), userInfo);
    return await this.asyncGetUserInfo(userId);
  };

  asyncGetUserInfo = async (userId: string): Promise<UserInfo | null> => {
    const docSnap = await getDoc(this.getUserRef(userId));
    if (!docSnap.exists()) {
      return null;
    }
    return {
      username: docSnap.data().username,
    };
  }
}
