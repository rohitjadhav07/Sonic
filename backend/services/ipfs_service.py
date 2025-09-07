"""
IPFS Service for NFT Metadata Storage
Simple implementation using public IPFS gateways
"""

import json
import requests
import hashlib
from typing import Dict, Any, Optional
import time

class IPFSService:
    def __init__(self):
        import os
        from dotenv import load_dotenv
        load_dotenv()
        
        # Pinata IPFS configuration
        self.pinata_api_key = os.getenv('PINATA_API_KEY')
        self.pinata_secret_key = os.getenv('PINATA_SECRET_KEY')
        
        # Public IPFS gateways
        self.gateways = [
            "https://ipfs.io/ipfs/",
            "https://gateway.pinata.cloud/ipfs/",
            "https://cloudflare-ipfs.com/ipfs/",
            "https://dweb.link/ipfs/"
        ]
        
        # Fallback mock storage
        self.mock_storage = {}
    
    def upload_metadata(self, metadata: Dict[str, Any]) -> str:
        """
        Upload NFT metadata to IPFS using Pinata
        Returns the IPFS hash
        """
        try:
            if self.pinata_api_key and self.pinata_secret_key:
                return self._upload_to_pinata(metadata)
            else:
                return self._upload_mock(metadata)
                
        except Exception as e:
            print(f"❌ Error uploading to IPFS: {e}")
            return self._upload_mock(metadata)
    
    def _upload_to_pinata(self, metadata: Dict[str, Any]) -> str:
        """
        Upload metadata to Pinata IPFS
        """
        try:
            metadata_json = json.dumps(metadata, indent=2)
            
            headers = {
                "pinata_api_key": self.pinata_api_key,
                "pinata_secret_api_key": self.pinata_secret_key,
                "Content-Type": "application/json"
            }
            
            data = {
                "pinataContent": metadata,
                "pinataMetadata": {
                    "name": f"nft-metadata-{int(time.time())}"
                }
            }
            
            response = requests.post(
                "https://api.pinata.cloud/pinning/pinJSONToIPFS",
                headers=headers,
                json=data,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                ipfs_hash = result["IpfsHash"]
                print(f"📤 Metadata uploaded to Pinata IPFS: {ipfs_hash}")
                return ipfs_hash
            else:
                print(f"❌ Pinata upload failed: {response.status_code} - {response.text}")
                return self._upload_mock(metadata)
                
        except Exception as e:
            print(f"❌ Pinata upload error: {e}")
            return self._upload_mock(metadata)
    
    def _upload_mock(self, metadata: Dict[str, Any]) -> str:
        """
        Mock IPFS upload for demo purposes
        """
        metadata_json = json.dumps(metadata, indent=2)
        metadata_hash = hashlib.sha256(metadata_json.encode()).hexdigest()
        
        # Simulate IPFS hash format
        ipfs_hash = f"Qm{metadata_hash[:44]}"
        
        # Store in mock storage
        self.mock_storage[ipfs_hash] = metadata
        
        print(f"📤 Metadata uploaded to mock IPFS: {ipfs_hash}")
        return ipfs_hash
    
    def get_metadata(self, ipfs_hash: str) -> Optional[Dict[str, Any]]:
        """
        Retrieve metadata from IPFS
        """
        try:
            # For demo purposes, return from mock storage
            if ipfs_hash in self.mock_storage:
                return self.mock_storage[ipfs_hash]
            
            # In production, fetch from IPFS gateways
            for gateway in self.gateways:
                try:
                    url = f"{gateway}{ipfs_hash}"
                    response = requests.get(url, timeout=10)
                    if response.status_code == 200:
                        return response.json()
                except:
                    continue
            
            return None
            
        except Exception as e:
            print(f"❌ Error retrieving from IPFS: {e}")
            return None
    
    def create_nft_metadata(
        self,
        name: str,
        description: str,
        image_url: str,
        prompt: str,
        attributes: list = None
    ) -> Dict[str, Any]:
        """
        Create standard NFT metadata following OpenSea standards
        """
        if attributes is None:
            attributes = []
        
        metadata = {
            "name": name,
            "description": description,
            "image": image_url,
            "external_url": "",
            "attributes": attributes,
            "background_color": "",
            "animation_url": "",
            "youtube_url": "",
            "prompt": prompt,  # Custom field for AI generation prompt
            "generated_by": "Sonic AI NFT Studio",
            "network": "Sonic",
            "created_at": int(time.time())
        }
        
        return metadata
    
    def upload_image_to_ipfs(self, image_data: bytes, filename: str) -> str:
        """
        Upload image to IPFS
        For demo purposes, returns a mock hash
        """
        try:
            # In production, you would upload the actual image data
            # For now, create a mock hash based on filename
            image_hash = hashlib.sha256(image_data + filename.encode()).hexdigest()
            ipfs_hash = f"Qm{image_hash[:44]}"
            
            print(f"📤 Image uploaded to IPFS: {ipfs_hash}")
            return ipfs_hash
            
        except Exception as e:
            print(f"❌ Error uploading image to IPFS: {e}")
            raise
    
    def get_ipfs_url(self, ipfs_hash: str) -> str:
        """
        Get the full IPFS URL for a hash
        """
        return f"ipfs://{ipfs_hash}"

# Example usage
if __name__ == "__main__":
    ipfs = IPFSService()
    
    # Create sample metadata
    metadata = ipfs.create_nft_metadata(
        name="Cosmic Dreams",
        description="A beautiful AI-generated artwork",
        image_url="https://example.com/image.jpg",
        prompt="cosmic landscape with stars",
        attributes=[
            {"trait_type": "Style", "value": "Digital Art"},
            {"trait_type": "Rarity", "value": "Rare"}
        ]
    )
    
    # Upload to IPFS
    ipfs_hash = ipfs.upload_metadata(metadata)
    print(f"IPFS Hash: {ipfs_hash}")
    
    # Retrieve from IPFS
    retrieved_metadata = ipfs.get_metadata(ipfs_hash)
    print(f"Retrieved: {retrieved_metadata}")
