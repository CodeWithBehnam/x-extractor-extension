# Security Policy

## Supported Versions

We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

### 1. **DO NOT** disclose publicly

Please do not create a public GitHub issue for security vulnerabilities.

### 2. Report privately

Send an email to: **security@example.com**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)
- Your contact information (optional, for credit)

### 3. Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Varies based on severity

### 4. Disclosure Policy

- We'll work with you to understand and resolve the issue
- Once fixed, we'll credit you in the security advisory (unless you prefer anonymity)
- Public disclosure only after a fix is released
- Coordinated disclosure timeline will be discussed

## Security Best Practices

### For Users

1. **Download from Official Sources**: Only install from official releases
2. **Keep Updated**: Always use the latest version
3. **Review Permissions**: Check what permissions the extension requests
4. **Report Suspicious Activity**: Contact us if you notice unusual behavior
5. **Secure Your Data**: Don't store sensitive information in extracted CSV files

### For Contributors

1. **No Credentials in Code**: Never commit API keys, passwords, or tokens
2. **Use Environment Variables**: Store sensitive config in `.env` files (not committed)
3. **Sanitize Inputs**: Validate and sanitize all user inputs
4. **Follow OWASP Guidelines**: Be aware of common vulnerabilities
5. **Dependency Updates**: Keep dependencies up to date
6. **Code Review**: All PRs undergo security review

## Security Features

### Data Privacy

- **Local Processing**: All extraction and analysis happens locally
- **No External Servers**: Data never leaves your browser
- **No Tracking**: We don't collect any user data
- **No Analytics**: No third-party analytics or telemetry

### Extension Permissions

We request minimal permissions:

- `activeTab`: To access the current X.com tab
- `storage`: To save user preferences locally
- `scripting`: To inject content scripts

### Content Security

- **CSP Headers**: Strict Content Security Policy
- **XSS Protection**: Sanitized DOM manipulation
- **Input Validation**: All user inputs are validated
- **Safe Parsing**: JSON parsing with error handling

## Known Security Considerations

### Rate Limiting

- The extension respects X.com's rate limits
- Includes automatic backoff to prevent account restrictions
- Users should follow platform's Terms of Service

### Data Storage

- Extracted data stored temporarily in browser memory
- CSV exports save to user's download folder
- No cloud storage or external transmission

### Browser Extension Risks

- Chrome Extension APIs are sandboxed
- Limited access to user's system
- Follows Chrome Web Store policies

## Vulnerability Disclosure

Past vulnerabilities will be listed here after resolution:

- None currently

## Bug Bounty

While we don't currently have a formal bug bounty program, we deeply appreciate security researchers who help us improve. We will:

- Acknowledge your contribution publicly (if desired)
- Prioritize fixing reported issues
- Consider implementing suggested improvements

## Security Updates

Security updates are released as soon as possible:

- **Critical**: Within 24-48 hours
- **High**: Within 1 week
- **Medium**: Within 2 weeks
- **Low**: Next regular release

Users will be notified via:
- GitHub Security Advisories
- Release notes
- README updates

## Compliance

- **GDPR**: No personal data collection
- **CCPA**: No data selling or sharing
- **Chrome Web Store Policy**: Full compliance
- **MIT License**: Open source transparency

## Contact

For security inquiries:
- **Email**: security@example.com
- **PGP Key**: [Available on request]

For general issues:
- **GitHub Issues**: [Create an issue](https://github.com/behnamebrahimi/x-extractor-extension/issues)
- **Discussions**: [Join the discussion](https://github.com/behnamebrahimi/x-extractor-extension/discussions)

---

Thank you for helping keep X.com Data Extractor secure! 🔒
