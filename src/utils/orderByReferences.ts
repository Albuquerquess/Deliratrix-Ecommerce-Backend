const orderByReferences: { [key: string]: string[] } = {
    rate: ['rate.rate', 'desc'],
    lprice: ['price.price', 'asc'],
    bprice: ['price.price', 'desc']

}

export default orderByReferences;