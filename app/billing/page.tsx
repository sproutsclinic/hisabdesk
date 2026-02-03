"use client"

export default function Billing() {

  const pay = () => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      amount: 199900, // ₹1999 in paise
      currency: "INR",
      name: "HisabDesk",
      description: "Pro Subscription",
      handler: function () {
        alert("Payment successful!")
      }
    }

    const rzp = new (window as any).Razorpay(options)
    rzp.open()
  }

  return (
    <div className="p-10 space-y-6">

      <h1 className="text-2xl font-bold">Subscription Plans</h1>

      <div className="grid grid-cols-2 gap-6">

        <div className="border p-6 rounded">
          <h2 className="text-xl font-bold">Basic</h2>
          <p>₹1999 / year</p>
          <p>Tax + AI + PDF</p>

          <button
            onClick={pay}
            className="bg-blue-600 text-white px-4 py-2 mt-4 cursor-pointer"
          >
            Buy Now
          </button>
        </div>

        <div className="border p-6 rounded">
          <h2 className="text-xl font-bold">Pro</h2>
          <p>₹2999 / year</p>
          <p>CA review included</p>

          <button
            onClick={pay}
            className="bg-purple-600 text-white px-4 py-2 mt-4 cursor-pointer"
          >
            Buy Now
          </button>
        </div>

      </div>
    </div>
  )
}
