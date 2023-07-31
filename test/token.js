const { expect } = require("chai");
const { ethers, hardhatArguments } = require("hardhat");
const {
  isCallTrace,
} = require("hardhat/internal/hardhat-network/stack-traces/message-trace");

describe("Token Contract", function () {
  let Token;
  let hardhatToken;
  let owner;
  let add1;
  let add2;
  let adds;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("Token");
    [owner, add1, add2, ...adds] = await ethers.getSigners();
    hardhatToken = await Token.deploy();
  });

  describe("Deployement", function () {
    it("should set the right owner", async function () {
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });

    it("should set the right number of tokens to the owner", async function () {
      const ownerbalance = await hardhatToken.balanceOf(owner.address);
      expect(await hardhatToken.totalsupply()).to.equal(ownerbalance);
    });
  });

  describe("trasactions", function () {
    it("should transfer token between accounts", async function () {
      await hardhatToken.transfer(add1.address, 5);
      const add1balance = await hardhatToken.balanceOf(add1.address);
      expect(add1balance).to.equal(5);

      await hardhatToken.connect(add1).transfer(add2.address, 5);
      const add2balance = await hardhatToken.balanceOf(add2.address);
      expect(add2balance).to.equal(5);
    });

    it("Should fail if the sender doesnt have enough tokens", async function () {
      const intialownerbalance = await hardhatToken.balanceOf(owner.address);
      await expect(
        hardhatToken.connect(add1).transfer(owner.address, 1)
      ).to.be.revertedWith("not enough tokens");
      expect(await hardhatToken.balanceOf(owner.address)).to.equal(
        intialownerbalance
      );
    });

    it("Should update balances after transfers ", async function () {
      const intownerBalance = await hardhatToken.balanceOf(owner.address);
      await hardhatToken.transfer(add1.address, 5);
      await hardhatToken.transfer(add2.address, 10);
      const finalownerbalance = await hardhatToken.balanceOf(owner.address);
      expect(finalownerbalance).to.equal(intownerBalance - 15);

      const add1balance = await hardhatToken.balanceOf(add1.address);
      expect(add1balance).to.equal(5);

      const add2balance = await hardhatToken.balanceOf(add2.address);
      expect(add2balance).to.equal(10);
    });
  });
});

// describe("Token", function () {
//   it("Assign tokens to owner", async function () {
//     const [owner] = await ethers.getSigners();

//     const Token = await ethers.getContractFactory("Token");

//     const hardhatToken = await Token.deploy();

//     const ownerbalance = await hardhatToken.balanceOf(owner.address);

//     expect(await hardhatToken.totalsupply()).to.equal(ownerbalance);
//   });

//   it("Transfer Tokens between accounts", async function () {
//     const [owner, add1, add2] = await ethers.getSigners();

//     const Token = await ethers.getContractFactory("Token");

//     const hardhatToken = await Token.deploy();

//     await hardhatToken.transfer(add1.address, 10);
//     expect(await hardhatToken.balanceOf(add1.address)).to.equal(10);

//     await hardhatToken.connect(add1).transfer(add2.address, 5);
//     expect(await hardhatToken.balanceOf(add2.address)).to.equal(5);
//   });
// });
