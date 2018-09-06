// Contract to store document. Document hash value, document owner and document status are stored. Also the reviewer who upvoted or downvoted are stored.
pragma solidity ^0.4.24 ;

contract SimpleStorage {
	
	// Document storage struct
	struct DocStruct {
    address index;
  	uint status;
    address[] upvote;
    address[] downvote;
  }
  
  // Document structs are mapped to hash values
  mapping(string => DocStruct) private docStructs;
  string[] public hashes;

  event AddNewFile(string hash, address userAddress, uint status);
 
  // Function to insert a document in mapping
  function insertDoc(address userAddress, string hash) public 
  {
    require(!isDocPresent(hash));
    AddNewFile(hash, userAddress, 1);
    hashes.push(hash);
    docStructs[hash].index = userAddress;
    docStructs[hash].status = 1;
  }

  // Function to check if a document is already present
  function isDocPresent(string hashval) view returns(bool)
  {
    return (docStructs[hashval].index != 0x0);
  }

  // Function to check if given address is owner of document
  function isOwner(address userAddress, string h) constant returns(bool b)
  {
    if (docStructs[h].index == userAddress) 
    {
      return true;
    }
    return false;
  }  

  // Function to return hash value of document
  function displayHash(uint num) constant returns(string hash)
  {
    return hashes[num];
  }

  // Function to return status of document
  function displayDocStatus(string hash) constant returns(uint status)
  {
    return docStructs[hash].status;
  }

  // Function to return count of uploaded documents
  function displayDocCount() constant returns(uint count)
  {
    return hashes.length;
  }
	
  // Function to upvote a document by reviewer
  function upVote(string dochash, address CAaddr)
  public
  {
    require(!isAudited(dochash) && !isVoted(dochash, CAaddr));
    docStructs[dochash].upvote.push(CAaddr);
    
    if(isAudited(dochash))
      {
        if(getUpvoteCount(dochash) > getDownvoteCount(dochash))
          {
            docStructs[dochash].status = 0;
          }
        else
          {
            docStructs[dochash].status = 2;
          }
      }
  }
  
  // Function to downvote a document by reviewer
  function downVote(string dochash, address CAaddr)
  public
  {
    require(!isAudited(dochash) && !isVoted(dochash, CAaddr));
    docStructs[dochash].downvote.push(CAaddr);
    if(isAudited(dochash))
      {
        if(getUpvoteCount(dochash) > getDownvoteCount(dochash))
          {
            docStructs[dochash].status = 0;
          }
        else
          {
            docStructs[dochash].status = 2;
          }
      }
  }
  
  // Function to check if a reviewer has already voted for a document
  function isVoted(string dochash, address addr)
  view returns(bool)
  {
    for(uint i=0;i<docStructs[dochash].upvote.length;i++)
      {
        if(docStructs[dochash].upvote[i] == addr)
          {
            return true;
          }
      }
    for(i=0;i<docStructs[dochash].downvote.length;i++)
      {
        if(docStructs[dochash].downvote[i] == addr)
          {
            return true;
          }
      }
    return false;
  }
  
  // Function to check if a document has been approved/disapproved
  function isAudited(string dochash)
  view returns (bool)
  {
    return ((docStructs[dochash].upvote.length + docStructs[dochash].downvote.length) >= 5);
  }
  
  // Function to get number of upvotes
  function getUpvoteCount(string dochash)
  view returns(uint)
  {
    return (docStructs[dochash].upvote.length);
  }
  
  // Function to get number of downvotes
  function getDownvoteCount(string dochash)
  view returns(uint)
  {
    return (docStructs[dochash].downvote.length);
  }
  
  // Function to compare string values
  function compareStrings (string a, string b) 
  view returns (bool)
  {
       return keccak256(a) == keccak256(b);
   }

}

