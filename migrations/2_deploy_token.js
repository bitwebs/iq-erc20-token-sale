var BeamToken = artifacts.require('BeamToken');

module.exports = function (deployer, network, accounts) {
    console.log('---------2----------');
    deployer.deploy(BeamToken);
};

