// Import jquery
import jQuery from 'jquery';
window.$ = window.jQuery = jQuery;

// Import Sweetalert

// Import libraries we need.
import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract';

import user_artifacts from '../../build/contracts/User.json'
var User = contract(user_artifacts);

var accounts;
var account;

window.App = {

  getUser: function() {

    var eth = $('#sign-in-eth-address').val();

    console.log('signing in user having wallet address', eth);

    User.deployed().then(function(contractInstance) {

      contractInstance.getUser(eth).then(function(obj) {
        if (obj) {
          sessionStorage.setItem("user", eth);
          if (obj[0] == "true") {
            window.location.href = "organisation.html";
          }
          else {
            window.location.href = "accountant.html";
          }
        }

      }).catch(function(e) {
        // There was an error! Handle it.
        console.log('error signing user:', eth, ':', e);
        swal("Something went wrong!", "Error in signing in", "error");

      });
    
    }); 

  },  


  start: function() {
    var self = this;

    // set the provider for the User abstraction
    User.setProvider(web3.currentProvider);

  },

  createUser: function() {
    var eth = $('#sign-up-eth-address').val();
    var category = document.getElementById('sign-up-user-type').checked + "";

    console.log('creating user on eth for', eth, category);

    User.deployed().then(function(contractInstance) {

      contractInstance.insertUser(eth, category, {gas: 200000, from: web3.eth.accounts[0]}).then(function(index) {
        console.log(index);
        swal("Success", "User created successfully", "success");
        window.location.reload();
        
      }).catch(function(e) {
        // There was an error! Handle it.
        console.log('error creating user:', eth, ':', e);
        swal("Something went wrong!", "Error in creating user", "error");

      });
    
    });
  }

};

// ===============================Window Loading =============================

window.addEventListener('load', function() {
  // if (sessionStorage.getItem("user")) {

  // }
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source.");
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Please use MetaMask or Mist browser.");
  }

App.start();
});


