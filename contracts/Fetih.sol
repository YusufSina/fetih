// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Fetih is ERC721, ERC721Enumerable, Ownable {
    string BASE_URI;
    uint256 MAX_SUPPLY;
    uint256 BUY_PRICE = 0.1 * (10 ** 18);
    bool IS_WAR_ENDED;
    address ORACLE_CLIENT;
    uint256 MINIMUM_DEFENDER_SOLDIER = 1;
    uint256 MINIMUM_ATTACKER_SOLDIER = 3;

    mapping(uint256 => uint256) _soldiers;
    mapping(uint256 => mapping(uint256 => bool)) _invadableCities;

    event UpdateBaseURI(string oldBaseURI, string newBaseURI);
    event BoughtCity(address sender, uint256 tokenId, uint256 amount);
    event UpdateOracleClient(address oldClient, address newClient);
    
    constructor(string memory _baseUri) ERC721("Fetih", "FTH") {
        BASE_URI = _baseUri;
        MAX_SUPPLY = 81;

        uint256 iterator = 1;
        for(;iterator <= MAX_SUPPLY;) {
            _safeMint(address(this), iterator);
            _soldiers[iterator] = 10;
            
            unchecked {
                iterator++;
            }
        }
    }

    function getMinimumDefenderSoldier() internal view returns(uint256) {
        return MINIMUM_DEFENDER_SOLDIER;
    }

    function getMinimumAttackerSoldier() internal view returns(uint256) {
        return MINIMUM_ATTACKER_SOLDIER;
    }

    function maxSupply() public view returns (uint256) {
        return MAX_SUPPLY;
    }

    function getBaseURI() external view returns(string memory) {
        return _baseURI();
    }

    function _baseURI() internal view override returns (string memory) {
        return BASE_URI;
    }

    function _setBaseUri(string memory _baseUri) external onlyOwner {
        emit UpdateBaseURI(BASE_URI, _baseUri);

        BASE_URI = _baseUri;
    }

    function buyCity(uint256 tokenId) external payable {
        require(tokenId > 0 && tokenId <= maxSupply(), "There is no city with given tokenId!");
        require(balanceOf(msg.sender) == 0, "Can't buy when you have one!");
        require(msg.value >= BUY_PRICE, "Amount is not enough!");

        emit BoughtCity(msg.sender, tokenId, msg.value);

        safeTransferFrom(address(this), msg.sender, tokenId);
    }

    function battle(uint256 attackerTokenId, uint256 defenderTokenId) external whenWarContinues {
        require(ownerOf(attackerTokenId) == msg.sender, "You are not owner of attacking city!");
        require(ownerOf(defenderTokenId) != msg.sender, "You can't attack your city!");
        require(_soldiers[attackerTokenId] >= getMinimumAttackerSoldier(), "City has more than 2 soldiers to attack!");

        IFetihOracleClient(getOracleClient()).requestData(attackerTokenId, defenderTokenId, _soldiers[attackerTokenId], _soldiers[defenderTokenId]);
    }

    function battleResult(uint256 attackerTokenId, uint256 defenderTokenId, bool isSucceed) public onlyOracleClient {
        uint256 attackerSoldiers = _soldiers[attackerTokenId];
        uint256 defenderSoldiers = _soldiers[defenderTokenId];
        address attackingEmperor = ownerOf(attackerTokenId);
        address defendingEmperor = ownerOf(defenderTokenId);

        if (isSucceed || defenderSoldiers == getMinimumDefenderSoldier()) {
            attackerSoldiers -= 1;
            defenderSoldiers = 1;

            _transfer(defendingEmperor, attackingEmperor, defenderTokenId);

            // if all cities conquered
            uint256 amount = balanceOf(attackingEmperor);
            if (amount == maxSupply()) {
                sendViaCall(payable(attackingEmperor), address(this).balance);
            }
        }
        else {
            attackerSoldiers -= 3;
            defenderSoldiers -= 1;
        }
    }

    function getOracleClient() public view returns (address) {
        return ORACLE_CLIENT;
    }

    function changeOracleClient(address _newClient) external onlyOwner {
        emit UpdateOracleClient(ORACLE_CLIENT, _newClient);

        ORACLE_CLIENT = _newClient;
    }

    function sendViaCall(address payable _to, uint256 amount) internal {
        // Call returns a boolean value indicating success or failure.
        // This is the current recommended method to use.
        (bool sent,) = _to.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    modifier whenWarEnded(address from) {
        require(IS_WAR_ENDED || from == address(this), "The war continues!");

        _;
    }

    modifier whenWarContinues() {
        require(!IS_WAR_ENDED, "The war ended");

        _;
    }

    modifier onlyOracleClient() {
        require(getOracleClient() == msg.sender, "Only oracle client!");

        _;
    }

    // overrides

    /**
     * @dev See {IERC721-transferFrom}.
     */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override whenWarEnded(from) {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");

        _transfer(from, to, tokenId);
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override whenWarEnded(from) {
        ERC721(address(this)).safeTransferFrom(from, to, tokenId, "");
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public override whenWarEnded(from) {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
        _safeTransfer(from, to, tokenId, _data);
    }


    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

interface IFetihOracleClient {
    function requestData(uint256 attackerId, uint256 defenderId, uint256 attackerSoldiers, uint256 defenderSoldiers) external returns (bytes32 requestId);
}