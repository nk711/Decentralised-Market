pragma solidity ^0.5.0;

contract Decentragram {
  string public name = "Decentragram";

  // Store posts
  uint public postCount = 0;
  mapping(uint => Post) public posts;

  struct Post {
    uint id;
    string hash;
    string title;
    string description;
    uint price;
    uint quantity;
    bool stock;
    address payable author;
  }

  event PostCreated(
    uint id,
    string hash,
    string title,
    string description,
    uint price,
    uint quantity,
    bool stock,
    address payable author
  );

  event postBought(
    uint id,
    string hash,
    string title,
    string description,
    uint price,
    uint quantity,
    bool stock,
    address payable author
  );

  // Create posts
  function uploadPost(string memory _imgHash,
                      string memory _title,
                      string memory _description,
                      uint _price,
                      uint _quantity) public {        

    /*
    bool hasUploadedImages = false;
    for (uint i=0; i<_imgHash.length; i++) {
        if (bytes(_imgHash[i]).length > 0) {
          hasUploadedImages = true;
        }
    }*/
    //require(hasUploadedImages==true);
    require(bytes(_imgHash).length > 0);
    require(bytes(_title).length > 0);
    require(bytes(_description).length > 0);
    require(msg.sender!=address(0x0));
    require(_price > 0);
    require(_quantity > 0);

    bool stock = true;

    if (_quantity<=0) {
      stock = false;
    } 

    postCount++;
    posts[postCount] =  Post(postCount, _imgHash, _title, _description, _price, _quantity, stock, msg.sender);
    emit PostCreated(postCount, _imgHash, _title, _description, _price, _quantity, stock, msg.sender);

  }

  // Tip posts
  function buyPost(uint _id, uint _quantity) public payable {
    require(_id > 0 && _id <= postCount);
    
    Post memory _post = posts[_id];
    address payable _author = _post.author;
    address(_author).transfer(msg.value);
    
    _post.quantity = _post.quantity - _quantity;

    bool stock = true;
    if (_post.quantity<=0) {
      stock = false;
    } 

    _post.stock = stock;

    posts[_id] = _post;

    emit postBought(_id, _post.hash, _post.title, _post.description, _post.price, _post.quantity, _post.stock, _author);
  }

}

