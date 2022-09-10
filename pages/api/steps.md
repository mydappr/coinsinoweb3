1. Setup firebase
2. Store firebase key in env
3. Store decrypted data on firebase
4. fetch decrypted data via a key from the request from firebase
5. decode/verify token in the request against data from step 4.
6. if valid, perform next action, else, return forbidden error.
7. repeat for all routes.

<!-- In production -->

- Hash the jwt token.
