// Import jquery
import jQuery from 'jquery';
window.$ = window.jQuery = jQuery;

// Import Sweetalert
import swal from 'sweetalert';

// Import bootstrap
import 'bootstrap';

// Import the page's CSS. Webpack will know what to do with it.
import "../styles/reviewer.css";

// Import libraries we need.
import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract';

import simplestorage_artifacts from '../../build/contracts/SimpleStorage.json'
var User = contract(simplestorage_artifacts);
var ipfsHash;
var arrayBuffer, buffer;
var load = 0;
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('localhost','5001',{protocol: 'http'});

window.App = {
	
	// App Initialiser
	start: function() {
		var self = this;
		var c;
		if(load > 0)
		{
			User.setProvider(web3.currentProvider);			// In our case we will be using metamask as our web3 provider
			User.deployed().then(function(contractInstance) {
				contractInstance.displayDocCount().then(function(count) {		// returns number of documents uploaded
					c = parseInt(count);
					document.getElementById("uploads").style.display = "none";
					document.getElementById("no-uploads").style.display = "block";
					document.getElementById("no-uploads").innerHTML = "No files uploaded";								
					if (c > 0) {
						document.getElementById("uploads").style.display="block";
						for (var i = 0; i < c; i++) {
							contractInstance.displayHash(i).then(function(h) {		// returns hash of document/paper
								var hash = h;
								contractInstance.displayDocStatus(hash).then(function(stat) {		// returns status of the document/paper
									stat = parseInt(stat);
									document.getElementById("uploads").style.display = "block";
									document.getElementById("no-uploads").style.display = "none";
									if (stat == 1) {
										var str1 = "App.upVote('" + hash + "');";
										var str2 = "App.downVote('" + hash + "');";
										document.getElementById("uploads").innerHTML += "<div class='files'><span class='hash'><a href='http://127.0.0.1:8080/ipfs/" + hash + "' target=_blank>" + hash + "</a></span><span class='file-status'><button class='btn-upvote' onclick=" + str1 + ">Upvote</button><button class='btn-downvote' onclick=" + str2 + ">Downvote</button></span></div>";
									}
								}).catch(function(e) {
									// Error handling if document status couldn't be fetched
									console.log("Error: ", e);
									swal("Error", "Couldn't fetch document status", "error");	
								});
							}).catch(function(e) {
								// Error handling if document hash value cannot be fetched
								console.log("Error: ", e);
								swal("Error", "Couldn't display document hash value", "error");
							});
						}
					}
				}).catch(function(e) {
					// Error handling if document couldn't be uploaded
					console.log("Error: ", e);
					swal("Error", "Couldn't display uploaded documents", "error");
				});
			});
		}
		else
		{
			load++;
		}
	},

	// Function for upvoting a paper
	upVote: function(hash){
		User.deployed().then(function(contractInstance) {
			contractInstance.upVote(hash, web3.eth.accounts[0], {gas: 200000, from: web3.eth.accounts[0]}).then(function() {
				contractInstance.getUpvoteCount(hash).then(function(index){
				}).catch(function(e) {
			        // There was an error! Handle it.
			        swal("Error", "An error occurred while fetching vote count!", "error");
			        console.log('Error in Upvoting!', eth, ':', e);
		      	});				
		    }).catch(function(e) {
			    // There was an error! Handle it.
			    swal("Something went wrong", "You can't review a document if you've already done that. Also if the document has been already approved/disapproved you cannot vote on its validity.", "error");
			    console.log('Error in Upvoting!', eth, ':', e);
			});
    
    });
		
	},
	
	// Function for downvoting a paper
	downVote: function(hash){
		User.deployed().then(function(contractInstance) {
			contractInstance.downVote(hash, web3.eth.accounts[0], {gas: 200000, from: web3.eth.accounts[0]}).then(function() {		
				contractInstance.getDownvoteCount(hash).then(function(index){
				}).catch(function(e) {
			        // There was an error! Handle it.
			        swal("Error", "An error occurred while fetching vote count!", "error");
			        console.log('Error in Upvoting!', eth, ':', e);
		      	});					
		    }).catch(function(e) {
		        // There was an error! Handle it.
			    swal("Something went wrong", "You can't review a document if you've already done that. Also if the document has been already approved/disapproved you cannot vote on its validity.", "error");
		        console.log('Error in Upvoting!', eth, ':', e);
	    	});
		});
	},
};

// ===============================Window Loading =============================

window.addEventListener('load', function() {
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
