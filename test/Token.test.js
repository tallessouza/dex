/* eslint-disable jest/valid-describe-callback */
const Token = artifacts.require('./Token')
const { catchRevert, catchInvalidAddress } = require('./exceptions')

const tokens = n => {
  return new web3.utils.BN(web3.utils.toWei(n.toString(), 'ether'))
}

contract('Token', ([deployer, receiver]) => {
  const name = 'Token'
  const symbol = 'Symbol'
  const decimals = '18'
  const totalSupply = tokens(1000000).toString()
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
    let amount

    describe('success', async () => {
      beforeEach(async () => {
        amount = tokens(100)
        result = await token.transfer(receiver, amount, { from: deployer })
      })

      it('transfers token balances', async () => {
        let balanceOf
        balanceOf = await token.balanceOf(deployer)
        assert.equal(
          balanceOf.toString(),
          tokens(999900).toString(),
          'Incorrect'
        )
        balanceOf = await token.balanceOf(receiver)
        assert.equal(balanceOf.toString(), tokens(100).toString(), 'Incorrect')
      })

      it('emits a transfer event', async () => {
        const log = result.logs[0]
        assert.equal(log.event, 'Transfer', 'Incorrect')

        const event = log.args
        assert.equal(event.from.toString(), deployer, 'Incorrect')
        assert.equal(event.to, receiver, 'Incorrect')
        assert.equal(event.value.toString(), amount.toString(), 'Incorrect')
      })
    })

    describe('failure', async () => {
      it('rejects insufficient balances', async () => {
        let invalidAmount
        invalidAmount = tokens(100000000) // 100 million - greater than total supply
        await catchRevert(
          token.transfer(receiver, invalidAmount, { from: deployer })
        )

        // Attempt transfer tokens, when you have none
        invalidAmount = tokens(10) // recipient has no tokens
        await catchRevert(
          token.transfer(deployer, invalidAmount, { from: receiver })
        )
      })

      it('rejects invalid recipients', async () => {
        await catchInvalidAddress(
          token.transfer('0x0', amount, { from: deployer })
        )
      })
    })
  })
})
