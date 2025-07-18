import React from 'react'

const page = () => {
  return (
    <div className='w-full flex mt-16 flex-col'>
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-2xl text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">Refund & Return Policy</h1>

      <p className="mb-6">
        We strive to ensure every customer is satisfied with their purchase. Please read the following terms carefully, as they outline our policies regarding refunds, exchanges, and returns.
      </p>

      {/* Refunds & Exchanges */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Refunds & Exchanges</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Refunds and exchanges are handled on a <strong>case-by-case basis</strong>.</li>
          <li><strong>Custom orders</strong> are non-refundable once production has begun.</li>
          <li>If your item is <strong>faulty</strong> or <strong>damaged during shipping</strong>, see the relevant sections below.</li>
        </ul>
      </section>

      {/* Damaged Items */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Damaged Items (During Transit)</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>We will replace the item <strong>free of charge</strong>, including shipping.</li>
          <li>You must notify us <strong>within 24 hours</strong> of delivery.</li>
          <li><strong>Photos of the damage</strong> and packaging are required.</li>
          <li>Keep all packaging and the damaged item for inspection by the shipping carrier.</li>
          <li><strong>Do not sign for the package</strong> if it arrives visibly damaged. Once signed, we cannot process a replacement.</li>
          <li>You may be required to return the damaged item.</li>
        </ul>
      </section>

      {/* Returns */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Returns</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>If a return is authorized, the item must be shipped back within <strong>10 calendar days</strong>.</li>
          <li>Failure to return the item within this timeframe will result in your card being <strong>charged the full product price</strong>.</li>
        </ul>
      </section>

      {/* Contact */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
        <p>
          To initiate a return, report damage, or inquire about a refund/exchange, please contact us at : 
          <a href="mailto:your@email.com" className="text-blue-600 underline">
           info@reef-forge.uk
          </a>{" "}
          with your order number and clear photos (if applicable).
        </p>
      </section>
    </div>
    </div>
  )
}

export default page
