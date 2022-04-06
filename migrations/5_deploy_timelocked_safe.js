var BeamToken = artifacts.require('BeamToken');
var TimelockedSafe = artifacts.require('TimelockedSafe');

module.exports = function (deployer, network, accounts) {
    var adminAddress = '';
    var withdrawAddress = '';
    var lockingPeriodInMonths = 0;
    var vestingPeriodInMonths = 6;
    var monthlyWidthrawLimitInWei = new web3.BigNumber(5000000000000000000000); // 5000 BEAM Tokens

    var beamToken;

    console.log('---------5----------');
    
    deployer.deploy(TimelockedSafe, adminAddress, withdrawAddress, lockingPeriodInMonths, 
                  vestingPeriodInMonths, monthlyWidthrawLimitInWei, '0x0');

    // BeamToken.deployed()
    //     .then(function(token) {
    //         console.log('Deploying one TimelockedSafe instance ...');
    //         beamTokenAddress = token.address;

    //         return deployer.deploy(TimelockedSafe, adminAddress, withdrawAddress, lockingPeriodInMonths, 
    //             vestingPeriodInMonths, monthlyWidthrawLimitInWei, beamTokenAddress);
    //     })
    //     .then(function() {
    //         return TimelockedSafe.deployed();
    //     })
    //     .then(function(res) {
    //         console.log('TimelockedSafe instance address xxxxxx: ' + res.address);
    //         console.log('---DEPLOY FINISHED---');
    //     });
};

