function convertToSubcurrency(amount: number, factor=100) {
    // console.log("currency converted: " +  Math.round(amount * factor))
    return Math.round(amount * factor)
}

export default convertToSubcurrency;