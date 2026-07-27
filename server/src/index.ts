// Local development entrypoint — calls app.listen()
// On Vercel this file is NOT used; api/index.ts is used instead.
import app from './app.js';

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
