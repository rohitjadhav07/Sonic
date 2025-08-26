import google.generativeai as genai
import os
import re
from typing import Dict, Any, Optional

class AIService:
    def __init__(self):
        # Configure Gemini AI
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
        self.model = genai.GenerativeModel('gemini-pro')
        
        # Intent patterns for command recognition
        self.intent_patterns = {
            "balance": [
                r"show.*balance", r"check.*balance", r"my.*balance",
                r"how much.*s.*token", r"wallet.*balance", r"s.*balance"
            ],
            "send": [
                r"send.*s.*token", r"transfer.*s.*token", r"pay.*s.*token",
                r"send.*to", r"transfer.*to", r"send.*s"
            ],
            "payment_link": [
                r"payment.*link", r"create.*link", r"generate.*link",
                r"payment.*request", r"invoice"
            ],
            "transaction": [
                r"transaction.*status", r"check.*transaction", r"tx.*status",
                r"swap.*status", r"transaction.*[0-9a-fA-F]+"
            ],
            "news": [
                r"sonic.*news", r"latest.*news", r"market.*update",
                r"what.*happening", r"s.*token.*price", r"sonic.*price"
            ],
            "nft": [
                r"create.*nft", r"generate.*nft", r"mint.*nft",
                r"create.*art", r"generate.*art"
            ],
            "feem": [
                r"feem.*rate", r"fee.*market", r"gas.*price",
                r"current.*feem", r"sonic.*fees"
            ]
        }

    async def process_message(self, message: str, user_address: Optional[str] = None) -> Dict[str, Any]:
        """Process user message and return AI response with intent"""
        
        # Detect intent
        intent = self._detect_intent(message)
        
        # Create context-aware prompt
        prompt = self._create_prompt(message, intent, user_address)
        
        try:
            # Generate AI response
            response = self.model.generate_content(prompt)
            
            # Extract structured data from response
            structured_response = self._parse_response(response.text, intent, message)
            
            return structured_response
            
        except Exception as e:
            return {
                "text": "I'm experiencing some technical difficulties. Please try again in a moment.",
                "intent": "error",
                "error": str(e)
            }

    def _detect_intent(self, message: str) -> str:
        """Detect user intent from message"""
        message_lower = message.lower()
        
        for intent, patterns in self.intent_patterns.items():
            for pattern in patterns:
                if re.search(pattern, message_lower):
                    return intent
        
        return "general"

    def _create_prompt(self, message: str, intent: str, user_address: Optional[str]) -> str:
        """Create context-aware prompt for Gemini"""
        
        base_context = """
        You are Smart Sonic, an AI blockchain agent for Sonic - the fastest, most builder-aligned blockchain. 
        You help users manage their crypto wallets, execute lightning-fast transactions, and navigate Web3 
        through natural conversation with FeeM optimization.
        
        Key capabilities:
        - Check S token balances and portfolio with real-time updates
        - Send S token transactions with sub-second confirmation
        - Create payment links with QR codes and instant settlement
        - Track transaction status with Sonic's speed metrics
        - Generate NFTs and artwork with instant minting
        - Provide Sonic Network news, FeeM rates, and market updates
        - Schedule automated payments leveraging Sonic's low-cost infrastructure
        - Optimize gas usage through Sonic's advanced Fee Market (FeeM)
        
        Always respond in a friendly, helpful manner. Keep responses concise but informative.
        Emphasize Sonic's speed and cost advantages when relevant.
        """
        
        intent_context = {
            "balance": "The user wants to check their S token balance. Provide current balance information with Sonic network details.",
            "send": "The user wants to send S tokens. Guide them through the lightning-fast transaction process on Sonic.",
            "payment_link": "The user wants to create a payment link. Help them generate a shareable payment request with instant settlement.",
            "transaction": "The user wants to check transaction status. Provide transaction details with Sonic's speed metrics.",
            "news": "The user wants Sonic Network news. Provide latest updates, S token price, and ecosystem information.",
            "nft": "The user wants to create NFT content. Help them generate digital artwork with instant minting on Sonic.",
            "feem": "The user wants FeeM information. Provide current fee market rates and gas optimization tips for Sonic.",
        }
        
        context = base_context
        if intent in intent_context:
            context += f"\n\nCurrent task: {intent_context[intent]}"
        
        if user_address:
            context += f"\n\nUser wallet address: {user_address}"
        
        prompt = f"{context}\n\nUser message: {message}\n\nResponse:"
        
        return prompt

    def _parse_response(self, response_text: str, intent: str, original_message: str) -> Dict[str, Any]:
        """Parse AI response and extract structured data"""
        
        result = {
            "text": response_text,
            "intent": intent
        }
        
        # Extract specific data based on intent
        if intent == "send":
            # Extract amount and recipient from message
            amount_match = re.search(r'(\d+\.?\d*)\s*s(?:\s+token)?', original_message.lower())
            if amount_match:
                result["amount"] = float(amount_match.group(1))
            
            # Extract recipient address or identifier
            to_match = re.search(r'to\s+([a-zA-Z0-9]+)', original_message.lower())
            if to_match:
                result["recipient"] = to_match.group(1)
        
        elif intent == "payment_link":
            # Extract payment amount
            amount_match = re.search(r'(\d+\.?\d*)\s*s(?:\s+token)?', original_message.lower())
            if amount_match:
                result["amount"] = float(amount_match.group(1))
                result["token"] = "S"
        
        elif intent == "transaction":
            # Extract transaction hash
            tx_match = re.search(r'([0-9a-fA-F]{64}|[0-9a-fA-F]{40})', original_message)
            if tx_match:
                result["tx_hash"] = tx_match.group(1)
        
        return result