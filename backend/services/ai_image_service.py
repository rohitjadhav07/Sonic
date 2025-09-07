"""
AI Image Generation Service
Supports multiple AI providers for NFT image generation
"""

import os
import asyncio
import aiohttp
import base64
from typing import Optional, Dict, Any
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class AIImageService:
    def __init__(self):
        self.openai_api_key = os.getenv('OPENAI_API_KEY')
        self.stability_api_key = os.getenv('STABILITY_API_KEY')
        self.replicate_api_token = os.getenv('REPLICATE_API_TOKEN')
        self.huggingface_api_key = os.getenv('HUGGINGFACE_API_KEY')
    
    async def generate_image(self, prompt: str, provider: str = "stability") -> Dict[str, Any]:
        """
        Generate AI image from text prompt
        """
        try:
            if provider == "stability" and self.stability_api_key:
                return await self._generate_with_stability(prompt)
            elif provider == "openai" and self.openai_api_key:
                return await self._generate_with_openai(prompt)
            elif provider == "replicate" and self.replicate_api_token:
                return await self._generate_with_replicate(prompt)
            elif provider == "huggingface" and self.huggingface_api_key:
                return await self._generate_with_huggingface(prompt)
            else:
                # Fallback to mock image
                return await self._generate_mock_image(prompt)
                
        except Exception as e:
            print(f"Error generating image with {provider}: {e}")
            return await self._generate_mock_image(prompt)
    
    async def _generate_with_openai(self, prompt: str) -> Dict[str, Any]:
        """
        Generate image using OpenAI DALL-E 3
        """
        try:
            import openai
            
            client = openai.AsyncOpenAI(api_key=self.openai_api_key)
            
            # Enhanced prompt for better NFT results
            enhanced_prompt = f"Create a stunning digital artwork NFT: {prompt}. High quality, detailed, artistic style, suitable for blockchain NFT collection."
            
            response = await client.images.generate(
                model="dall-e-3",
                prompt=enhanced_prompt,
                size="1024x1024",
                quality="standard",
                n=1,
            )
            
            image_url = response.data[0].url
            
            return {
                "success": True,
                "image_url": image_url,
                "provider": "openai",
                "model": "dall-e-3",
                "prompt_used": enhanced_prompt
            }
            
        except Exception as e:
            print(f"OpenAI generation failed: {e}")
            return await self._generate_mock_image(prompt)
    
    async def _generate_with_stability(self, prompt: str) -> Dict[str, Any]:
        """
        Generate image using Stability AI SDXL
        """
        try:
            import base64
            
            # Enhanced prompt for better NFT results
            enhanced_prompt = f"Create a stunning digital artwork NFT: {prompt}. High quality, detailed, artistic style, suitable for blockchain NFT collection."
            
            headers = {
                "Authorization": f"Bearer {self.stability_api_key}",
                "Content-Type": "application/json"
            }
            
            data = {
                "text_prompts": [
                    {
                        "text": enhanced_prompt,
                        "weight": 1
                    }
                ],
                "cfg_scale": 7,
                "height": 1024,
                "width": 1024,
                "samples": 1,
                "steps": 20,
                "style_preset": "digital-art"
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
                    headers=headers,
                    json=data
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        
                        # Get the base64 image data
                        image_data = result["artifacts"][0]["base64"]
                        
                        # Convert to image URL (in production, upload to IPFS)
                        # For now, we'll use a data URL
                        image_url = f"data:image/png;base64,{image_data}"
                        
                        return {
                            "success": True,
                            "image_url": image_url,
                            "image_base64": image_data,
                            "provider": "stability",
                            "model": "stable-diffusion-xl-1024-v1-0",
                            "prompt_used": enhanced_prompt
                        }
                    else:
                        error_text = await response.text()
                        print(f"Stability AI API error: {response.status} - {error_text}")
                        return await self._generate_mock_image(prompt)
            
        except Exception as e:
            print(f"Stability AI generation failed: {e}")
            return await self._generate_mock_image(prompt)
    
    async def _generate_with_replicate(self, prompt: str) -> Dict[str, Any]:
        """
        Generate image using Replicate
        """
        try:
            import replicate
            
            # Use SDXL model on Replicate
            output = await replicate.async_run(
                "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
                input={
                    "prompt": f"Create a stunning digital artwork NFT: {prompt}. High quality, detailed, artistic style.",
                    "width": 1024,
                    "height": 1024,
                    "num_inference_steps": 20,
                    "guidance_scale": 7.5
                }
            )
            
            return {
                "success": True,
                "image_url": output[0],
                "provider": "replicate",
                "model": "sdxl",
                "prompt_used": prompt
            }
            
        except Exception as e:
            print(f"Replicate generation failed: {e}")
            return await self._generate_mock_image(prompt)
    
    async def _generate_with_huggingface(self, prompt: str) -> Dict[str, Any]:
        """
        Generate image using Hugging Face
        """
        try:
            headers = {"Authorization": f"Bearer {self.huggingface_api_key}"}
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
                    headers=headers,
                    json={"inputs": f"Create a stunning digital artwork NFT: {prompt}. High quality, detailed, artistic style."}
                ) as response:
                    if response.status == 200:
                        image_data = await response.read()
                        # Convert to base64 for storage
                        image_base64 = base64.b64encode(image_data).decode()
                        
                        return {
                            "success": True,
                            "image_base64": image_base64,
                            "provider": "huggingface",
                            "model": "stable-diffusion-xl",
                            "prompt_used": prompt
                        }
                    else:
                        return await self._generate_mock_image(prompt)
                        
        except Exception as e:
            print(f"Hugging Face generation failed: {e}")
            return await self._generate_mock_image(prompt)
    
    async def _generate_mock_image(self, prompt: str) -> Dict[str, Any]:
        """
        Generate mock image for demo purposes
        """
        # Create a unique image URL based on prompt
        import hashlib
        prompt_hash = hashlib.md5(prompt.encode()).hexdigest()
        
        # Use Unsplash for better demo images
        image_url = f"https://picsum.photos/1024/1024?random={prompt_hash[:8]}"
        
        return {
            "success": True,
            "image_url": image_url,
            "provider": "mock",
            "model": "picsum",
            "prompt_used": prompt,
            "note": "Using mock image. Set up AI API keys for real generation."
        }
    
    def get_available_providers(self) -> Dict[str, bool]:
        """
        Check which AI providers are available
        """
        return {
            "openai": bool(self.openai_api_key),
            "stability": bool(self.stability_api_key),
            "replicate": bool(self.replicate_api_token),
            "huggingface": bool(self.huggingface_api_key)
        }

# Example usage
if __name__ == "__main__":
    import asyncio
    
    async def test_generation():
        ai_service = AIImageService()
        
        # Test with different providers
        providers = ai_service.get_available_providers()
        print("Available providers:", providers)
        
        # Generate image
        result = await ai_service.generate_image("cyberpunk city at sunset")
        print("Generation result:", result)
    
    asyncio.run(test_generation())
