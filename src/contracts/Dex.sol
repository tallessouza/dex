// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./Token.sol";

contract Dex {
    using SafeMath for uint256;

    address public feeAccount;
    uint256 public feePercent;
    address constant ETHER = address(0);
    address payable private owner;

    mapping(address => mapping(address => uint256)) public tokens;

    event Deposit(address token, address user, uint256 amount, uint256 balance);

    /// Only owner can execute this function!
    error OnlyOwner();

    modifier onlyOwner() {
        if (msg.sender != getContractOwner()) {
            revert OnlyOwner();
        }
        _;
    }

    constructor(address _feeAccount, uint256 _feePercent) {
        setContractOwner(msg.sender);
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    function getContractOwner() public view returns (address) {
        return owner;
    }

    function depositEther() public payable {
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
    }

    function depositToken(address _token, uint256 _amount) public {
        require(_token != ETHER);
        require(Token(_token).transferFrom(msg.sender, address(this), _amount));
        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    function setContractOwner(address newOwner) private {
        owner = payable(newOwner);
    }
}
