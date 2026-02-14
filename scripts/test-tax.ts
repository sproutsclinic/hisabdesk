import {
  calculateOldRegimeTax,
  calculateNewRegimeTax,
  calculate44ADA,
  getBestTaxOption,
} from "../lib/tax"

function test(label: string, actual: number, expected: number) {
  if (actual !== expected) {
    console.error(`❌ ${label}: got ${actual}, expected ${expected}`)
    process.exit(1)
  }

  console.log(`✅ ${label}`)
}

console.log("\nRunning HisabDesk Tax Tests...\n")

test("Old ≤ 2.5L", calculateOldRegimeTax(250000), 0)
test("Old 5L", calculateOldRegimeTax(500000), 12500)
test("Old 10L", calculateOldRegimeTax(1000000), 112500)
test("Old 15L", calculateOldRegimeTax(1500000), 262500)

test("New ≤ 3L", calculateNewRegimeTax(300000), 0)
test("New 6L", calculateNewRegimeTax(600000), 15000)
test("New 9L", calculateNewRegimeTax(900000), 45000)
test("New 15L", calculateNewRegimeTax(1500000), 150000)

test("44ADA taxable", calculate44ADA(1000000), 500000)

const best = getBestTaxOption(20000, 15000, 30000)
test("Best option", best.value, 15000)

console.log("\n🎉 ALL TAX TESTS PASSED\n")
