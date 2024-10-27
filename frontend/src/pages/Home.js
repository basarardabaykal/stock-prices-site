import React, { useState, useEffect } from "react"
import axios from "axios"
import StockCard from "../components/stock-card"
import { Search } from "lucide-react"
import { auth } from "../firebase"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { db } from "../firebase"
import { collection, addDoc, getDocs, query, where } from "firebase/firestore"

function Home() {
  const [searchStockName, setSearchStockName] = useState("")
  const [stockData, setStockData] = useState([])
  const [stocks, setStocks] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(!!user)
        getStocks(user.email) // Call getStocks with the logged-in user's email
      }
    })

    return () => unsubscribe()
  }, [])

  const getStocks = async (userEmail) => {
    const querySnap = await getDocs(
      query(collection(db, "user-data"), where("user", "==", userEmail))
    )
    if (querySnap.empty) {
      console.log("No matching documents found.")
    } else {
      querySnap.forEach((doc) => {
        console.log("Document data:", doc.data())
      })
    }

    querySnap.forEach((doc) => {
      const stockDataArray = doc.data().stocks

      setStocks((prevStocks) => {
        const isDuplicate = prevStocks.some(
          (existingStock) =>
            JSON.stringify(existingStock) === JSON.stringify(stockDataArray)
        )

        if (!isDuplicate) {
          return [...prevStocks, stockDataArray]
        }

        return prevStocks
      })
    })
  }

  const logout = () => {
    auth.signOut()
    setIsLoggedIn(false)
  }

  const searchStock = async (e) => {
    e.preventDefault()
    const searchRes = await axios.post("http://localhost:5000/api/search", {
      text: searchStockName,
    })
    setStockData(searchRes.data)

    setStocks((prevStocks) => [...prevStocks, searchRes.data])

    if (auth.currentUser) {
      const docRef = await addDoc(collection(db, "user-data"), {
        user: auth.currentUser.email, // Use the logged-in user's email when adding a new document
        stocks: searchRes.data,
      })
    }
  }

  return (
    <div className="h-screen flex flex-col justify-between">
      <form className="mt-4" action="">
        <div className="w-full max-w-lg mx-auto">
          <form className="flex items-center space-x-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              <input
                value={searchStockName}
                onChange={(e) => {
                  setSearchStockName(e.target.value)
                }}
                type="text"
                placeholder="Search..."
                className="text-lg h-12 w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <button
              onClick={searchStock}
              type="submit"
              className="px-4 py-2 bg-black text-white text-lg rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              Search
            </button>
          </form>
        </div>
      </form>
      <section className="text-4xl text-black flex flex-col items-center my-4">
        {stocks.map(
          (stock, index) =>
            stock.length > 0 && (
              <StockCard key={index} stockData={stock}></StockCard>
            )
        )}
      </section>
      {!isLoggedIn ? (
        <section className="mx-auto text-center pb-4">
          <a className="text-blue-700" href="/signup">
            Sign up
          </a>{" "}
          to save and track your favourite stock prices.
        </section>
      ) : (
        <button
          className="w-24 self-center mb-4 px-4 py-2 bg-black text-white text-lg rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          onClick={() => {
            logout()
          }}
        >
          Log off
        </button>
      )}
    </div>
  )
}

export default Home
