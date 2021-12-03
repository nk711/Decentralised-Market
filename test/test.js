const { assert } = require('chai')

const Decentragram = artifacts.require('./Decentragram.sol')

const numberOfTokens = new web3.utils.BN(1); //user input
const pricePerToken = web3.utils.toWei('1','ether');
const tokenPrice = new web3.utils.BN(pricePerToken).mul(numberOfTokens);

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Decentragram', ([deployer, author, buyer]) => {
  let decentragram

  before(async () => {
    decentragram = await Decentragram.deployed()
  })

  /* Associated Deployment Testing*/
  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await decentragram.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await decentragram.name()
      assert.equal(name, 'Decentragram')
    })
  })

  /* Associated Post Testing */
  describe('posts', async() => {
    let result, postCount;
    //const hashes = ['hash1','hash2','hash3','hash4','hash5'];
    const hash = 'hash1';
    
    before(async () => {
      result = await decentragram.uploadPost(hash, 'title', 'description', tokenPrice.toString(), 1, {from: author})
      postCount = await decentragram.postCount()
    })

    it ('creates posts', async () => {
      const event = result.logs[0].args
      assert.equal(postCount, 1,  'Post count is 1')
      assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
      assert.equal(event.hash, hash, 'Hash is correct')
      assert.equal(event.title, 'title', 'title is correct')
      assert.equal(event.description, 'description', 'derscription is correct')    
      assert.equal(event.price.toString(), tokenPrice.toString(), 'price is correct')
      assert.equal(event.quantity, '1', 'quantity is correct')
      assert.equal(event.stock, true, 'stock is correct')
      assert.equal(event.author, author, 'author is correct')
      
      // Failure: Post must have HASH
      await decentragram.uploadPost('', 'title', 'description', tokenPrice.toString(), 1, { from: author }).should.be.rejected;
      // Failure: Post must have a title
      await decentragram.uploadPost('imghash', '', 'description', tokenPrice.toString(), 1, { from: author }).should.be.rejected;
      // Failure: Post must have a description
      await decentragram.uploadPost('imghash', 'title', '', tokenPrice.toString(), 1, { from: author }).should.be.rejected;
      // Failure: Post must have a price greater than 0
      await decentragram.uploadPost('imghash', 'title', 'description', 0, 1, { from: author }).should.be.rejected;
      // Failure: Post must have a quantity greater than 0
      await decentragram.uploadPost('imghash', 'title', 'description', tokenPrice.toString(), 0, { from: author }).should.be.rejected;
    })
  
    it ('lists posts', async() => {
      const post = await decentragram.posts(postCount)
      assert.equal(post.id.toNumber(), postCount.toNumber(), 'id is correct')
      assert.equal(post.hash, hash, 'Hash is correct')
      assert.equal(post.title, 'title', 'title is correct')
      assert.equal(post.description, 'description', 'derscription is correct')    
      assert.equal(post.price, tokenPrice.toString(), 'price is correct')
      assert.equal(post.quantity, '1', 'quantity is correct')
      assert.equal(post.stock, true, 'stock is correct')
      assert.equal(post.author, author, 'author is correct')
    }) 


    it ('allows users to buy the post', async() => {
      let authorBalance;
      authorBalance = await web3.eth.getBalance(author)
      authorBalance = new web3.utils.BN(authorBalance)

      const quantity = 1;
      result = await decentragram.buyPost(postCount, quantity, { from: buyer, value: result.logs[0].args.price} )

      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
      assert.equal(event.hash, hash, 'Hash is correct')
      assert.equal(event.title, 'title', 'title is correct')
      assert.equal(event.description, 'description', 'derscription is correct')    
      assert.equal(event.price, tokenPrice.toString(), 'price is correct')
      assert.equal(event.quantity, '0', 'quantity is correct')
      assert.equal(event.stock, false, 'stock is correct')
      assert.equal(event.author, author, 'author is correct')

      //Check if the author received the Eth
      let newAuthorBalance;
      newAuthorBalance = await web3.eth.getBalance(author)
      newAuthorBalance = new web3.utils.BN(newAuthorBalance)

      let cost;
      cost = new web3.utils.BN(event.price)

      const expectedBalance = authorBalance.add(cost)
      assert.equal(newAuthorBalance.toString(), expectedBalance.toString())


    }) 
  })

})