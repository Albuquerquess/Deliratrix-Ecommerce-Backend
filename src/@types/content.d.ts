export interface CreateContentProps {
    type: string,
    category: string,
    title: string,
    desc: string,
    prices: object[],
    rate: object,
    finalContentUrl: string,
}

interface prices {
    price: number;
    label: string;
}

export interface SelectMultiplesIdsProps {
    contentIds: number[],
    priceIds: prices[]
}