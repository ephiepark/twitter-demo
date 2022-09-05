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
  addDoc,
  collection,
  orderBy,
  query,
  getDocs,
  where,
} from "firebase/firestore";
import { UserInfo, Tweet, TweetWithId } from '../types';

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
      following: docSnap.data().following ?? [],
    };
  };

  asyncCreateTweet = async (userId: string, tweetContent: string) => {
    const impl = async (tweet: Tweet) => {
      return await addDoc(collection(this.firestore, "tweets"), tweet);
    };
    const tweetRef = await impl({
      tweetContent: tweetContent,
      createdTime: Math.floor(Date.now() / 1000),
      userId: userId,
    });
    return tweetRef.id;
  };

  asyncGetMainFeed = async (userId: string, following: Array<string>): Promise<Array<TweetWithId>> => {
    // TODO if following is >10 need to send multiple queries in parallel
    const userIdFilter = [userId, ...following];
    const q = query(collection(this.firestore, "tweets"), where("userId", "in", userIdFilter.slice(0, 10)), orderBy("createdTime", "desc"));
    const tweets: Array<TweetWithId> = [];
    const addTweet = (arr: Array<TweetWithId>, tweet: TweetWithId) => {
      arr.push(tweet);
    };
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      addTweet(tweets, {
        id: doc.id,
        userId: doc.data().userId,
        tweetContent: doc.data().tweetContent,
        createdTime: doc.data().createdTime,
      })
    });
    return tweets;
  };

  asyncGetAllTweets = async (userId: string): Promise<Array<TweetWithId>> => {
    const q = query(collection(this.firestore, "tweets"), orderBy("createdTime", "desc"));
    const tweets: Array<TweetWithId> = [];
    const addTweet = (arr: Array<TweetWithId>, tweet: TweetWithId) => {
      arr.push(tweet);
    };
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      addTweet(tweets, {
        id: doc.id,
        userId: doc.data().userId,
        tweetContent: doc.data().tweetContent,
        createdTime: doc.data().createdTime,
      })
    });
    return tweets;
  };

  asyncGetProfileFeed = async (userId: string): Promise<Array<TweetWithId>> => {
    const q = query(collection(this.firestore, "tweets"), where("userId", "==", userId), orderBy("createdTime", "desc"));
    const tweets: Array<TweetWithId> = [];
    const addTweet = (arr: Array<TweetWithId>, tweet: TweetWithId) => {
      arr.push(tweet);
    };
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      addTweet(tweets, {
        id: doc.id,
        userId: doc.data().userId,
        tweetContent: doc.data().tweetContent,
        createdTime: doc.data().createdTime,
      })
    });
    return tweets;
  };
}
