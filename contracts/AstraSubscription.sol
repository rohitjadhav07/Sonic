// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title SmartSonicSubscription
 * @dev Smart contract for Smart Sonic subscription management on Sonic Network
 * Users pay 1 S token for access to AI-powered blockchain operations
 */
contract SmartSonicSubscription is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    // Subscription price: 1 S token
    uint256 public constant SUBSCRIPTION_PRICE = 1 ether;
    
    // Subscription duration: 30 days
    uint256 public constant SUBSCRIPTION_DURATION = 30 days;
    
    // Counter for subscription IDs
    Counters.Counter private _subscriptionIds;
    
    // Subscription structure
    struct Subscription {
        uint256 id;
        address user;
        uint256 startTime;
        uint256 endTime;
        bool active;
        uint256 operations;
        uint256 totalSpent;
    }
    
    // Mappings
    mapping(address => Subscription) public subscriptions;
    mapping(address => bool) public hasActiveSubscription;
    mapping(address => uint256[]) public userSubscriptionHistory;
    
    // Events
    event SubscriptionPurchased(
        address indexed user, 
        uint256 indexed subscriptionId, 
        uint256 startTime, 
        uint256 endTime
    );
    
    event SubscriptionRenewed(
        address indexed user, 
        uint256 indexed subscriptionId, 
        uint256 newEndTime
    );
    
    event OperationExecuted(
        address indexed user, 
        string operationType, 
        uint256 gasCost
    );
    
    event FundsWithdrawn(address indexed owner, uint256 amount);
    
    constructor() {}
    
    /**
     * @dev Purchase a new subscription for 1 S token
     */
    function purchaseSubscription() external payable nonReentrant {
        require(msg.value == SUBSCRIPTION_PRICE, "Incorrect payment amount");
        
        _subscriptionIds.increment();
        uint256 subscriptionId = _subscriptionIds.current();
        
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + SUBSCRIPTION_DURATION;
        
        // Create new subscription
        subscriptions[msg.sender] = Subscription({
            id: subscriptionId,
            user: msg.sender,
            startTime: startTime,
            endTime: endTime,
            active: true,
            operations: 0,
            totalSpent: msg.value
        });
        
        hasActiveSubscription[msg.sender] = true;
        userSubscriptionHistory[msg.sender].push(subscriptionId);
        
        emit SubscriptionPurchased(msg.sender, subscriptionId, startTime, endTime);
    }
    
    /**
     * @dev Renew existing subscription
     */
    function renewSubscription() external payable nonReentrant {
        require(msg.value == SUBSCRIPTION_PRICE, "Incorrect payment amount");
        require(subscriptions[msg.sender].user == msg.sender, "No existing subscription");
        
        Subscription storage sub = subscriptions[msg.sender];
        
        // Extend subscription duration
        if (block.timestamp > sub.endTime) {
            // Expired subscription - start fresh
            sub.startTime = block.timestamp;
            sub.endTime = block.timestamp + SUBSCRIPTION_DURATION;
        } else {
            // Active subscription - extend end time
            sub.endTime += SUBSCRIPTION_DURATION;
        }
        
        sub.active = true;
        sub.totalSpent += msg.value;
        hasActiveSubscription[msg.sender] = true;
        
        emit SubscriptionRenewed(msg.sender, sub.id, sub.endTime);
    }
    
    /**
     * @dev Check if user has active subscription
     */
    function isSubscriptionActive(address user) external view returns (bool) {
        if (!hasActiveSubscription[user]) return false;
        
        Subscription memory sub = subscriptions[user];
        return sub.active && block.timestamp <= sub.endTime;
    }
    
    /**
     * @dev Get subscription details for user
     */
    function getSubscription(address user) external view returns (Subscription memory) {
        return subscriptions[user];
    }
    
    /**
     * @dev Record AI operation execution (called by backend)
     */
    function recordOperation(
        address user, 
        string calldata operationType, 
        uint256 gasCost
    ) external onlyOwner {
        require(this.isSubscriptionActive(user), "No active subscription");
        
        subscriptions[user].operations++;
        
        emit OperationExecuted(user, operationType, gasCost);
    }
    
    /**
     * @dev Get user's operation count
     */
    function getUserOperations(address user) external view returns (uint256) {
        return subscriptions[user].operations;
    }
    
    /**
     * @dev Check subscription time remaining
     */
    function getTimeRemaining(address user) external view returns (uint256) {
        if (!this.isSubscriptionActive(user)) return 0;
        
        Subscription memory sub = subscriptions[user];
        if (block.timestamp >= sub.endTime) return 0;
        
        return sub.endTime - block.timestamp;
    }
    
    /**
     * @dev Get total subscribers count
     */
    function getTotalSubscribers() external view returns (uint256) {
        return _subscriptionIds.current();
    }
    
    /**
     * @dev Get contract balance
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Withdraw funds (owner only)
     */
    function withdrawFunds() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
        
        emit FundsWithdrawn(owner(), balance);
    }
    
    /**
     * @dev Emergency pause subscription (owner only)
     */
    function pauseSubscription(address user) external onlyOwner {
        subscriptions[user].active = false;
        hasActiveSubscription[user] = false;
    }
    
    /**
     * @dev Get user subscription history
     */
    function getUserSubscriptionHistory(address user) external view returns (uint256[] memory) {
        return userSubscriptionHistory[user];
    }
}