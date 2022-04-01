const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'
const EVM_REVERT = 'VM Exception while processing transaction: revert'
module.exports = {
  ETHER_ADDRESS: async () => {
    return ETHER_ADDRESS
  },
  EVM_REVERT: async () => {
    return EVM_REVERT
  },
  ether: n => {
    return new web3.utils.BN(web3.utils.toWei(n.toString(), 'ether'))
  }
  // tokens: (n) => {
  //   return ether(n)
  // }

  // Same as ether
}
