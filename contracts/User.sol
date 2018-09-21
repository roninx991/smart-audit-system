// Contract to store user
pragma solidity^0.4.19;

contract User {

  // User storage struct
  struct UserStruct {
	string category;
    uint index;
  }
  
  // User structures are mapped to addresses
  mapping(address => UserStruct) private userStructs;
  address[] private userIndex;

  event LogNewUser   (address indexed userAddress, uint index, string category);
  event LogUpdateUser(address indexed userAddress, uint index, string category);
  
  // Function to check if user is already present
  function isUser(address userAddress)
    public view
    returns(bool isIndeed) 
  {
    if(userIndex.length == 0) return false;
    return (userIndex[userStructs[userAddress].index] == userAddress);
  }

  // Function to insert user
  function insertUser(address userAddress, string category) 
    public
    returns(uint index)
  {
    if(isUser(userAddress)) throw; 
	userStructs[userAddress].category = category;
    userStructs[userAddress].index     = userIndex.push(userAddress)-1;
    LogNewUser(userAddress, userStructs[userAddress].index, userStructs[userAddress].category);
    return userIndex.length-1;
  }
  
  // Function to return user address
  function getUser(address userAddress)
    public view
    returns(string category, uint index)
  {
    if(!isUser(userAddress)) throw; 
    return(
      userStructs[userAddress].category, 
      userStructs[userAddress].index);
  } 

  // Function to get category of user
  function getUserCategory(address userAddress)
  	public view returns(string category)
  {
    if(!isUser(userAddress)) throw; 
    return userStructs[userAddress].category;
  }

  // Function to update user category (may not be relevant)
  function updateUsercategory(address userAddress, string category) 
    public
    returns(bool success) 
  {
    if(!isUser(userAddress)) throw; 
    userStructs[userAddress].category = category;
    LogUpdateUser(userAddress, userStructs[userAddress].index, userStructs[userAddress].category);
    return true;
  }
  
  // Function to get number of users
  function getUserCount() 
    public view
    returns(uint count)
  {
    return userIndex.length;
  }

  // Function to get user at given index
  function getUserAtIndex(uint index)
    public view 
    returns(address userAddress)
  {
    return userIndex[index];
  }

}
