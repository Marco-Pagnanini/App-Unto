package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/Marco-Pagnanini/App-Unto/backend/internal/domain"
)

const UserContextKey = "user"

// Auth è un middleware Gin che valida l'API key nell'header Authorization.
// Header atteso: Authorization: Bearer <api_key>
func Auth(userRepo domain.UserRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing authorization header"})
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid authorization header format, expected: Bearer <api_key>"})
			return
		}

		user, err := userRepo.FindByAPIKey(context.Background(), parts[1])
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid api key"})
			return
		}

		// Rendiamo l'utente disponibile a tutti gli handler successivi
		c.Set(UserContextKey, user)
		c.Next()
	}
}
