const Transaction = require('./transaction');
const Wallet = require('./index');

describe('Transaction',()=>{
    let transaction, wallet, recipient, amount;

    beforeEach(()=>{
        wallet = new Wallet();
        amount = 50;
        recipient = 'r3c1p13nt';
        transaction = Transaction.newTransaction(wallet, recipient, amount);
    });
    it('devuelve el monto restado del balance del wallet', ()=>{
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
            .toEqual(wallet.balance - amount);
    })
    it('devuelve el monto agregado al recipiente',()=> {
        expect(transaction.outputs.find(output => output.address === recipient).amount)
            .toEqual(amount);
    })
    it('ingresa el balance del wallet',()=>{
        expect(transaction.input.amount).toEqual(wallet.balance)
    })
    it('valida si una transaccion es valid',()=>{
        expect(Transaction.verifyTransaction(transaction)).toBe(true)
    })
    it('invalida una transaccion corrupta',()=>{
        transaction.outputs[0].amount = 50000
        expect(Transaction.verifyTransaction(transaction)).toBe(false)
    })

    describe('el monto excede el balance',()=>{
        beforeEach(()=>{
            amount = 500000;
            transaction = Transaction.newTransaction(wallet,recipient,amount);
        })
        it('no crea la transaccion porque excede el balance',()=>{
            expect(transaction).toEqual(undefined);
        })
    })
})