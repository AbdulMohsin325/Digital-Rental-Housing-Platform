#!/bin/bash

echo "==================================="
echo "Testing Authentication System"
echo "==================================="
echo ""

# Test API root
echo "1. Testing API root..."
curl -s http://localhost:5000/ | json_pp
echo ""
echo ""

# Test registration
echo "2. Testing user registration..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"testuser@example.com","password":"password123"}')

echo "$REGISTER_RESPONSE" | json_pp
TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*' | sed 's/"token":"//')
echo ""
echo "Extracted Token: $TOKEN"
echo ""
echo ""

# Test login
echo "3. Testing user login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"password123"}')

echo "$LOGIN_RESPONSE" | json_pp
echo ""
echo ""

# Test login with wrong password
echo "4. Testing login with wrong password (should fail)..."
curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"wrongpassword"}' | json_pp
echo ""
echo ""

# Test protected route without token
echo "5. Testing protected route WITHOUT token (should fail)..."
curl -s http://localhost:5000/api/users | json_pp
echo ""
echo ""

# Test protected route with token
echo "6. Testing protected route WITH token (should succeed)..."
curl -s http://localhost:5000/api/users \
  -H "Authorization: Bearer $TOKEN" | json_pp
echo ""
echo ""

# Test get current user
echo "7. Testing get current user (GET /api/auth/me)..."
curl -s http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN" | json_pp
echo ""
echo ""

echo "==================================="
echo "Testing Complete!"
echo "==================================="
