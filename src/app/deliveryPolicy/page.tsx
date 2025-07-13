import React from 'react'

const page = () => {
  return (
    <div>
          <div className="max-w-4xl mx-auto px-6 py-10 bg-white text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">📦 Delivery Policy</h1>

      <p className="mb-6">
        We’ve partnered with <strong>Evri</strong> to bring you a fast, secure, and premium delivery experience. Here's everything you need to know about how your order will be delivered.
      </p>



      {/* Tracking Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">📍 Tracking Your Order</h2>
        <p>
          Once your order ships, you’ll receive a tracking link via email. You can monitor your parcel using the Evri website or mobile app in real time.
        </p>
      </section>

      {/* Delivery Issues */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">🛑 Delivery Issues</h2>
        <p className="mb-2">
          If your parcel is damaged, lost, or delayed, please contact us within <strong>24 hours</strong> of delivery.
        </p>
        <p>
          Include your order number, a description of the issue, and any photos or tracking details to help us resolve it quickly.
        </p>
      </section>

      {/* Missed Deliveries */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">🔄 Missed or Redeliveries</h2>
        <p className="mb-2">
          If delivery fails, Evri may attempt a redelivery or leave instructions for rescheduling.
        </p>
        <p>
          You can also update delivery preferences using the Evri tracking portal.
        </p>
      </section>

      {/* Contact Info */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">💬 Need Help?</h2>
        <p>
          If you have any questions about your delivery, contact us at{" "}
          <a href="mailto:your@email.com" className="text-blue-600 underline">
            your@email.com
          </a>
          . We’re happy to help with tracking updates, delivery issues, or any other concerns.
        </p>
      </section>
    </div>
    </div>
  )
}

export default page
