const Block = require('./block');

describe('Block',()=>{
    let data, lastBlock, block;
    //antes de correr cualquiera de los unit test corre esta funcion
    beforeEach(()=>{
        data = 'bar'
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock,data)
    })
    //unit tests
    it('sets the `data` to match the input',()=>{
        expect(block.data).toEqual(data);
    })
    it('sets the `lastHash` to match the hash of the last block',()=>{
        expect(block.lastHash).toEqual(lastBlock.hash);
    })
    it('genera un hash que se ajusta a la dificultad',()=>{
        expect(block.hash.substring(0,block.difficulty)).toEqual('0'.repeat(block.difficulty));
    })
    it('disminuye la dificultad para los bloques lentos minados',()=>{
        expect(Block.adjustDifficulty(block, block.timestamp+360000)).toEqual(block.difficulty-1)
    })
    it('incrementa la dificultad para los bloques rapidos minados',()=>{
        expect(Block.adjustDifficulty(block, block.timestamp+1)).toEqual(block.difficulty+1)
    })
})