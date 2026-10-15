// Load REBRICKABLE_API_KEY for the live tests from a local .env, if present
try {
  process.loadEnvFile();
} catch {
  // no .env file
}
