"""
Legiit Automation API - Python Example

Requirements:
    pip install requests

Run:
    python examples/python-example.py
"""

import requests
import json
import sys
from typing import Dict, Optional

# Configuration
API_BASE_URL = "http://localhost:3000"


def check_health() -> Dict:
    """
    Check if the API server is running
    
    Returns:
        Health status dictionary
    """
    try:
        response = requests.get(f"{API_BASE_URL}/health")
        response.raise_for_status()
        health = response.json()
        print(f"🏥 API Health: {health['status']}")
        return health
    except requests.RequestException as e:
        print(f"❌ Health check failed: {e}")
        raise


def purchase_service(domain: str, business_name: str, address: str) -> Dict:
    """
    Purchase a Legiit service using the Standard package
    
    Args:
        domain: Business domain/website
        business_name: Official business name
        address: Full business address
    
    Returns:
        Result dictionary with success status and order details
    """
    try:
        print("🛒 Purchasing Legiit service...")
        print(f"   Domain: {domain}")
        print(f"   Business: {business_name}")
        
        payload = {
            "domain": domain,
            "businessName": business_name,
            "address": address
        }
        
        response = requests.post(
            f"{API_BASE_URL}/api/purchase/standard",
            headers={"Content-Type": "application/json"},
            json=payload,
            timeout=120  # 2 minutes
        )
        
        response.raise_for_status()
        result = response.json()
        
        if result.get("success"):
            print("\n✅ Purchase successful!")
            print(f"   Order ID: {result.get('orderId')}")
            print(f"   Request ID: {result.get('requestId')}")
            print(f"   Steps completed: {len(result.get('steps', []))}")
        else:
            print("\n❌ Purchase failed!")
            print(f"   Error: {result.get('error')}")
            print(f"   Request ID: {result.get('requestId')}")
        
        return result
        
    except requests.RequestException as e:
        print(f"\n💥 Request failed: {e}")
        raise


def purchase_custom_service(service_url: str, domain: str, business_name: str, address: str, package: str = "Standard") -> Dict:
    """
    Purchase a Legiit service with custom parameters
    
    Args:
        service_url: Custom Legiit service URL
        domain: Business domain/website
        business_name: Official business name
        address: Full business address
        package: Package tier (default: "Standard")
    
    Returns:
        Result dictionary with success status and order details
    """
    try:
        print("🛒 Purchasing custom service...")
        print(f"   Service URL: {service_url}")
        
        payload = {
            "serviceUrl": service_url,
            "package": package,
            "details": {
                "domain": domain,
                "businessName": business_name,
                "address": address
            }
        }
        
        response = requests.post(
            f"{API_BASE_URL}/api/purchase",
            headers={"Content-Type": "application/json"},
            json=payload,
            timeout=120
        )
        
        response.raise_for_status()
        result = response.json()
        
        if result.get("success"):
            print("\n✅ Purchase successful!")
            print(f"   Order ID: {result.get('orderId')}")
        else:
            print("\n❌ Purchase failed!")
            print(f"   Error: {result.get('error')}")
        
        return result
        
    except requests.RequestException as e:
        print(f"\n💥 Request failed: {e}")
        raise


def batch_purchase(businesses: list) -> list:
    """
    Purchase services for multiple businesses
    
    Args:
        businesses: List of dictionaries with business details
    
    Returns:
        List of results for each purchase
    """
    results = []
    
    for i, business in enumerate(businesses, 1):
        print(f"\n📦 Processing business {i}/{len(businesses)}")
        
        try:
            result = purchase_service(
                domain=business["domain"],
                business_name=business["businessName"],
                address=business["address"]
            )
            results.append(result)
        except Exception as e:
            print(f"❌ Failed to purchase for {business['domain']}: {e}")
            results.append({"success": False, "error": str(e)})
    
    return results


def main():
    """Main execution function"""
    print("\n╔══════════════════════════════════════════════╗")
    print("║   Legiit Automation API - Python Example     ║")
    print("╚══════════════════════════════════════════════╝\n")
    
    # Check health first
    check_health()
    
    # Example 1: Quick purchase (Standard package)
    print("\n--- Example 1: Quick Purchase ---\n")
    purchase_service(
        domain="mybusiness.com",
        business_name="My Business LLC",
        address="123 Main St, City, State 12345"
    )
    
    # Example 2: Custom service URL
    # print("\n--- Example 2: Custom Service URL ---\n")
    # purchase_custom_service(
    #     service_url="https://legiit.com/Toplocalcitations/350-usa-local-citations-listings-and-directories-1679073072",
    #     domain="another-business.com",
    #     business_name="Another Business Inc",
    #     address="456 Oak Ave, Town, State 67890"
    # )
    
    # Example 3: Batch purchase
    # print("\n--- Example 3: Batch Purchase ---\n")
    # businesses = [
    #     {
    #         "domain": "business1.com",
    #         "businessName": "Business One LLC",
    #         "address": "111 First St, City, State 11111"
    #     },
    #     {
    #         "domain": "business2.com",
    #         "businessName": "Business Two Inc",
    #         "address": "222 Second Ave, City, State 22222"
    #     }
    # ]
    # batch_purchase(businesses)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n💥 Fatal error: {e}")
        sys.exit(1)
