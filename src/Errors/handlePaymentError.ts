class PaymentCustomError extends Error{
    errors: string[]
    constructor(cobError) {
        super()
        this.errors = cobError.error
        this.name = 'PaymentCustomError'
    }
}

export default PaymentCustomError