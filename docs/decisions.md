Decision 2.1: How does the app remember who is signed in?

- I would use Aa signed token in an httpOnly cookie: the cookie holds the user id, signed with a secret, and every instance can check the signature.
  The httpOnly cookie is signed not encrypted, signing out deletes the cookie.
  This will be done using a JWT token in an httpOnly cookie.

- Practice questions

1. How would you add "sign out everywhere" without a full session store?
   Give each user a session version number in the database and put it in the token. Bumping the number makes every older token fail the check. It costs one small lookup per request, which brings back some of the state you avoided.

2. Why HS256 with one secret, rather than a public-key algorithm?
   Only this app signs and checks the token, so one shared secret is enough. A public-key algorithm such as RS256 or EdDSA matters when other services must verify tokens without being able to create them.

3. What stops someone editing the user id in their cookie?
   The signature. Change any byte of the payload and jwtVerify rejects the token, so readSession returns null and the request is treated as signed out.
