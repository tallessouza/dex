const { ether, EVM_REVERT, ETHER_ADDRESS } = require('./helpers')
const { catchRevert, catchInvalidAddress } = require('./exceptions')

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
    token.transfer(user1, tokens(100), { from: deployer })
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

  describe('deposit ether', () => {
    beforeEach(async () => {
      amount = ether(1)
      result = await dex.depositEther({ from: user1, value: amount })
      console.log(result.value)
    })

    it('tracks eth deposit', async () => {
      balance = await dex.tokens(ETHER_ADDRESS, user1)
      assert.equal(balance.toString(), amount.toString())
    })
  })

  describe('deposit tokens', () => {
    describe('success', () => {
      beforeEach(async () => {
        amount = tokens(10)
        await token.approve(dex.address, amount, { from: user1 })
        result = await dex.depositToken(token.address, amount, {
          from: user1
        })
      })
      it('tracks token deposit', async () => {
        balance = await token.balanceOf(dex.address)
        assert.equal(balance.toString(), amount.toString(), 'Error')

        balance = await dex.tokens(token.address, user1)
        assert.equal(balance.toString(), amount.toString(), 'Error')
      })

      it('emits deposit event', async () => {
        const log = result.logs[0]
        assert.equal(log.event, 'Deposit', 'Incorrect')
        const event = log.args
        assert.equal(event.token, token.address, 'Incorrect')
        assert.equal(event.user, user1, 'Incorrect')
        assert.equal(event.amount.toString(), tokens(10), 'Incorrect')
        assert.equal(event.balance.toString(), tokens(10), 'Incorrect')
      })
    })
    describe('failure', () => {
      it('rejects eth deposit', async () => {
        await token.approve(dex.address, tokens(10), { from: user1 })
        await catchInvalidAddress(
          dex.depositToken(ETHER_ADDRESS, tokens(10), { from: user1 })
        )
      })

      it('fails when no tokens approved', async () => {
        await catchRevert(
          dex.depositToken(token.address, tokens(10), { from: user1 })
        )
      })
    })
  })
})
