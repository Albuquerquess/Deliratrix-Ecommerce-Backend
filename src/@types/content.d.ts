export interface CreateContentProps {
    type: string,
    category: string,
    title: string,
    desc: string,
    prices: object[],
    rate: object,
    finalContentUrl: string,
}

export interface SelectMultiplesIdsProps {
    contentIds: number[],
    priceIds: number[]
}