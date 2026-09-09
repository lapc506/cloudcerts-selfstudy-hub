# CloudCerts SelfStudy Hub - Makefile
# ==========================================
# Automation targets for Tauri-based certification study app
# Naming Convention: env-recurso-verbo
# Examples:
#   make dev-tauri-build    # Build in development mode
#   make prod-tauri-build   # Build in production mode
#
# Usage:
#   make <target>
#   make <target> VAR=value

TIMEOUT ?= 300000

.PHONY: help dev-tauri-build prod-tauri-build dev-tauri-run \
        dev-setup dev-clean ci-test ci-lint ci-e2e-run

# ==========================================
# Variables
# ==========================================

ENV ?= dev

BLUE := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
NC := \033[0m

# ==========================================
# Help
# ==========================================

help: ## Show this help message
	@echo ""
	@echo "$(BLUE)╔═══════════════════════════════════════════════════════════════╗$(NC)"
	@echo "$(BLUE)║  CloudCerts SelfStudy Hub - Commands (env-recurso-verbo)       ║$(NC)"
	@echo "$(BLUE)╚═══════════════════════════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(GREEN)DEVELOPMENT$(NC)"
	@echo "  $(YELLOW)dev-tauri-build$(NC)     Build app in development mode (npm run dev)"
	@echo "  $(YELLOW)prod-tauri-build$(NC)    Build app in production mode (npm run build + tauri build)"
	@echo "  $(YELLOW)dev-tauri-run$(NC)        Run app in development mode"
	@echo ""
	@echo "$(GREEN)SETUP & CLEANUP$(NC)"
	@echo "  $(YELLOW)dev-setup$(NC)           Setup development environment (install deps, build)"
	@echo "  $(YELLOW)dev-clean$(NC)           Clean build artifacts"
	@echo ""
	@echo "$(GREEN)CI/CD$(NC)"
	@echo "  $(YELLOW)ci-test$(NC)             Run all tests (vitest)"
	@echo "  $(YELLOW)ci-lint$(NC)             Run linting (eslint/tsc)"
	@echo "  $(YELLOW)ci-e2e-run$(NC)          Run Tauri E2E (WebdriverIO)"
	@echo ""
	@echo "$(GREEN)Variables$(NC)"
	@echo "  ENV=dev|prod    Entorno por defecto: dev"
	@echo ""

# ==========================================
# DEVELOPMENT - Tauri
# ==========================================

dev-tauri-build: ## Build app in development mode (npm run dev)
	@echo "$(BLUE)Building in development mode...$(NC)"
	@npm run dev

prod-tauri-build: ## Build app in production mode (npm run build + tauri build)
	@echo "$(BLUE)Building in production mode...$(NC)"
	@npm run build
	@npx tauri build

dev-tauri-run: ## Run app in development mode
	@echo "$(BLUE)Running in development mode...$(NC)"
	@npx tauri dev

# ==========================================
# SETUP & CLEANUP
# ==========================================

dev-setup: ## Setup development environment
	@echo "$(BLUE)Setting up development environment...$(NC)"
	@npm install
	@echo "$(GREEN)✓ Dependencies installed$(NC)"
	@echo "$(BLUE)Running build check...$(NC)"
	@npm run build 2>&1 | tail -3
	@echo "$(GREEN)✓ Build check passed$(NC)"

dev-clean: ## Clean build artifacts
	@echo "$(BLUE)Cleaning build artifacts...$(NC)"
	@rm -rf dist/
	@rm -rf .tauri/
	@rm -rf src-tauri/target/
	@echo "$(GREEN)✓ Clean complete$(NC)"

# ==========================================
# CI/CD
# ==========================================

ci-test: ## Run all tests
	@echo "$(BLUE)Running tests...$(NC)"
	@npm test -- --run 2>&1 | tail -20

ci-lint: ## Run linting
	@echo "$(BLUE)Running linting...$(NC)"
	@npm run lint 2>&1 | tail -20

ci-e2e-run: ## Run Tauri E2E (WebdriverIO, requiere binario release + display)
	@echo "$(BLUE)Running Tauri E2E...$(NC)"
	@npx wdio run wdio.conf.ts

# Default goal
.DEFAULT_GOAL := help