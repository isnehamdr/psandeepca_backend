// import Checkbox from '@/Components/Checkbox';
// import InputError from '@/Components/InputError';
// import InputLabel from '@/Components/InputLabel';
// import PrimaryButton from '@/Components/PrimaryButton';
// import TextInput from '@/Components/TextInput';
// import GuestLayout from '@/Layouts/GuestLayout';
// import { Head, Link, useForm } from '@inertiajs/react';

// export default function Login({ status, canResetPassword }) {
//     const { data, setData, post, processing, errors, reset } = useForm({
//         email: '',
//         password: '',
//         remember: false,
//     });

//     const submit = (e) => {
//         e.preventDefault();

//         post(route('login'), {
//             onFinish: () => reset('password'),
//         });
//     };

//     return (
//         <GuestLayout>
//             <Head title="Log in" />

//             {status && (
//                 <div className="mb-4 text-sm font-medium text-green-600">
//                     {status}
//                 </div>
//             )}

//             <form onSubmit={submit}>
//                 <div>
//                     <InputLabel htmlFor="email" value="Email" />

//                     <TextInput
//                         id="email"
//                         type="email"
//                         name="email"
//                         value={data.email}
//                         className="mt-1 block w-full"
//                         autoComplete="username"
//                         isFocused={true}
//                         onChange={(e) => setData('email', e.target.value)}
//                     />

//                     <InputError message={errors.email} className="mt-2" />
//                 </div>

//                 <div className="mt-4">
//                     <InputLabel htmlFor="password" value="Password" />

//                     <TextInput
//                         id="password"
//                         type="password"
//                         name="password"
//                         value={data.password}
//                         className="mt-1 block w-full"
//                         autoComplete="current-password"
//                         onChange={(e) => setData('password', e.target.value)}
//                     />

//                     <InputError message={errors.password} className="mt-2" />
//                 </div>

//                 <div className="mt-4 block">
//                     <label className="flex items-center">
//                         <Checkbox
//                             name="remember"
//                             checked={data.remember}
//                             onChange={(e) =>
//                                 setData('remember', e.target.checked)
//                             }
//                         />
//                         <span className="ms-2 text-sm text-gray-600">
//                             Remember me
//                         </span>
//                     </label>
//                 </div>

//                 <div className="mt-4 flex items-center justify-end">
//                     {canResetPassword && (
//                         <Link
//                             href={route('password.request')}
//                             className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//                         >
//                             Forgot your password?
//                         </Link>
//                     )}

//                     <PrimaryButton className="ms-4" disabled={processing}>
//                         Log in
//                     </PrimaryButton>
//                 </div>
//             </form>
//         </GuestLayout>
//     );
// }

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const submit = (e) => {
    e.preventDefault();

    post(route("login"), {
      onFinish: () => reset("password"),
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#05070d] flex items-center justify-center p-0 sm:p-4">
      <Head title="Log in" />

      <div className="relative w-full max-w-6xl h-screen sm:h-[640px] flex rounded-none sm:rounded-3xl overflow-hidden shadow-2xl">
        {/* LEFT - dark panel */}
        <div className="relative hidden md:flex md:w-1/2 flex-col justify-between p-10 overflow-hidden bg-[#0b0e16]">
          {/* abstract glass-building backdrop */}
          <div className="absolute inset-0">
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 700 800"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1b2638" />
                  <stop offset="100%" stopColor="#05070d" />
                </linearGradient>
                <linearGradient id="facet1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#3a4f6e" />
                  <stop offset="100%" stopColor="#1a2330" />
                </linearGradient>
                <linearGradient id="facet2" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#7a8da6" />
                  <stop offset="100%" stopColor="#2b3a4e" />
                </linearGradient>
                <linearGradient id="facet3" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="#222d3d" />
                  <stop offset="100%" stopColor="#0d121b" />
                </linearGradient>
              </defs>
              <rect width="700" height="800" fill="url(#bgGrad)" />
              <polygon points="0,0 350,0 200,350 0,250" fill="url(#facet1)" opacity="0.9" />
              <polygon points="350,0 700,0 700,300 420,260" fill="url(#facet3)" opacity="0.85" />
              <polygon points="0,250 200,350 120,650 0,600" fill="url(#facet3)" opacity="0.8" />
              <polygon points="200,350 420,260 480,560 120,650" fill="url(#facet2)" opacity="0.5" />
              <polygon points="420,260 700,300 700,650 480,560" fill="url(#facet1)" opacity="0.85" />
              <polygon points="0,600 120,650 80,800 0,800" fill="url(#facet3)" opacity="0.9" />
              <polygon points="120,650 480,560 520,800 80,800" fill="url(#facet2)" opacity="0.35" />
              <polygon points="480,560 700,650 700,800 520,800" fill="url(#facet3)" opacity="0.9" />
              <line x1="200" y1="350" x2="420" y2="260" stroke="#8fa3bd" strokeWidth="1" opacity="0.4" />
              <line x1="120" y1="650" x2="480" y2="560" stroke="#8fa3bd" strokeWidth="1" opacity="0.3" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-transparent to-[#05070d]/40" />
          </div>

          {/* bottom copy */}
          <div className="relative z-10 max-w-md py-32 mt-24">
            <h2 className="text-white text-4xl font-bold leading-relaxed tracking-tight">
              Audit, tax, and
              advisory,
              <br />
              Built around
              your business
            </h2>
            <p className="mt-4 text-white/60 text-sm leading-relaxed">
              A decade of independent audit, tax, and advisory practice in Nepal, led by chartered accountants.
            </p>
          </div>
        </div>

        {/* RIGHT - form panel */}
        <div className="relative flex w-full md:w-1/2 items-center justify-center bg-white p-6 sm:p-10">
          <div className="w-full max-w-sm">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back!</h2>
            <p className="mt-2 text-sm text-gray-500">
              Log in to start creating stunning videos with ease.
            </p>

            {status && (
              <div className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
                {status}
              </div>
            )}

            <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-800 mb-1.5"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="username"
                  placeholder="Input your email"
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-gray-900 focus:ring-1 focus:ring-gray-900 ${
                    errors.email ? "border-red-400" : "border-gray-200"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-800 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    placeholder="Input your password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    className={`w-full rounded-lg border px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-gray-900 focus:ring-1 focus:ring-gray-900 ${
                      errors.password ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={data.remember}
                    onChange={(e) => setData("remember", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                  Remember me
                </label>

                {canResetPassword && (
                  <Link
                    href={route("password.request")}
                    className="text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded"
                  >
                    Forgot your password?
                  </Link>
                )}
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full rounded-full bg-gray-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-black disabled:opacity-60"
              >
                {processing ? "Logging in…" : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}