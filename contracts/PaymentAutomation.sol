// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title PaymentAutomation
 * @dev Smart contract for automated recurring payments on Sonic Network with FeeM optimization
 */
contract PaymentAutomation {
    struct RecurringPayment {
        address payer;
        address payee;
        uint256 amount;
        uint256 interval; // in seconds
        uint256 nextPayment;
        bool isActive;
        string description;
    }
    
    struct BulkPayment {
        address payer;
        address[] recipients;
        uint256[] amounts;
        bool executed;
        string description;
    }
    
    mapping(uint256 => RecurringPayment) public recurringPayments;
    mapping(uint256 => BulkPayment) public bulkPayments;
    mapping(address => uint256[]) public userPayments;
    
    uint256 public nextPaymentId = 1;
    uint256 public nextBulkId = 1;
    
    event RecurringPaymentCreated(uint256 indexed paymentId, address indexed payer, address indexed payee, uint256 amount);
    event PaymentExecuted(uint256 indexed paymentId, address indexed payer, address indexed payee, uint256 amount);
    event BulkPaymentCreated(uint256 indexed bulkId, address indexed payer, uint256 recipientCount);
    event BulkPaymentExecuted(uint256 indexed bulkId, address indexed payer, uint256 totalAmount);
    
    /**
     * @dev Create a recurring payment schedule
     * @param payee Recipient address
     * @param amount Payment amount in wei
     * @param interval Payment interval in seconds
     * @param description Payment description
     */
    function createRecurringPayment(
        address payee,
        uint256 amount,
        uint256 interval,
        string memory description
    ) external returns (uint256) {
        require(payee != address(0), "Invalid payee address");
        require(amount > 0, "Amount must be greater than 0");
        require(interval > 0, "Interval must be greater than 0");
        
        uint256 paymentId = nextPaymentId++;
        
        recurringPayments[paymentId] = RecurringPayment({
            payer: msg.sender,
            payee: payee,
            amount: amount,
            interval: interval,
            nextPayment: block.timestamp + interval,
            isActive: true,
            description: description
        });
        
        userPayments[msg.sender].push(paymentId);
        
        emit RecurringPaymentCreated(paymentId, msg.sender, payee, amount);
        return paymentId;
    }
    
    /**
     * @dev Execute a recurring payment (can be called by anyone)
     * @param paymentId Payment ID to execute
     */
    function executeRecurringPayment(uint256 paymentId) external {
        RecurringPayment storage payment = recurringPayments[paymentId];
        
        require(payment.isActive, "Payment is not active");
        require(block.timestamp >= payment.nextPayment, "Payment not due yet");
        require(payment.payer.balance >= payment.amount, "Insufficient balance");
        
        // Update next payment time
        payment.nextPayment = block.timestamp + payment.interval;
        
        // Execute payment
        payable(payment.payee).transfer(payment.amount);
        
        emit PaymentExecuted(paymentId, payment.payer, payment.payee, payment.amount);
    }
    
    /**
     * @dev Create bulk payment to multiple recipients
     * @param recipients Array of recipient addresses
     * @param amounts Array of payment amounts
     * @param description Payment description
     */
    function createBulkPayment(
        address[] memory recipients,
        uint256[] memory amounts,
        string memory description
    ) external payable returns (uint256) {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        require(recipients.length > 0, "No recipients provided");
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        
        require(msg.value >= totalAmount, "Insufficient payment");
        
        uint256 bulkId = nextBulkId++;
        
        bulkPayments[bulkId] = BulkPayment({
            payer: msg.sender,
            recipients: recipients,
            amounts: amounts,
            executed: false,
            description: description
        });
        
        emit BulkPaymentCreated(bulkId, msg.sender, recipients.length);
        return bulkId;
    }
    
    /**
     * @dev Execute bulk payment
     * @param bulkId Bulk payment ID to execute
     */
    function executeBulkPayment(uint256 bulkId) external {
        BulkPayment storage bulk = bulkPayments[bulkId];
        
        require(!bulk.executed, "Bulk payment already executed");
        require(bulk.payer == msg.sender, "Only payer can execute");
        
        bulk.executed = true;
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < bulk.recipients.length; i++) {
            payable(bulk.recipients[i]).transfer(bulk.amounts[i]);
            totalAmount += bulk.amounts[i];
        }
        
        emit BulkPaymentExecuted(bulkId, msg.sender, totalAmount);
    }
    
    /**
     * @dev Cancel recurring payment
     * @param paymentId Payment ID to cancel
     */
    function cancelRecurringPayment(uint256 paymentId) external {
        RecurringPayment storage payment = recurringPayments[paymentId];
        require(payment.payer == msg.sender, "Only payer can cancel");
        
        payment.isActive = false;
    }
    
    /**
     * @dev Get user's recurring payments
     * @param user User address
     */
    function getUserPayments(address user) external view returns (uint256[] memory) {
        return userPayments[user];
    }
    
    /**
     * @dev Check if payment is due
     * @param paymentId Payment ID to check
     */
    function isPaymentDue(uint256 paymentId) external view returns (bool) {
        RecurringPayment memory payment = recurringPayments[paymentId];
        return payment.isActive && block.timestamp >= payment.nextPayment;
    }
}