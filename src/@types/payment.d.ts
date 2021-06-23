export interface ChargeProps {
    id: number,
    name: string,
    value: number,
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