package config

import (
	"os"

	"github.com/spf13/viper"
)

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	Redis    RedisConfig
}

type ServerConfig struct {
	Port   string
	APIKey string
}

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	Name     string
	SSLMode  string
}

type RedisConfig struct {
	Host     string
	Port     string
	Password string
	DB       int
}

func Load() (*Config, error) {
	// Legge config.yaml (scritto dal wizard al primo avvio)
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")

	// AutomaticEnv assicura che le env var siano sempre disponibili
	viper.AutomaticEnv()

	// Defaults
	viper.SetDefault("SERVER_PORT", "8080")
	viper.SetDefault("DB_HOST", "localhost")
	viper.SetDefault("DB_PORT", "5432")
	viper.SetDefault("DB_SSLMODE", "disable")
	viper.SetDefault("REDIS_HOST", "localhost")
	viper.SetDefault("REDIS_PORT", "6379")
	viper.SetDefault("REDIS_DB", 0)

	_ = viper.ReadInConfig() // non fallisce se il file non esiste

	return &Config{
		Server: ServerConfig{
			Port:   get("SERVER_PORT"),
			APIKey: get("API_KEY"),
		},
		Database: DatabaseConfig{
			Host:     get("DB_HOST"),
			Port:     get("DB_PORT"),
			User:     get("DB_USER"),
			Password: get("DB_PASSWORD"),
			Name:     get("DB_NAME"),
			SSLMode:  get("DB_SSLMODE"),
		},
		Redis: RedisConfig{
			Host:     get("REDIS_HOST"),
			Port:     get("REDIS_PORT"),
			Password: get("REDIS_PASSWORD"),
			DB:       viper.GetInt("REDIS_DB"),
		},
	}, nil
}

// get restituisce il valore della env var se impostata, altrimenti quello di viper (config.yaml o default).
// Questo risolve un gotcha di viper: AutomaticEnv non sovrascrive sempre i valori del file di config.
// Priorità: env var > config.yaml > default
func get(key string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return viper.GetString(key)
}
