package handlers

import (
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type AuthHandler struct {
	secretKey []byte
}

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type AuthResponse struct {
	Token string `json:"token"`
	User  string `json:"user"`
}

func NewAuthHandler() *AuthHandler {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "default-secret-key-change-in-production"
	}
	return &AuthHandler{
		secretKey: []byte(secret),
	}
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	// Simple auth check - in production, this would be against a database
	if req.Username == "admin" && req.Password == "password" {
		// Generate JWT token
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"user": req.Username,
			"exp":  time.Now().Add(time.Hour * 24).Unix(),
		})

		tokenString, err := token.SignedString(h.secretKey)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
			return
		}

		c.JSON(http.StatusOK, AuthResponse{
			Token: tokenString,
			User:  req.Username,
		})
		return
	}

	c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
}

func (h *AuthHandler) Verify(c *gin.Context) {
	tokenString := c.GetHeader("Authorization")
	if tokenString == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No token provided"})
		return
	}

	// Remove "Bearer " prefix
	if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
		tokenString = tokenString[7:]
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return h.secretKey, nil
	})

	if err != nil || !token.Valid {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user":  claims["user"],
		"valid": true,
	})
}
