ï»¿import { computePortfolioOverview } from "./engine"

const sample = [
{
id: "1",
asset_name: "Equity MF",
quantity: 100,
buy_price: 50,
current_price: 65,
},
{
id: "2",
asset_name: "Stocks",
quantity: 10,
buy_price: 1000,
current_price: 900,
},
]

const result = computePortfolioOverview(sample as any)

console.log(JSON.stringify(result, null, 2))
