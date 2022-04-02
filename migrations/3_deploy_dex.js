const Migrations = artifacts.require('Dex')

module.exports = deployer => {
  deployer.deploy(Migrations)
}
