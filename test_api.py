import requests
import json
import sys

def test_api_health():
    """Test the API health endpoint"""
    try:
        response = requests.get("http://localhost:12000/health")
        if response.status_code == 200:
            print("✅ API health check passed")
            return True
        else:
            print(f"❌ API health check failed with status code {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ API health check failed with error: {str(e)}")
        return False

def test_ollama_connection():
    """Test the connection to Ollama API"""
    try:
        response = requests.post(
            "http://localhost:12000/api/ollama/generate",
            json={
                "model": "deepseek-coder:1.3b",
                "prompt": "Hello, are you working?",
                "stream": False
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Ollama connection test passed")
            print(f"   Model: {data.get('model')}")
            print(f"   Response: {data.get('response')[:100]}...")
            return True
        else:
            print(f"❌ Ollama connection test failed with status code {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Ollama connection test failed with error: {str(e)}")
        return False

if __name__ == "__main__":
    print("Testing API endpoints...")
    health_result = test_api_health()
    ollama_result = test_ollama_connection()
    
    if health_result and ollama_result:
        print("\n✅ All tests passed! The API is working correctly.")
        sys.exit(0)
    else:
        print("\n❌ Some tests failed. Please check the API and Ollama connection.")
        sys.exit(1)