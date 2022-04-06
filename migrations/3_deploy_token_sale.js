var BitWebTokenSale = artifacts.require('BitWebTokenSale');

module.exports = function (deployer, network, accounts) {
    var rootAddr     = '';
    var deployerAddr = '';
    var whiteListControllerAddr    = '';
    var exchangeRateControllerAddr = '';
    var bitwebLabReserveAddr = '';
    var fundDepositAddr     = '';

    var initialBlock = 223583611111;
    var finalBlock   = 223583699999;
    var exchangeRate = 30000;

    console.log('---------3----------');
    deployer.deploy(BitWebTokenSale, rootAddr, deployerAddr, 
        whiteListControllerAddr, exchangeRateControllerAddr, bitwebLabReserveAddr, fundDepositAddr,
        initialBlock, finalBlock, exchangeRate);
};

