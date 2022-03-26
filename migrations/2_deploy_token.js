const Migrations = artifacts.require('Token')

module.exports = deployer => {
  deployer.deploy(Migrations)
}
