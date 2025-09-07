"""
NFT Service for handling NFT operations
"""

import json
import time
from typing import Dict, Any, List, Optional
from ipfs_service import IPFSService

class NFTService:
    def __init__(self):
        self.ipfs_service = IPFSService()
        self.nft_storage = {}  # In production, use a proper database
    
    def generate_nft_metadata(
        self,
        prompt: str,
        image_url: str,
        user_address: str
    ) -> Dict[str, Any]:
        """
        Generate NFT metadata from prompt and image
        """
        try:
            # Generate name from prompt
            name = self._generate_name_from_prompt(prompt)
            
            # Generate description
            description = self._generate_description_from_prompt(prompt)
            
            # Generate attributes
            attributes = self._generate_attributes_from_prompt(prompt)
            
            # Create metadata
            metadata = self.ipfs_service.create_nft_metadata(
                name=name,
                description=description,
                image_url=image_url,
                prompt=prompt,
                attributes=attributes
            )
            
            return {
                "success": True,
                "metadata": metadata,
                "name": name,
                "description": description,
                "attributes": attributes
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def store_nft_metadata(self, metadata: Dict[str, Any]) -> str:
        """
        Store NFT metadata on IPFS and return hash
        """
        try:
            ipfs_hash = self.ipfs_service.upload_metadata(metadata)
            return ipfs_hash
        except Exception as e:
            raise Exception(f"Failed to store metadata: {str(e)}")
    
    def create_nft_record(
        self,
        token_id: int,
        owner_address: str,
        ipfs_hash: str,
        metadata: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Create an NFT record in the database
        """
        nft_record = {
            "token_id": token_id,
            "owner": owner_address,
            "ipfs_hash": ipfs_hash,
            "metadata": metadata,
            "created_at": int(time.time()),
            "likes": 0,
            "views": 0,
            "is_listed": False,
            "price": None
        }
        
        # Store in mock database
        self.nft_storage[str(token_id)] = nft_record
        
        return nft_record
    
    def get_nft_by_token_id(self, token_id: int) -> Optional[Dict[str, Any]]:
        """
        Get NFT by token ID
        """
        return self.nft_storage.get(str(token_id))
    
    def get_nfts_by_owner(self, owner_address: str) -> List[Dict[str, Any]]:
        """
        Get all NFTs owned by an address
        """
        nfts = []
        for token_id, nft in self.nft_storage.items():
            if nft["owner"].lower() == owner_address.lower():
                nfts.append(nft)
        return nfts
    
    def get_all_nfts(self, limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
        """
        Get all NFTs with pagination
        """
        all_nfts = list(self.nft_storage.values())
        # Sort by creation time (newest first)
        all_nfts.sort(key=lambda x: x["created_at"], reverse=True)
        
        return all_nfts[offset:offset + limit]
    
    def update_nft_stats(self, token_id: int, likes: int = None, views: int = None):
        """
        Update NFT statistics
        """
        if str(token_id) in self.nft_storage:
            if likes is not None:
                self.nft_storage[str(token_id)]["likes"] = likes
            if views is not None:
                self.nft_storage[str(token_id)]["views"] = views
    
    def _generate_name_from_prompt(self, prompt: str) -> str:
        """
        Generate a creative name from the prompt
        """
        words = prompt.split()
        if len(words) >= 2:
            # Take first two meaningful words
            name_words = [word.capitalize() for word in words[:2] if len(word) > 3]
            if name_words:
                return " ".join(name_words)
        
        # Fallback to first word + suffix
        first_word = words[0].capitalize() if words else "Artwork"
        suffixes = ["Dream", "Vision", "Creation", "Art", "Design", "Masterpiece"]
        import random
        suffix = random.choice(suffixes)
        
        return f"{first_word} {suffix}"
    
    def _generate_description_from_prompt(self, prompt: str) -> str:
        """
        Generate a description from the prompt
        """
        return f"AI-generated artwork created from the prompt: '{prompt}'. This unique digital creation showcases the power of artificial intelligence in artistic expression, minted on the Sonic Network for lightning-fast transactions and minimal fees."
    
    def _generate_attributes_from_prompt(self, prompt: str) -> List[Dict[str, str]]:
        """
        Generate attributes from the prompt
        """
        attributes = []
        prompt_lower = prompt.lower()
        
        # Style detection
        if "cyberpunk" in prompt_lower:
            attributes.append({"trait_type": "Style", "value": "Cyberpunk"})
        elif "fantasy" in prompt_lower:
            attributes.append({"trait_type": "Style", "value": "Fantasy"})
        elif "abstract" in prompt_lower:
            attributes.append({"trait_type": "Style", "value": "Abstract"})
        elif "realistic" in prompt_lower:
            attributes.append({"trait_type": "Style", "value": "Realistic"})
        else:
            attributes.append({"trait_type": "Style", "value": "Digital Art"})
        
        # Color detection
        colors = ["blue", "red", "green", "purple", "yellow", "orange", "pink", "black", "white"]
        detected_colors = [color for color in colors if color in prompt_lower]
        if detected_colors:
            attributes.append({"trait_type": "Primary Color", "value": detected_colors[0].capitalize()})
        else:
            attributes.append({"trait_type": "Primary Color", "value": "Mixed"})
        
        # Rarity (random for demo)
        import random
        rarity_weights = [0.6, 0.3, 0.1]  # 60% common, 30% rare, 10% legendary
        rarity = random.choices(["Common", "Rare", "Legendary"], weights=rarity_weights)[0]
        attributes.append({"trait_type": "Rarity", "value": rarity})
        
        # Generation method
        attributes.append({"trait_type": "Generation", "value": "AI Generated"})
        attributes.append({"trait_type": "Network", "value": "Sonic"})
        
        return attributes

# Example usage
if __name__ == "__main__":
    nft_service = NFTService()
    
    # Generate metadata
    result = nft_service.generate_nft_metadata(
        prompt="cyberpunk city at sunset",
        image_url="https://example.com/image.jpg",
        user_address="0x742d35Cc6634C0532925a3b8D4C9db96590c6C87"
    )
    
    print("Generated metadata:", json.dumps(result, indent=2))
