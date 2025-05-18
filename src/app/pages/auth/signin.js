import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    if (res.ok) {
      router.push('/');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 via-blue-300 to-blue-500 text-white">
      <div className="bg-white text-gray-900 rounded shadow p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold">Sign In</button>
        </form>
        <div className="my-4 text-center text-gray-500">or</div>
        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="w-full bg-red-500 text-white py-2 rounded font-semibold mb-2"
        >
          Sign in with Google
        </button>
        <div className="text-center mt-4">
          <a href="/auth/signup" className="text-blue-700 hover:underline">Don't have an account? Sign up</a>
        </div>
      </div>
    </div>
  );
} 