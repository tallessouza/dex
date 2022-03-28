const Token = artifacts.require('./Token')

contract('Token', ([deployer, receiver]) => {
  const name = 'Token'
  const symbol = 'Symbol'
  const decimals = '18'
  const totalSupply = '1000000000000000000000000'
  let token
  let result
  beforeEach(async () => {
    token = await Token.new()
  })

  describe('deployment', () => {
    it('track name', async () => {
      result = await token.name()
      assert.equal(result, name, 'Incorrect')
    })
    it('track symbol', async () => {
      result = await token.symbol()
      assert.equal(result, symbol, 'Incorrect')
    })
    it('track decimals', async () => {
      result = await token.decimals()
      assert.equal(result, decimals, 'Incorrect')
    })
    it('track totalSupply', async () => {
      result = await token.totalSupply()
      assert.equal(result, totalSupply, 'Incorrect')
    })
    it('assigns total supply to deployer', async () => {
      result = await token.balanceOf(deployer)
      assert.equal(result, totalSupply, 'Incorrect')
    })
  })

  describe('token transfer', () => {
    it('transfer tokens balances', async () => {
      let balanceOf
      balanceOf = await token.balanceOf(deployer)
    })
  })
})
