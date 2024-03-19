// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TokenTransfer {
    address public owner;
    uint256 public contractBalance;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function transferAll(address payable[] memory _to, uint256[] memory _amounts) external onlyOwner {
        require(_to.length == _amounts.length, "Arrays length mismatch");

        for (uint256 i = 0; i < _to.length; i++) {
            require(_to[i] != address(0), "Invalid recipient address");
            require(_amounts[i] > 0, "Invalid transfer amount");

            _to[i].transfer(_amounts[i]);
        }

        updateContractBalance();
    }

    function withdraw(uint256 _amount) external onlyOwner {
        require(_amount <= address(this).balance, "Insufficient contract balance");
        payable(owner).transfer(_amount);
        updateContractBalance();
    }

    receive() external payable {
        updateContractBalance();
    }

    function updateContractBalance() internal {
        contractBalance = address(this).balance;
    }

}
