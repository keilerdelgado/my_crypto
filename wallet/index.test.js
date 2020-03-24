const Wallet = require('./index')
const TransactionPool = require('./transaction-pool.js')

describe('Wallet', () => {
    let wallet, tp

    beforeEach(() => {
        wallet = new Wallet()
        tp = new TransactionPool()
    })

    describe('creando una transaccion', () => {
        let transaction, sendAmount, recipient
        beforeEach(() => {
            sendAmount = 50
            recipient = 'r4nd-adr355'
            transaction = wallet.createTransaction(recipient, sendAmount, tp)
        })
        describe('y haciendo la misma transaccion, repitiendo', () => {
            beforeEach(()=>{
                wallet.createTransaction(recipient, sendAmount, tp)
            })
            it('duplica el sendAmount restado del balance de la wallet', () => {
                expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
                    .toEqual(wallet.balance - sendAmount * 2)
            })
            it('clona el sendAmount que se envio al receptor', () => {
                expect(transaction.outputs.filter(output => output.address === recipient)
                    .map(output => output.amount))
                    .toEqual([sendAmount, sendAmount])
            })
        })
    })
})