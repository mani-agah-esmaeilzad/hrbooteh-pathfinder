"""
Tests for authentication endpoints
"""

import pytest
from fastapi.testclient import TestClient


class TestAuth:
    """Test authentication endpoints"""
    
    def test_register_user(self, client: TestClient, sample_user_data):
        """Test user registration"""
        response = client.post("/api/v1/auth/register", json=sample_user_data)
        
        assert response.status_code == 200
        data = response.json()
        
        assert "access_token" in data
        assert "refresh_token" in data
        assert "user" in data
        assert data["user"]["email"] == sample_user_data["email"]
        assert data["user"]["full_name"] == sample_user_data["full_name"]
    
    def test_register_duplicate_user(self, client: TestClient, sample_user_data):
        """Test registering duplicate user"""
        # Register first user
        client.post("/api/v1/auth/register", json=sample_user_data)
        
        # Try to register same user again
        response = client.post("/api/v1/auth/register", json=sample_user_data)
        
        assert response.status_code == 400
        assert "already exists" in response.json()["detail"]
    
    def test_login_user(self, client: TestClient, sample_user_data):
        """Test user login"""
        # Register user first
        client.post("/api/v1/auth/register", json=sample_user_data)
        
        # Login
        login_data = {
            "email": sample_user_data["email"],
            "password": sample_user_data["password"]
        }
        response = client.post("/api/v1/auth/login", json=login_data)
        
        assert response.status_code == 200
        data = response.json()
        
        assert "access_token" in data
        assert "refresh_token" in data
        assert "user" in data
    
    def test_login_invalid_user(self, client: TestClient):
        """Test login with invalid credentials"""
        login_data = {
            "email": "nonexistent@example.com",
            "password": "wrongpassword"
        }
        response = client.post("/api/v1/auth/login", json=login_data)
        
        assert response.status_code == 401
        assert "Incorrect email or password" in response.json()["detail"]
    
    def test_get_current_user(self, client: TestClient, sample_user_data):
        """Test getting current user info"""
        # Register and get token
        register_response = client.post("/api/v1/auth/register", json=sample_user_data)
        token = register_response.json()["access_token"]
        
        # Get current user
        headers = {"Authorization": f"Bearer {token}"}
        response = client.get("/api/v1/auth/me", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["email"] == sample_user_data["email"]
        assert data["full_name"] == sample_user_data["full_name"]
    
    def test_get_current_user_without_token(self, client: TestClient):
        """Test getting current user without token"""
        response = client.get("/api/v1/auth/me")
        
        assert response.status_code == 403  # No token provided
