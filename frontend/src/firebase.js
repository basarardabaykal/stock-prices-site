import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDQ5FkK9sc1sIx2q7uc0Q45L9av8x9mdCU",
  authDomain: "exchange-rates-site.firebaseapp.com",
  projectId: "exchange-rates-site",
  storageBucket: "exchange-rates-site.appspot.com",
  messagingSenderId: "1077256023731",
  appId: "1:1077256023731:web:358b8e5497b686aaabcac6",
}

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }
