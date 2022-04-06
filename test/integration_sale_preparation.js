var BeamToken = artifacts.require('BeamToken');
var BitWebTokenSale = artifacts.require('BitWebTokenSale');
contract('BeamToken', function(accounts) {
    var root_addr     = accounts[0];
    var admin_addr    = accounts[1];
    var whitelist_controller    = accounts[2];
    var exchange_rate_controller = accounts[3];
    var bitweblab_reserve_addr = accounts[4];
    var fund_deposit_addr = accounts[5];
    var presale_addr = accounts[6];
    var sliver_integration_addr = accounts[7];
    var streamer_addr = accounts[8];
    var public_sale_addr = accounts[9];

    var beam_token;
    var bitweb_token_sale;
    var exchange_rate = 3000;
    var sell_start_block = web3.eth.blockNumber + 120;
    var sell_end_block = web3.eth.blockNumber + 220;
    var unlock_time = 70000;
    var presale_amount = new web3.BigNumber(20000000);
    var precirculation_amount = new web3.BigNumber(3000);
    var donation_amount = new web3.BigNumber(100);
    var cashout_amount = new web3.BigNumber(50);

    console.log("Imported node Accounts: \n", accounts);

    it ("Integration test: deploy", function() {
        console.log('----------------');
        return BeamToken.deployed()
            .then(function(tt) {
                beam_token = tt;
                console.log('BeamToken Address: ' + beam_token.address);
                return BitWebTokenSale.deployed();
            })
            .then(function(tts) {
                bitweb_token_sale = tts;
                console.log('BitWebTokenSale Address: ' + bitweb_token_sale.address);
            })
    });

    it ("Integration test: set exchange rate", function() {
        console.log('----------------');
        return bitweb_token_sale.setExchangeRate(exchange_rate, {from: exchange_rate_controller, gas: 4700000})
            .then(function() {
                return bitweb_token_sale.exchangeRate.call()
            })
            .then(function(rate) {
                console.log('Exchange rate set: ' + rate);
            })
    });

    it ("Integration test: set start and end time of sale", function() {
        console.log('----------------');
        return bitweb_token_sale.setStartTimeOfSale(sell_start_block, {from: admin_addr, gas:4700000})
            .then(function() {
                return bitweb_token_sale.setEndTimeOfSale(sell_end_block, {from: admin_addr, gas:4700000})
            })
            .then(function() {
                return bitweb_token_sale.initialBlock.call()
            })
            .then(function(res) {
                console.log('Sale starts at: ' + res);
                return bitweb_token_sale.finalBlock.call()
            })
            .then(function(res) {
                console.log('Sale ends at: ' + res);
            })
    });

    it ("Integration test: set unlock time", function() {
        console.log('----------------');
        return bitweb_token_sale.changeUnlockTime(unlock_time, {from: admin_addr, gas:4700000})
            .then(function() {
                return beam_token.getUnlockTime();
            })
            .then(function(res) {
                console.log('Unlock time: ' + res);
            })
    });

    it ("Integration test: presale", function() {
        console.log('----------------');
        return bitweb_token_sale.allocatePresaleTokens(presale_addr, presale_amount, {from: admin_addr, gas:4700000})
            .then(function() {
                return beam_token.balanceOf(presale_addr);
            })
            .then(function(res) {
                console.log('Balance of presale account ' + presale_addr + ' is ' + res.toString(10))
                return beam_token.balanceOf(bitweblab_reserve_addr);
            })
            .then(function(res) {
                console.log('Balance of bitwebLab reserve account ' + bitweblab_reserve_addr + ' is ' + res.toString(10))
            })
    });

    it ("Integration test: allow precirculation on bitweblab_reserve_addr, sliver_integration_addr and streamer_addr", function() {
        console.log('----------------');
        console.log('allowing precirculation for bitweblab_reserve_addr: ' + bitweblab_reserve_addr);
        return bitweb_token_sale.allowPrecirculation(bitweblab_reserve_addr, {from: admin_addr, gas:4700000})
            .then(function() {
                console.log('allowing precirculation for sliver_integration_addr: ' + sliver_integration_addr)
                return bitweb_token_sale.allowPrecirculation(sliver_integration_addr, {from: admin_addr, gas:4700000})
            })
            .then(function() {
                console.log('allowing precirculation for streamer_addr: ' + streamer_addr)
                return bitweb_token_sale.allowPrecirculation(streamer_addr, {from: admin_addr, gas: 4700000})
            })
            .then(function() {
                console.log('done.')          
            })
    });

    it ("Integration test: transfer from bitweblab_reserve_addr to sliver_integration_addr", function() {
        console.log('----------------');
        console.log('Before transfer:');
        return beam_token.balanceOf(bitweblab_reserve_addr)
            .then(function(res) {
                console.log('Beam reserve balance: ' + res.toString(10));
                return beam_token.balanceOf(sliver_integration_addr);
            })
            .then(function(res) {
                console.log('Sliver integration account balance: ' + res.toString(10))
                console.log('Transfering ' + precirculation_amount + ' from bitweblab_reserve_addr ' + bitweblab_reserve_addr + ' to sliver_integration_addr ' + sliver_integration_addr);
                return beam_token.transfer(sliver_integration_addr, precirculation_amount, {from: bitweblab_reserve_addr, gas: 4700000});
            })
            .then(function() {
                console.log('After transfer:');
                return beam_token.balanceOf(bitweblab_reserve_addr);
            })
            .then(function(res) {
                console.log('Beam reserve balance: ' + res.toString(10));
                return beam_token.balanceOf(sliver_integration_addr);
            })
            .then(function(res) {
                console.log('Sliver integration account balance: ' + res.toString(10));
            })
    });

    it ("Integration test: remove bitweblab_reserve_addr from precirculation", function() {
        console.log('----------------');
        return bitweb_token_sale.disallowPrecirculation(bitweblab_reserve_addr, {from: admin_addr, gas: 4700000})
            .then(function() {
                return bitweb_token_sale.isPrecirculationAllowed(bitweblab_reserve_addr, {from: admin_addr, gas: 4700000});
            })
            .then(function(res) {
                console.log('is precirculation allowed for bitweblab_reserve_addr ' + bitweblab_reserve_addr + ' ? ' + res);
            })
    });

    it ("Integration test: testing sliver_integration_addr transfer to streamer_addr", function() {
        console.log('----------------');
        console.log('Before transfer:');
        return beam_token.balanceOf(sliver_integration_addr)
            .then(function(res) {
                console.log('Beam integration account balance: ' + res.toString(10));
                return beam_token.balanceOf(streamer_addr);
            })
            .then(function(res) {
                console.log('Streamer account balance: ' + res.toString(10));
                console.log('Donating ' + donation_amount.toString(10) + ' from sliver_integration_addr ' + sliver_integration_addr + ' to streamer_addr ' + streamer_addr);
                return beam_token.transfer(streamer_addr, donation_amount, {from: sliver_integration_addr, gas: 4700000});
            })
            .then(function(res) {
                console.log('After transfer:');
                return beam_token.balanceOf(sliver_integration_addr);
            })
            .then(function(res) {
                console.log('Beam integration account balance: ' + res.toString(10));
                return beam_token.balanceOf(streamer_addr);
            })
            .then(function(res) {
                console.log('Streamer account balance: ' + res.toString(10));
            })
    });

    it ("Integration test: testing streamer_addr transfer to sliver_integration_addr", function() {
        console.log('----------------');
        console.log('Before transfer:');
        return beam_token.balanceOf(sliver_integration_addr)
            .then(function(res) {
                console.log('Beam integration account balance: ' + res);
                return beam_token.balanceOf(streamer_addr);
            })
            .then(function(res) {
                console.log('Streamer account balance: ' + res.toString(10));
                console.log('Cashing out ' + cashout_amount + ' from streamer_addr ' + streamer_addr + ' to sliver_integration_addr ' + sliver_integration_addr);
                return beam_token.transfer(sliver_integration_addr, cashout_amount, {from: streamer_addr, gas: 4700000});
            })
            .then(function() {
                console.log('After transfer:');
                return beam_token.balanceOf(sliver_integration_addr);
            })
            .then(function(res) {
                console.log('Beam integration account balance: ' + res.toString(10));
                return beam_token.balanceOf(streamer_addr);
            })
            .then(function(res) {
                console.log('Streamer account balance: ' + res.toString(10));
            })
    });

    it ("Integration test: add whitelist public_sale_addr and presale_addr", function() {
        console.log('----------------');
        return bitweb_token_sale.addAccountsToWhitelist([public_sale_addr, presale_addr], {from: whitelist_controller, gas:4700000})
            .then(function() {
                return bitweb_token_sale.isWhitelisted(public_sale_addr);
            })
            .then(function(res) {
                console.log('Is public_sale_addr ' + public_sale_addr + ' whitelisted? ' + res);
                return bitweb_token_sale.isWhitelisted(presale_addr);
            })
            .then(function(res) {
                console.log('Is presale_addr ' + presale_addr + ' whitelisted?' + res);
            })
    });

    it ("Creating snapshot for blockchain after preparation", function() {
        console.log('----------------');
        snapshot_deployed_blockchain = {
            jsonrpc: "2.0",
            method: "evm_snapshot",
        }
        snapshot_number = web3.currentProvider.send(snapshot_deployed_blockchain);
        console.log('Preparation finished. Blockchain snapshot created with ' + snapshot_number.result);
    });
});



