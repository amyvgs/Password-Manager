# Password-Manager
A password manager web application created with React, Vite, PostgreSQL, and Express Js.

**Live Demo**: https://password-manager-psi-one.vercel.app/

### Key Features
---
- **Password Management** : Store, edit, delete, and categorize your passwords.
- **Authenticated Sessions with JWT tokens** : Secure user sessions through access tokens granted on login/account creation. Tokens are verified and refreshed through refresh tokens, ensuring secure access, automatically redirecting users to the login page after session expiration.
- **Session Persistance** : Maintain user sessions by automatically logging users back into their accounts if refresh tokens remain valid.
- **Hashed and Encrypted User Information** : User information such as account password and stored passwords are hashed and encrypted prior to storing within the database to ensure user security

### Quick Start
1. Clone the repository:
   ```bash
   git clone https://github.com/amyvgs/Password-Manager.git
   ```
2. Install Dependencies:
   ```bash
   npm install
   ```
3. Run the program:
   ```bash
   npm run dev
   ```

### Built With
---
**Tech Stack** : React, Vite, TailwindCSS, Express/Node.js, PostgreSQL


### Future Optimzations
--- 
- Improve Media Queries for smaller devices
- Implement caching mechanisms on backend to reduce redundant queries and improve website performance
