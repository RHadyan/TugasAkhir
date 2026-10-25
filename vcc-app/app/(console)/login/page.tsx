
'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Icon } from '@iconify/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Swal from 'sweetalert2';

function LoginContent() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const authStatus = searchParams.get('auth');
    if (authStatus === 'configuration') {
      Swal.fire({
        icon: 'info',
        title: 'Login Google belum dikonfigurasi',
        text: 'Isi GOOGLE_CLIENT_ID dan GOOGLE_CLIENT_SECRET, lalu daftarkan callback aplikasi ini pada Google OAuth client.',
      });
      router.replace('/login');
      return;
    }
    if (authStatus === 'gagal') {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Failed',
        text: 'Akun anda tidak terauthentikasi',
        timer: 2000,
        showConfirmButton: false,
      });

      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('auth');
      router.replace(newParams.toString() ? `/login?${newParams.toString()}` : '/login');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Icon icon="solar:user-circle-bold" className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-dark dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-darklink">Sign in to your account to continue</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">

              <div className="text-center text-sm text-gray-500 mb-4">
                Please sign in using your Google Account.<br />
                Only authorized accounts are allowed.
              </div>

              {/* Social Login Buttons */}
              <div className="grid gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 text-base"
                  onClick={login}
                >
                  <Icon icon="flat-color-icons:google" className="w-6 h-6 mr-2" />
                  Sign in with Google
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-darklink">
            © {new Date().getFullYear()} Komisi Kerja Sama SV IPB. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Icon icon="svg-spinners:ring-resize" className="w-10 h-10 text-primary" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
