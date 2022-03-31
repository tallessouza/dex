const Token = artifacts.require('./Token')
const Dex = artifacts.require('./Dex')

const tokens = n => {
  return new web3.utils.BN(web3.utils.toWei(n.toString(), 'ether'))
}

contract('Dex', ([deployer, feeAccount, user1]) => {
  let result
  let dex
  let token
  let balance
  let amount
  const feePercent = 10

  beforeEach(async () => {
    token = await Token.new()
    dex = await Dex.new(feeAccount, feePercent)
  })

  describe('deployment', () => {
    it('tracks fee account', async () => {
      result = await dex.feeAccount()
      assert.equal(result, feeAccount, 'Incorrect')
    })
    it('tracks fee percent', async () => {
      result = await dex.feePercent()
      assert.equal(result.toString(), feePercent.toString(), 'Incorrect')
    })
  })

  describe('deposit tokens', () => {
    beforeEach(async () => {
      amount = tokens(10)
      await dex.approve(dex.address, amount, { from: user1 })
      result = await dex.depositToken(token.address, tokens(10), {
        from: user1
      })
    })
    describe('success', () => {
      it('tracks token deposit', async () => {
        balance = await token.balanceOf(dex.address)
        assert.equal()
      })
    })
    describe('failure', () => {})
  })
})
