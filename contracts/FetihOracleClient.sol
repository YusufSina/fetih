// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract FetihOracleClient is ChainlinkClient {
    using Chainlink for Chainlink.Request;
  
    string private API_URL;

    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    address private linkToken;

    address owner;

    struct RequestModel {
        uint256 attackerId;
        uint256 defenderId;
    }

    mapping(bytes32 => RequestModel) REQUEST_MODELS;
    address FETIH;

    event UpdateOwner(address oldOwner, address newOwner);
    event UpdateApiUrl(string oldApiUrl, string newApiUrl);
    event UpdateFetih(address oldFetih, address newFetih);
    
    /**
     * Network: Rinkeby
     * Oracle: 0x3A56aE4a2831C3d3514b5D7Af5578E45eBDb7a40 
     * Job ID: 99e99d6e82be464a9e4b6acc55bbcf14
     * Fee: 0.01 LINK
     * Lives at 0x3b63a487B00Bed56a2B4D9c999735d38adC5Eabb on Rinkeby Network
     */
    constructor(string memory _apiUrl, address _fetihAddr) {
        linkToken = 0x01BE23585060835E02B77ef475b0Cc51aA1e0709;
        setChainlinkToken(linkToken);
        oracle = 0x3A56aE4a2831C3d3514b5D7Af5578E45eBDb7a40;
        jobId = "99e99d6e82be464a9e4b6acc55bbcf14";
        fee = 0.01 * 10 ** 18; // (Varies by network and job)

        owner = msg.sender;
        API_URL = _apiUrl;
        FETIH = _fetihAddr;
    }
    
    function requestData(uint256 attackerId, uint256 defenderId, uint256 attackerSoldiers, uint256 defenderSoldiers) public onlyFetih returns (bytes32 requestId) 
    {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        
        // Set the URL to perform the GET request on
        request.add("get", string(abi.encodePacked(API_URL, Strings.toString(attackerId), "/", Strings.toString(defenderId), "/", Strings.toString(attackerSoldiers), "/", Strings.toString(defenderSoldiers))));
        
        request.add("path", "isSucceed");
        requestId = sendChainlinkRequestTo(oracle, request, fee);

        REQUEST_MODELS[requestId] = RequestModel(attackerId, defenderId);
        // Sends the request
        return requestId;
    }
    
    /**
     * Receive war result in the form of bool
     */ 
    function fulfill(bytes32 _requestId, bool _isSucceed) public recordChainlinkFulfillment(_requestId)
    {
        RequestModel memory model = REQUEST_MODELS[_requestId];

        IFetih(getFetih()).battleResult(model.attackerId, model.defenderId, _isSucceed);
    }

    function getOwner() public view returns(address) {
        return owner;
    }

    function changeOwner(address _newOwner) external onlyOwner {
        emit UpdateOwner(msg.sender, _newOwner);

        owner = _newOwner;
    }

    function getApiUrl() public view returns(string memory){
        return API_URL;
    }

    function changeApiUrl(string memory _newApiUrl) external onlyOwner {
        emit UpdateApiUrl(API_URL, _newApiUrl);

        API_URL = _newApiUrl;
    }

    function setOracleDetails(address _oracleAddr, string memory _jobId, uint256 _fee) external onlyOwner {
        oracle = _oracleAddr;
        jobId = bytes32(abi.encodePacked(_jobId));
        fee = _fee;
    }

    function getOracleDetails() public view returns(address, string memory, uint256) {
        string memory _jobId = string(abi.encodePacked(jobId));
        return (oracle, _jobId, fee);
    }

    function withdrawToken(uint256 _amount) external onlyOwner {
        IERC20(linkToken).transfer(msg.sender, _amount);
    }

    function getFetih() public view returns(address) {
        return FETIH;
    }

    function changeFetih(address _newFetih) external onlyOwner {
        emit UpdateFetih(getFetih(), _newFetih);

        FETIH = _newFetih;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "Not owner!");
        _;
    }

    modifier onlyFetih() {
        require(msg.sender == getFetih(), "You are not fetih contract!");

        _;
    }

    // function withdrawLink() external {} - Implement a withdraw function to avoid locking your LINK in the contract
}

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
}

interface IFetih {
    function battleResult(uint256 attackerTokenId, uint256 defenderTokenId, bool isSucceed) external;
}

