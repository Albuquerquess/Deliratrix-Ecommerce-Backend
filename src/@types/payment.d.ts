export interface CartProps {
    contents: contentProps[],
    prices: priceProps[]
}
interface contentProps {
    category: string;
    desc: string;
    id: number;
    rate: number;
    registered_at: string;
    title: string;
    type: string;
    url: string;
  }
  interface priceProps {
    id: number;
    price: number;
    content_id: string;
  }
export interface DebtorProps {
    name: string,
    email: string,
    phone: string,
}
export interface ResponseChargeProps {
    calendario: {
        expiracao: number
    },
    valor: {
        original: number
    },
    chave: string,
    solicitacaoPagador: string
}

export interface PaymentCustomErrorProps extends Error{
    super()
    errors: string[]
}