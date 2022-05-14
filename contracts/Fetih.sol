// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IFetihOracleClient {
    function requestData(uint256 attackerId, uint256 defenderId, uint256 attackerSoldiers, uint256 defenderSoldiers) external returns (bytes32 requestId);
}

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

        initInvadableCities();
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

    function isInvadableCity(uint256 attackerTokenId, uint256 defenderTokenId) internal returns(bool) {
        return _invadableCities[attackerTokenId][defenderTokenId];
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
        require(isInvadableCity(attackerTokenId, defenderTokenId), "You should attack to city that has shared borders with attacking city!");

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

    function initInvadableCities() internal {
        _invadableCities[1][31] = true;
        _invadableCities[1][80] = true;
        _invadableCities[1][46] = true;
        _invadableCities[1][38] = true;
        _invadableCities[1][51] = true;
        _invadableCities[1][33] = true;
        _invadableCities[2][63] = true;
        _invadableCities[2][21] = true;
        _invadableCities[2][44] = true;
        _invadableCities[2][46] = true;
        _invadableCities[2][27] = true;
        _invadableCities[3][32] = true;
        _invadableCities[3][42] = true;
        _invadableCities[3][26] = true;
        _invadableCities[3][43] = true;
        _invadableCities[3][64] = true;
        _invadableCities[3][20] = true;
        _invadableCities[3][15] = true;
        _invadableCities[4][65] = true;
        _invadableCities[4][76] = true;
        _invadableCities[4][36] = true;
        _invadableCities[4][25] = true;
        _invadableCities[4][49] = true;
        _invadableCities[4][13] = true;
        _invadableCities[5][66] = true;
        _invadableCities[5][60] = true;
        _invadableCities[5][55] = true;
        _invadableCities[5][19] = true;
        _invadableCities[6][42] = true;
        _invadableCities[6][68] = true;
        _invadableCities[6][40] = true;
        _invadableCities[6][71] = true;
        _invadableCities[6][18] = true;
        _invadableCities[6][14] = true;
        _invadableCities[6][26] = true;
        _invadableCities[6][3] = true;
        _invadableCities[7][33] = true;
        _invadableCities[7][70] = true;
        _invadableCities[7][42] = true;
        _invadableCities[7][32] = true;
        _invadableCities[7][15] = true;
        _invadableCities[7][48] = true;
        _invadableCities[8][53] = true;
        _invadableCities[8][25] = true;
        _invadableCities[8][75] = true;
        _invadableCities[9][48] = true;
        _invadableCities[9][20] = true;
        _invadableCities[9][45] = true;
        _invadableCities[9][35] = true;
        _invadableCities[10][35] = true;
        _invadableCities[10][45] = true;
        _invadableCities[10][43] = true;
        _invadableCities[10][16] = true;
        _invadableCities[10][17] = true;
        _invadableCities[11][43] = true;
        _invadableCities[11][26] = true;
        _invadableCities[11][14] = true;
        _invadableCities[11][54] = true;
        _invadableCities[11][16] = true;
        _invadableCities[12][21] = true;
        _invadableCities[12][49] = true;
        _invadableCities[12][25] = true;
        _invadableCities[12][24] = true;
        _invadableCities[12][62] = true;
        _invadableCities[12][23] = true;
        _invadableCities[13][56] = true;
        _invadableCities[13][65] = true;
        _invadableCities[13][4] = true;
        _invadableCities[13][49] = true;
        _invadableCities[13][72] = true;
        _invadableCities[14][26] = true;
        _invadableCities[14][6] = true;
        _invadableCities[14][18] = true;
        _invadableCities[14][67] = true;
        _invadableCities[14][81] = true;
        _invadableCities[14][54] = true;
        _invadableCities[14][11] = true;
        _invadableCities[15][48] = true;
        _invadableCities[15][7] = true;
        _invadableCities[15][32] = true;
        _invadableCities[15][3] = true;
        _invadableCities[15][20] = true;
        _invadableCities[16][10] = true;
        _invadableCities[16][43] = true;
        _invadableCities[16][11] = true;
        _invadableCities[16][54] = true;
        _invadableCities[16][41] = true;
        _invadableCities[16][77] = true;
        _invadableCities[17][10] = true;
        _invadableCities[17][59] = true;
        _invadableCities[17][22] = true;
        _invadableCities[18][6] = true;
        _invadableCities[18][71] = true;
        _invadableCities[18][19] = true;
        _invadableCities[18][37] = true;
        _invadableCities[18][67] = true;
        _invadableCities[18][14] = true;
        _invadableCities[18][78] = true;
        _invadableCities[19][66] = true;
        _invadableCities[19][5] = true;
        _invadableCities[19][55] = true;
        _invadableCities[19][57] = true;
        _invadableCities[19][37] = true;
        _invadableCities[19][18] = true;
        _invadableCities[19][71] = true;
        _invadableCities[20][48] = true;
        _invadableCities[20][15] = true;
        _invadableCities[20][3] = true;
        _invadableCities[20][64] = true;
        _invadableCities[20][45] = true;
        _invadableCities[20][9] = true;
        _invadableCities[21][63] = true;
        _invadableCities[21][47] = true;
        _invadableCities[21][72] = true;
        _invadableCities[21][49] = true;
        _invadableCities[21][12] = true;
        _invadableCities[21][23] = true;
        _invadableCities[21][44] = true;
        _invadableCities[21][2] = true;
        _invadableCities[22][17] = true;
        _invadableCities[22][59] = true;
        _invadableCities[22][71] = true;
        _invadableCities[23][21] = true;
        _invadableCities[23][12] = true;
        _invadableCities[23][62] = true;
        _invadableCities[23][24] = true;
        _invadableCities[23][44] = true;
        _invadableCities[24][23] = true;
        _invadableCities[24][62] = true;
        _invadableCities[24][12] = true;
        _invadableCities[24][25] = true;
        _invadableCities[24][69] = true;
        _invadableCities[24][29] = true;
        _invadableCities[24][28] = true;
        _invadableCities[24][58] = true;
        _invadableCities[24][44] = true;
        _invadableCities[25][12] = true;
        _invadableCities[25][49] = true;
        _invadableCities[25][4] = true;
        _invadableCities[25][36] = true;
        _invadableCities[25][75] = true;
        _invadableCities[25][8] = true;
        _invadableCities[25][53] = true;
        _invadableCities[25][61] = true;
        _invadableCities[25][69] = true;
        _invadableCities[25][24] = true;
        _invadableCities[26][3] = true;
        _invadableCities[26][42] = true;
        _invadableCities[26][6] = true;
        _invadableCities[26][14] = true;
        _invadableCities[26][11] = true;
        _invadableCities[26][43] = true;
        _invadableCities[27][79] = true;
        _invadableCities[27][63] = true;
        _invadableCities[27][2] = true;
        _invadableCities[27][46] = true;
        _invadableCities[27][80] = true;
        _invadableCities[27][31] = true;
        _invadableCities[28][29] = true;
        _invadableCities[28][61] = true;
        _invadableCities[28][24] = true;
        _invadableCities[28][58] = true;
        _invadableCities[28][52] = true;
        _invadableCities[29][24] = true;
        _invadableCities[29][69] = true;
        _invadableCities[29][61] = true;
        _invadableCities[29][28] = true;
        _invadableCities[30][65] = true;
        _invadableCities[30][73] = true;
        _invadableCities[31][79] = true;
        _invadableCities[31][27] = true;
        _invadableCities[31][80] = true;
        _invadableCities[31][1] = true;
        _invadableCities[32][7] = true;
        _invadableCities[32][42] = true;
        _invadableCities[32][3] = true;
        _invadableCities[32][15] = true;
        _invadableCities[33][1] = true;
        _invadableCities[33][51] = true;
        _invadableCities[33][42] = true;
        _invadableCities[33][70] = true;
        _invadableCities[33][7] = true;
        _invadableCities[34][41] = true;
        _invadableCities[34][59] = true;
        _invadableCities[34][39] = true;
        _invadableCities[35][9] = true;
        _invadableCities[35][45] = true;
        _invadableCities[35][10] = true;
        _invadableCities[36][4] = true;
        _invadableCities[36][76] = true;
        _invadableCities[36][75] = true;
        _invadableCities[36][25] = true;
        _invadableCities[37][19] = true;
        _invadableCities[37][57] = true;
        _invadableCities[37][18] = true;
        _invadableCities[37][74] = true;
        _invadableCities[37][78] = true;
        _invadableCities[38][1] = true;
        _invadableCities[38][46] = true;
        _invadableCities[38][58] = true;
        _invadableCities[38][66] = true;
        _invadableCities[38][50] = true;
        _invadableCities[38][51] = true;
        _invadableCities[39][22] = true;
        _invadableCities[39][59] = true;
        _invadableCities[39][34] = true;
        _invadableCities[40][50] = true;
        _invadableCities[40][66] = true;
        _invadableCities[40][71] = true;
        _invadableCities[40][6] = true;
        _invadableCities[40][68] = true;
        _invadableCities[41][77] = true;
        _invadableCities[41][34] = true;
        _invadableCities[41][16] = true;
        _invadableCities[41][11] = true;
        _invadableCities[41][54] = true;
        _invadableCities[42][7] = true;
        _invadableCities[42][70] = true;
        _invadableCities[42][33] = true;
        _invadableCities[42][51] = true;
        _invadableCities[42][68] = true;
        _invadableCities[42][6] = true;
        _invadableCities[42][26] = true;
        _invadableCities[42][3] = true;
        _invadableCities[42][63] = true;
        _invadableCities[43][45] = true;
        _invadableCities[43][64] = true;
        _invadableCities[43][3] = true;
        _invadableCities[43][26] = true;
        _invadableCities[43][11] = true;
        _invadableCities[43][16] = true;
        _invadableCities[43][10] = true;
        _invadableCities[44][46] = true;
        _invadableCities[44][2] = true;
        _invadableCities[44][21] = true;
        _invadableCities[44][23] = true;
        _invadableCities[44][24] = true;
        _invadableCities[44][58] = true;
        _invadableCities[45][35] = true;
        _invadableCities[45][9] = true;
        _invadableCities[45][20] = true;
        _invadableCities[45][64] = true;
        _invadableCities[45][43] = true;
        _invadableCities[45][10] = true;
        _invadableCities[46][27] = true;
        _invadableCities[46][2] = true;
        _invadableCities[46][44] = true;
        _invadableCities[46][58] = true;
        _invadableCities[46][38] = true;
        _invadableCities[46][6] = true;
        _invadableCities[46][80] = true;
        _invadableCities[47][63] = true;
        _invadableCities[47][21] = true;
        _invadableCities[47][72] = true;
        _invadableCities[47][56] = true;
        _invadableCities[47][73] = true;
        _invadableCities[48][7] = true;
        _invadableCities[48][15] = true;
        _invadableCities[48][20] = true;
        _invadableCities[48][9] = true;
        _invadableCities[49][21] = true;
        _invadableCities[49][72] = true;
        _invadableCities[49][13] = true;
        _invadableCities[49][4] = true;
        _invadableCities[49][25] = true;
        _invadableCities[49][12] = true;
        _invadableCities[50][51] = true;
        _invadableCities[50][38] = true;
        _invadableCities[50][66] = true;
        _invadableCities[50][40] = true;
        _invadableCities[50][68] = true;
        _invadableCities[51][50] = true;
        _invadableCities[51][38] = true;
        _invadableCities[51][6] = true;
        _invadableCities[51][33] = true;
        _invadableCities[51][42] = true;
        _invadableCities[51][68] = true;
        _invadableCities[52][35] = true;
        _invadableCities[52][9] = true;
        _invadableCities[52][64] = true;
        _invadableCities[52][20] = true;
        _invadableCities[52][43] = true;
        _invadableCities[52][10] = true;
        _invadableCities[53][8] = true;
        _invadableCities[53][25] = true;
        _invadableCities[53][69] = true;
        _invadableCities[53][61] = true;
        _invadableCities[54][81] = true;
        _invadableCities[54][14] = true;
        _invadableCities[54][11] = true;
        _invadableCities[54][16] = true;
        _invadableCities[54][41] = true;
        _invadableCities[55][52] = true;
        _invadableCities[55][60] = true;
        _invadableCities[55][5] = true;
        _invadableCities[55][19] = true;
        _invadableCities[55][57] = true;
        _invadableCities[56][65] = true;
        _invadableCities[56][13] = true;
        _invadableCities[56][72] = true;
        _invadableCities[56][47] = true;
        _invadableCities[56][73] = true;
        _invadableCities[57][55] = true;
        _invadableCities[57][19] = true;
        _invadableCities[57][37] = true;
        _invadableCities[58][38] = true;
        _invadableCities[58][49] = true;
        _invadableCities[58][44] = true;
        _invadableCities[58][24] = true;
        _invadableCities[58][28] = true;
        _invadableCities[58][52] = true;
        _invadableCities[58][60] = true;
        _invadableCities[58][66] = true;
        _invadableCities[59][34] = true;
        _invadableCities[59][39] = true;
        _invadableCities[59][22] = true;
        _invadableCities[59][17] = true;
        _invadableCities[60][58] = true;
        _invadableCities[60][52] = true;
        _invadableCities[60][55] = true;
        _invadableCities[60][5] = true;
        _invadableCities[60][66] = true;
        _invadableCities[61][53] = true;
        _invadableCities[61][69] = true;
        _invadableCities[61][29] = true;
        _invadableCities[61][28] = true;
        _invadableCities[62][23] = true;
        _invadableCities[62][12] = true;
        _invadableCities[62][24] = true;
        _invadableCities[63][27] = true;
        _invadableCities[63][2] = true;
        _invadableCities[63][21] = true;
        _invadableCities[63][47] = true;
        _invadableCities[64][45] = true;
        _invadableCities[64][20] = true;
        _invadableCities[64][3] = true;
        _invadableCities[64][43] = true;
        _invadableCities[65][30] = true;
        _invadableCities[65][73] = true;
        _invadableCities[65][56] = true;
        _invadableCities[65][13] = true;
        _invadableCities[65][4] = true;
        _invadableCities[66][38] = true;
        _invadableCities[66][58] = true;
        _invadableCities[66][60] = true;
        _invadableCities[66][5] = true;
        _invadableCities[66][19] = true;
        _invadableCities[66][71] = true;
        _invadableCities[66][40] = true;
        _invadableCities[66][50] = true;
        _invadableCities[67][74] = true;
        _invadableCities[67][18] = true;
        _invadableCities[67][14] = true;
        _invadableCities[67][81] = true;
        _invadableCities[67][78] = true;
        _invadableCities[68][51] = true;
        _invadableCities[68][50] = true;
        _invadableCities[68][40] = true;
        _invadableCities[68][6] = true;
        _invadableCities[68][42] = true;
        _invadableCities[69][24] = true;
        _invadableCities[69][25] = true;
        _invadableCities[69][53] = true;
        _invadableCities[69][61] = true;
        _invadableCities[69][29] = true;
        _invadableCities[70][33] = true;
        _invadableCities[70][42] = true;
        _invadableCities[70][7] = true;
        _invadableCities[71][40] = true;
        _invadableCities[71][66] = true;
        _invadableCities[71][19] = true;
        _invadableCities[71][18] = true;
        _invadableCities[71][6] = true;
        _invadableCities[72][47] = true;
        _invadableCities[72][56] = true;
        _invadableCities[72][13] = true;
        _invadableCities[72][49] = true;
        _invadableCities[72][21] = true;
        _invadableCities[73][47] = true;
        _invadableCities[73][56] = true;
        _invadableCities[73][65] = true;
        _invadableCities[73][30] = true;
        _invadableCities[74][37] = true;
        _invadableCities[74][67] = true;
        _invadableCities[74][78] = true;
        _invadableCities[75][25] = true;
        _invadableCities[75][36] = true;
        _invadableCities[75][8] = true;
        _invadableCities[76][4] = true;
        _invadableCities[76][36] = true;
        _invadableCities[77][41] = true;
        _invadableCities[77][16] = true;
        _invadableCities[78][67] = true;
        _invadableCities[78][74] = true;
        _invadableCities[78][37] = true;
        _invadableCities[78][18] = true;
        _invadableCities[79][27] = true;
        _invadableCities[79][31] = true;
        _invadableCities[80][27] = true;
        _invadableCities[80][46] = true;
        _invadableCities[80][1] = true;
        _invadableCities[80][31] = true;
        _invadableCities[81][67] = true;
        _invadableCities[81][13] = true;
        _invadableCities[81][54] = true;
    }
}