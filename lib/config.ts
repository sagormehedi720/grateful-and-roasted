// Helper to check if services are properly configured
export const isSupabaseConfigured = () => {
  if (typeof window !== 'undefined') {
    // Client-side check
    return true; // Let it fail gracefully at runtime
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return (
    url &&
    key &&
    url.includes('supabase.co') &&
    !url.includes('placeholder') &&
    key.startsWith('eyJ')
  );
};

export const isClerkConfigured = () => {
  if (typeof window !== 'undefined') {
    return true;
  }

  const pubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secretKey = process.env.CLERK_SECRET_KEY;

  return (
    pubKey &&
    secretKey &&
    pubKey.startsWith('pk_') &&
    secretKey.startsWith('sk_')
  );
};
