# Security Policy — NeuroCare AI

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly.

**Do NOT open a public GitHub Issue for security vulnerabilities.**

Instead, please contact the project maintainer directly via email or through GitHub's private vulnerability reporting feature.

### What to Include

- Description of the vulnerability.
- Steps to reproduce.
- Potential impact.
- Suggested fix (if any).

### Response

- We will acknowledge your report as soon as possible.
- We will work to verify and address the issue promptly.
- We will credit you for the discovery (if you wish) once the fix is released.

## Security Considerations

This is an **academic portfolio project** and is **not intended for production deployment** with real patient data.

- Authentication uses JWT tokens stored in `localStorage` (acceptable for a demo, but not recommended for production healthcare applications).
- Passwords are hashed using bcryptjs before storage.
- Role-based access control is implemented on API routes.
- CORS is configured to allow cross-origin requests for development purposes.
- No real patient data, medical records, or personal health information should be used with this application.

## Disclaimer

This project is a technology demonstration and academic exercise. It is **not** a certified medical device or HIPAA-compliant system. Do not use it to store, process, or transmit real patient health information.
