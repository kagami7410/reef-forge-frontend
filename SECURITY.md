# Security Guidelines for Reef Forge Frontend

## Critical Security Notice

**⚠️ IMPORTANT:** The `.env.production` file in this repository currently contains exposed secrets including the JWT secret. These credentials must be rotated immediately.

## Immediate Actions Required

### 1. Remove Exposed Secrets from Git History

The following files contain sensitive information and have been committed to git:
- `.env.production`
- `.env.local`

**Steps to clean up:**

```bash
# Remove files from git history (use with caution)
git rm --cached .env.production .env.local

# Add them to git ignore (already done)
# Commit the changes
git add .gitignore
git commit -m "Remove sensitive environment files from tracking"
```

### 2. Rotate All Secrets

**JWT Secret:**
```bash
# Generate a new JWT secret (base64 encoded)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Stripe Keys:**
- Log into Stripe Dashboard
- Go to Developers > API keys
- Roll (regenerate) your secret key
- Update your environment variables

**Backend Credentials:**
- If any backend authentication tokens were exposed, rotate them

### 3. Update Environment Variables

After rotating secrets, update your environment configuration in your deployment platform:

- **Development:** Update `.env.local` (not committed to git)
- **Production:** Update environment variables in your deployment platform (Vercel, AWS, etc.)

## Environment Variable Management

### Required Environment Variables

```bash
# Backend Configuration
BACKEND_HOSTNAME=your-backend-url
REEF_FORGE_BACKEND_HOSTNAME=your-backend-url  # (deprecate in favor of BACKEND_HOSTNAME)

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_xxx  # Public key (safe to expose)
STRIPE_SECRET_KEY=sk_live_xxx  # Secret key (NEVER expose)

# JWT Configuration
JWT_SECRET=your-base64-encoded-secret  # CRITICAL: Never commit

# Application URL
NEXT_PUBLIC_APP_URL=https://reef-forge.uk  # or http://localhost:3000 for dev

# Optional Configuration
NEXT_PUBLIC_SHIPPING_PRICE=2.95
NEXT_PUBLIC_GCS_BUCKET_URL=your-gcs-bucket-url
NEXT_PUBLIC_ENABLE_DISCOUNTS=true
```

### Environment File Structure

**Development (.env.local):**
```bash
# Copy .env.example to .env.local and fill in your values
BACKEND_HOSTNAME=http://localhost:3001
JWT_SECRET=<generate-new-secret>
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_xxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Production:**
- **NEVER** commit `.env.production` to git
- Use your deployment platform's environment variable management
- Use secrets management services (AWS Secrets Manager, HashiCorp Vault, etc.)

### .env.example Template

Create a `.env.example` file (safe to commit) with placeholder values:

```bash
# Backend Configuration
BACKEND_HOSTNAME=http://localhost:3001

# Stripe Configuration (use test keys for development)
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here

# JWT Configuration
JWT_SECRET=your_base64_encoded_secret_here

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional Configuration
NEXT_PUBLIC_SHIPPING_PRICE=2.95
```

## Security Best Practices

### 1. Never Commit Secrets
- All `.env*` files should be in `.gitignore`
- Never hardcode API keys, tokens, or passwords
- Use environment variables for all sensitive data

### 2. Use Secrets Management
For production deployments, use dedicated secrets management:
- **AWS Secrets Manager**
- **HashiCorp Vault**
- **Azure Key Vault**
- **Google Cloud Secret Manager**

### 3. Separate Development and Production Keys
- Use Stripe test keys in development
- Use different JWT secrets for each environment
- Never use production credentials in development

### 4. Regular Security Audits
- Run `npm audit` regularly
- Update dependencies to patch vulnerabilities
- Review access logs for suspicious activity

### 5. Cookie Security
All authentication cookies must have:
- `httpOnly: true` - Prevents XSS attacks
- `secure: true` - HTTPS only (production)
- `sameSite: 'lax'` or `'strict'` - CSRF protection

### 6. API Route Protection
All admin routes must:
- Verify JWT token
- Check user role
- Log access attempts
- Validate all inputs

### 7. Input Validation
- Validate all user inputs server-side
- Use Zod schemas for type-safe validation
- Sanitize data before database operations
- Reject invalid data early

### 8. Error Handling
- Never expose stack traces to users
- Log detailed errors server-side only
- Return generic error messages to clients
- Use structured logging with proper levels

## Monitoring and Incident Response

### 1. Error Monitoring
Consider integrating:
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Datadog** - Application monitoring

### 2. Security Monitoring
- Monitor failed login attempts
- Track unusual API usage patterns
- Set up alerts for suspicious activity
- Review logs regularly

### 3. Incident Response Plan
If a security breach occurs:
1. Immediately rotate all credentials
2. Review access logs
3. Identify affected systems
4. Notify affected users if necessary
5. Document the incident
6. Implement preventive measures

## Code Review Checklist

Before deploying code, verify:
- [ ] No hardcoded secrets
- [ ] All API routes have proper authentication
- [ ] Input validation on all endpoints
- [ ] Proper error handling (no data leaks)
- [ ] Secure cookie configuration
- [ ] Updated dependencies (no critical vulnerabilities)
- [ ] Environment variables properly configured

## Reporting Security Issues

If you discover a security vulnerability:
1. **DO NOT** create a public GitHub issue
2. Email security concerns to: security@reef-forge.uk
3. Include detailed information about the vulnerability
4. Allow reasonable time for patching before public disclosure

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/advanced-features/security-headers)
- [Stripe Security Best Practices](https://stripe.com/docs/security)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

## Compliance

This application handles:
- User emails (PII)
- Payment information (via Stripe - PCI DSS compliant)
- User addresses

Ensure compliance with:
- **GDPR** (if serving EU customers)
- **PCI DSS** (payment card data - handled by Stripe)
- **UK Data Protection Act 2018**

---

Last Updated: 2025-10-17
