// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PredictionMarket {
    
    // Market structure
    struct Market {
        uint256 id;
        address oracle;
        string question;
        uint256 endDate;
        uint256 totalYesShares;
        uint256 totalNoShares;
        uint256 prizePot;
        bool resolved;
        bool outcome; // true = YES won, false = NO won
    }
    
    // Track all markets
    uint256 public marketCount;
    mapping(uint256 => Market) public markets;
    
    // Track user positions: marketId => user => (yesShares, noShares)
    mapping(uint256 => mapping(address => uint256)) public yesShares;
    mapping(uint256 => mapping(address => uint256)) public noShares;
    
    // Track if user has claimed: marketId => user => claimed
    mapping(uint256 => mapping(address => bool)) public hasClaimed;
    
    // Events (logs that frontends can listen to)
    event MarketCreated(uint256 indexed marketId, address indexed oracle, string question, uint256 endDate);
    event SharesPurchased(uint256 indexed marketId, address indexed user, bool isYes, uint256 shares, uint256 cost);
    event PrizePotAdded(uint256 indexed marketId, uint256 amount);
    event MarketResolved(uint256 indexed marketId, bool outcome);
    event PayoutClaimed(uint256 indexed marketId, address indexed user, uint256 amount);
    
    // Create a new market
    function createMarket(string memory _question, uint256 _endDate) external payable returns (uint256) {
        require(_endDate > block.timestamp, "End date must be in future");
        
        uint256 marketId = marketCount++;
        
        markets[marketId] = Market({
            id: marketId,
            oracle: msg.sender,
            question: _question,
            endDate: _endDate,
            totalYesShares: 0,
            totalNoShares: 0,
            prizePot: msg.value, // ETH sent with creation goes to prize pot
            resolved: false,
            outcome: false
        });
        
        emit MarketCreated(marketId, msg.sender, _question, _endDate);
        
        if (msg.value > 0) {
            emit PrizePotAdded(marketId, msg.value);
        }
        
        return marketId;
    }
    
    // Add to prize pot
    function addToPrizePot(uint256 _marketId) external payable {
        Market storage market = markets[_marketId];
        require(!market.resolved, "Market already resolved");
        require(msg.sender == market.oracle, "Only oracle can add to prize pot");
        require(msg.value > 0, "Must send ETH");
        
        market.prizePot += msg.value;
        emit PrizePotAdded(_marketId, msg.value);
    }
    
    // Buy shares (YES or NO)
    function buyShares(uint256 _marketId, bool _isYes, uint256 _shares) external payable {
        Market storage market = markets[_marketId];
        require(!market.resolved, "Market already resolved");
        require(block.timestamp < market.endDate, "Market has ended");
        require(_shares > 0, "Must buy at least 1 share");
        
        // Simple pricing: 0.01 ETH per share
        uint256 cost = _shares * 0.01 ether;
        require(msg.value >= cost, "Insufficient payment");
        
        if (_isYes) {
            yesShares[_marketId][msg.sender] += _shares;
            market.totalYesShares += _shares;
        } else {
            noShares[_marketId][msg.sender] += _shares;
            market.totalNoShares += _shares;
        }
        
        emit SharesPurchased(_marketId, msg.sender, _isYes, _shares, cost);
        
        // Refund excess
        if (msg.value > cost) {
            payable(msg.sender).transfer(msg.value - cost);
        }
    }
    
    // Oracle resolves the market
    function resolveMarket(uint256 _marketId, bool _outcome) external {
        Market storage market = markets[_marketId];
        require(msg.sender == market.oracle, "Only oracle can resolve");
        require(!market.resolved, "Already resolved");
        require(block.timestamp >= market.endDate, "Market hasn't ended yet");
        
        market.resolved = true;
        market.outcome = _outcome;
        
        emit MarketResolved(_marketId, _outcome);
    }
    
    // Users claim their winnings
    function claimPayout(uint256 _marketId) external {
        Market storage market = markets[_marketId];
        require(market.resolved, "Market not resolved yet");
        require(!hasClaimed[_marketId][msg.sender], "Already claimed");
        
        uint256 userWinningShares;
        uint256 totalWinningShares;
        
        if (market.outcome) {
            // YES won
            userWinningShares = yesShares[_marketId][msg.sender];
            totalWinningShares = market.totalYesShares;
        } else {
            // NO won
            userWinningShares = noShares[_marketId][msg.sender];
            totalWinningShares = market.totalNoShares;
        }
        
        require(userWinningShares > 0, "No winning shares");
        require(totalWinningShares > 0, "No total winning shares");
        
        hasClaimed[_marketId][msg.sender] = true;
        
        // Calculate payouts
        uint256 totalPool = (market.totalYesShares + market.totalNoShares) * 0.01 ether;
        uint256 contractPayout = (totalPool * userWinningShares) / totalWinningShares;
        uint256 prizePayout = (market.prizePot * userWinningShares) / totalWinningShares;
        
        uint256 totalPayout = contractPayout + prizePayout;
        
        payable(msg.sender).transfer(totalPayout);
        
        emit PayoutClaimed(_marketId, msg.sender, totalPayout);
    }
    
    // View functions
    function getMarket(uint256 _marketId) external view returns (Market memory) {
        return markets[_marketId];
    }
    
    function getUserPosition(uint256 _marketId, address _user) external view returns (uint256 yes, uint256 no) {
        return (yesShares[_marketId][_user], noShares[_marketId][_user]);
    }
    
    function calculatePotentialPayout(uint256 _marketId, address _user, bool _assumeOutcome) external view returns (uint256) {
        Market memory market = markets[_marketId];
        
        uint256 userWinningShares;
        uint256 totalWinningShares;
        
        if (_assumeOutcome) {
            userWinningShares = yesShares[_marketId][_user];
            totalWinningShares = market.totalYesShares;
        } else {
            userWinningShares = noShares[_marketId][_user];
            totalWinningShares = market.totalNoShares;
        }
        
        if (userWinningShares == 0 || totalWinningShares == 0) {
            return 0;
        }
        
        uint256 totalPool = (market.totalYesShares + market.totalNoShares) * 0.01 ether;
        uint256 contractPayout = (totalPool * userWinningShares) / totalWinningShares;
        uint256 prizePayout = (market.prizePot * userWinningShares) / totalWinningShares;
        
        return contractPayout + prizePayout;
    }
}