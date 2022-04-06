var BeamToken = artifacts.require('BeamToken');
var BitWebTokenSale = artifacts.require('BitWebTokenSale');

module.exports = function (deployer, network, accounts) {
    var beamToken;
    var bitwebTokenSale;

    console.log('---------4----------');
    BeamToken.deployed()
        .then(function(token) {
            beamToken = token;
            return BitWebTokenSale.deployed();
        })
        .then(function (token_sale) {
            bitwebTokenSale = token_sale;
            console.log('Changing beamToken controller...');
            return beamToken.changeController(bitwebTokenSale.address);
        })
        .then(function() {
            console.log('Setting beamToken in bitwebTokenSale...');
            return bitwebTokenSale.setThetaToken(beamToken.address);
        })
        .then(function() {
            console.log('---DEPLOY FINISHED---');
        });
};

