"""
Sonic Network Configuration for Astra AI Backend
Official network details and RPC endpoints
"""

import os
from typing import Dict, Any

# Sonic Testnet Configuration
SONIC_TESTNET = {
    "chain_id": 14601,
    "name": "Sonic Testnet Network",
    "network": "sonic-testnet",
    "rpc_url": os.getenv("SONIC_TESTNET_RPC_URL", "https://rpc.testnet.soniclabs.com"),
    "ws_url": os.getenv("SONIC_TESTNET_WS_URL", "wss://rpc.testnet.soniclabs.com"),
    "explorer_url": "https://testnet.sonicscan.org",
    "explorer_api": "https://testnet.sonicscan.org/api",
    "faucet_url": "https://testnet.sonicscan.org/faucet",
    "native_currency": {
        "name": "Sonic",
        "symbol": "S",
        "decimals": 18
    },
    "contracts": {
        "multicall3": "0xcA11bde05977b3631167028862bE2a173976CA11"
    },
    "features": {
        "fee_market": True,
        "eip1559": True,
        "sub_second_finality": True,
        "average_block_time": 0.4,  # seconds
        "tps": 10000,
        "gas_optimization": 95  # percentage reduction vs traditional chains
    }
}

# Sonic Mainnet Configuration
SONIC_MAINNET = {
    "chain_id": 146,
    "name": "Sonic Mainnet",
    "network": "sonic-mainnet",
    "rpc_url": os.getenv("SONIC_MAINNET_RPC_URL", "https://rpc.soniclabs.com"),
    "ws_url": os.getenv("SONIC_MAINNET_WS_URL", "wss://rpc.soniclabs.com"),
    "explorer_url": "https://soniclabs.com",
    "explorer_api": "https://soniclabs.com/api",
    "native_currency": {
        "name": "Sonic",
        "symbol": "S",
        "decimals": 18
    },
    "contracts": {
        "multicall3": "0xcA11bde05977b3631167028862bE2a173976CA11"
    },
    "features": {
        "fee_market": True,
        "eip1559": True,
        "sub_second_finality": True,
        "average_block_time": 0.4,  # seconds
        "tps": 10000,
        "gas_optimization": 95  # percentage reduction vs traditional chains
    }
}

# Default network (testnet for development)
DEFAULT_NETWORK = SONIC_TESTNET

def get_network_config(network: str = "testnet") -> Dict[str, Any]:
    """
    Get network configuration by name
    
    Args:
        network: Network name ("testnet" or "mainnet")
        
    Returns:
        Network configuration dictionary
    """
    if network.lower() in ["testnet", "test", "sonic-testnet"]:
        return SONIC_TESTNET
    elif network.lower() in ["mainnet", "main", "sonic-mainnet"]:
        return SONIC_MAINNET
    else:
        raise ValueError(f"Unknown network: {network}")

def get_rpc_url(network: str = "testnet") -> str:
    """Get RPC URL for specified network"""
    config = get_network_config(network)
    return config["rpc_url"]

def get_ws_url(network: str = "testnet") -> str:
    """Get WebSocket URL for specified network"""
    config = get_network_config(network)
    return config["ws_url"]

def get_explorer_url(network: str = "testnet") -> str:
    """Get block explorer URL for specified network"""
    config = get_network_config(network)
    return config["explorer_url"]

def get_chain_id(network: str = "testnet") -> int:
    """Get chain ID for specified network"""
    config = get_network_config(network)
    return config["chain_id"]

# Gas price estimation helpers for Sonic's FeeM
def estimate_gas_price(network: str = "testnet") -> Dict[str, Any]:
    """
    Estimate gas prices using Sonic's FeeM optimization
    
    Returns:
        Gas price recommendations in Gwei
    """
    # These are example values - in production, fetch from Sonic's FeeM API
    base_prices = {
        "testnet": {
            "slow": 0.1,      # Gwei
            "standard": 0.15,  # Gwei  
            "fast": 0.2,      # Gwei
            "instant": 0.25   # Gwei
        },
        "mainnet": {
            "slow": 0.5,      # Gwei
            "standard": 0.75,  # Gwei
            "fast": 1.0,      # Gwei
            "instant": 1.25   # Gwei
        }
    }
    
    network_key = "testnet" if network in ["testnet", "test", "sonic-testnet"] else "mainnet"
    prices = base_prices[network_key]
    
    return {
        "network": network,
        "prices": prices,
        "optimization": "95% lower than traditional chains",
        "finality": "Sub-second confirmation",
        "recommended": prices["standard"]
    }

# Network status and health check
def get_network_status(network: str = "testnet") -> Dict[str, Any]:
    """
    Get network status and performance metrics
    
    Returns:
        Network status information
    """
    config = get_network_config(network)
    
    return {
        "network": config["name"],
        "chain_id": config["chain_id"],
        "status": "healthy",  # In production, check actual network status
        "block_time": f"{config['features']['average_block_time']}s",
        "tps": f"{config['features']['tps']}+",
        "gas_optimization": f"{config['features']['gas_optimization']}%",
        "finality": "Sub-second",
        "rpc_url": config["rpc_url"],
        "explorer": config["explorer_url"]
    }