// lib/api.ts




export async function verifyQuantity(itemId: number, quantity: number): Promise<number> {
    // console.log(itemId + " and " + quantity)
  try {
    const res = await fetch('/api/checkStockQuantity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ itemId, quantity }),
    });
    // console.log(res.body)
    return res.status;
  } catch (err) {
    console.error('API error:', err);
    return 500;
  }
}