import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"

export default function StockCard({ stockData }) {
  const formatChange = (change) => {
    const isPositive = parseFloat(change) > 0
    return (
      <div
        className={`flex items-center ${
          isPositive ? "text-green-500" : "text-red-500"
        }`}
      >
        {isPositive ? (
          <ArrowUpIcon className="w-4 h-4 mr-1" />
        ) : (
          <ArrowDownIcon className="w-4 h-4 mr-1" />
        )}
        {Math.abs(change).toFixed(2)}%
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg overflow-hidden">
      <div className="p-6">
        {stockData.length < 1 ? (
          <span>Loading</span>
        ) : (
          <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {stockData.find((item) => item.id === "name")?.text ||
                      "N/A"}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-800">
                    {stockData.find((item) => item.id === "price")?.text ||
                      "N/A"}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Daily</p>
                  {formatChange(
                    parseFloat(
                      stockData.find((item) => item.id === "day")?.text || 0
                    )
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Weekly</p>
                  {formatChange(
                    parseFloat(
                      stockData.find((item) => item.id === "week")?.text || 0
                    )
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Monthly</p>
                  {formatChange(
                    parseFloat(
                      stockData.find((item) => item.id === "month")?.text || 0
                    )
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Yearly</p>
                  {formatChange(
                    parseFloat(
                      stockData.find((item) => item.id === "year")?.text || 0
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
