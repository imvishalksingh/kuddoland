import { useState } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ensureCsrfToken, forgotPassword, login, logoutAllSessionsRequest, register, resendVerification, resetPassword, verifyEmailRequest } from "../../api/auth.api";
import { useAuthStore } from "../../store/authStore";
import { Seo } from "../../components/ui/Seo";

const Input = (props) => (
  <input 
    {...props} 
    className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-4 font-body text-slate-700 transition-colors focus:border-brand-coral focus:bg-white focus:outline-none placeholder:text-slate-400" 
  />
);

function AuthShell({ title, description, ctaLabel, fields, onSubmit, footer }) {
  return (
    <main className="page-shell flex min-h-[80vh] items-center justify-center py-16 px-4 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-peach rounded-bl-full -z-10 opacity-40 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-mint/30 rounded-tr-full -z-10 opacity-40 blur-3xl"></div>

      <Seo title={`${title} | Kuddosland`} description={description} />
      
      <div className="w-full max-w-md">
        <div className="text-center mb-10 space-y-3">
          <Link to="/" className="inline-block text-3xl font-display font-extrabold text-brand-coral mb-4">Kuddoland</Link>
          <h1 className="font-display text-4xl font-extrabold text-brand-ink">{title}</h1>
          <p className="text-slate-500 font-body text-lg">{description}</p>
        </div>

        <div className="rounded-[32px] border border-brand-peach bg-white/80 backdrop-blur-md p-8 sm:p-10 shadow-xl shadow-brand-peach/20 relative z-10">
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-4">
              {fields}
            </div>
            <button className="w-full rounded-2xl bg-brand-coral px-5 py-4 text-lg font-bold text-white shadow-md transition-all hover:-translate-y-1 hover:shadow-lg hover:bg-opacity-90 mt-2" type="submit">
              {ctaLabel}
            </button>
          </form>
          {footer && (
            <div className="mt-8 text-center text-slate-500 font-body border-t border-slate-100 pt-6">
              {footer}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const role = new URLSearchParams(location.search).get("role");
  const [form, setForm] = useState({
    email: role === "admin" ? "admin@kuddosland.com" : "",
    password: role === "admin" ? "ChangeMe123!" : "",
  });

  return (
    <AuthShell
      title="Welcome Back"
      description="Sign in to access your wishlist, orders, and exclusive deals."
      ctaLabel={role === "admin" ? "Login as admin" : "Sign In"}
      fields={
        <>
          <Input placeholder="Email Address" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} required />
          <Input placeholder="Password" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} required />
          <div className="flex justify-end pr-1">
            <Link to="/forgot-password" className="text-sm font-bold text-brand-coral hover:underline">Forgot password?</Link>
          </div>
        </>
      }
      footer={
        <p>Don&apos;t have an account? <Link to="/register" className="font-bold text-brand-coral hover:underline">Sign up</Link></p>
      }
      onSubmit={async (event) => {
        event.preventDefault();
        try {
          await ensureCsrfToken();
          const response = await login(form);
          setSession({ user: response.user, accessToken: response.accessToken });
          if (!response.user.isVerified) {
            toast("Verify your email before checkout or reviews.");
          }
          toast.success("Welcome back!");
          navigate(response.user.role === "ADMIN" ? "/admin" : "/account");
        } catch (error) {
          toast.error(error.response?.data?.message || "Login failed");
        }
      }}
    />
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  return (
    <AuthShell
      title="Create Account"
      description="Join Kuddoland for a magical shopping experience."
      ctaLabel="Sign Up"
      fields={
        <>
          <Input placeholder="Full Name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
          <Input placeholder="Email Address" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} required />
          <Input placeholder="Password (min 6 characters)" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} required minLength={6} />
        </>
      }
      footer={
        <p>Already have an account? <Link to="/login" className="font-bold text-brand-coral hover:underline">Sign in</Link></p>
      }
      onSubmit={async (event) => {
        event.preventDefault();
        try {
          await ensureCsrfToken();
          const response = await register(form);
          setSession({ user: response.user, accessToken: response.accessToken });
          if (response.verificationTokenPreview) {
            toast.success(`Dev verify token: ${response.verificationTokenPreview}`);
          } else {
            toast.success("Account created. Check your email to verify it.");
          }
          navigate("/account");
        } catch (error) {
          toast.error(error.response?.data?.message || "Registration failed");
        }
      }}
    />
  );
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("parent@example.com");
  return (
    <AuthShell
      title="Forgot Password"
      description="Enter your email to receive a password reset OTP."
      ctaLabel="Send OTP"
      fields={
        <Input placeholder="Email Address" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      }
      footer={
        <p>Remember your password? <Link to="/login" className="font-bold text-brand-coral hover:underline">Sign in</Link></p>
      }
      onSubmit={async (event) => {
        event.preventDefault();
        try {
          await ensureCsrfToken();
          const response = await forgotPassword({ email });
          toast.success(response.otpPreview ? `Dev OTP: ${response.otpPreview}` : "OTP sent");
        } catch (error) {
          toast.error(error.response?.data?.message || "Request failed");
        }
      }}
    />
  );
}

export function ResetPasswordPage() {
  const params = useParams();
  const [form, setForm] = useState({ otp: params.token || "", password: "" });
  return (
    <AuthShell
      title="Reset Password"
      description="Enter the OTP and your new password to restore access."
      ctaLabel="Update Password"
      fields={
        <>
          <Input placeholder="6-digit OTP" value={form.otp} onChange={(event) => setForm((current) => ({ ...current, otp: event.target.value }))} required />
          <Input placeholder="New Password" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} required />
        </>
      }
      footer={
        <p><Link to="/login" className="font-bold text-brand-coral hover:underline">Back to Sign In</Link></p>
      }
      onSubmit={async (event) => {
        event.preventDefault();
        try {
          await ensureCsrfToken();
          await resetPassword(form);
          toast.success("Password successfully updated. Please sign in.");
        } catch (error) {
          toast.error(error.response?.data?.message || "Reset failed");
        }
      }}
    />
  );
}

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const params = useParams();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const [token, setToken] = useState(params.token || "");
  const [email, setEmail] = useState(user?.email || "");

  return (
    <AuthShell
      title="Verify Email"
      description="Enter the verification token to unlock full account features."
      ctaLabel="Verify Account"
      fields={
        <>
          <Input placeholder="Verification Token" value={token} onChange={(event) => setToken(event.target.value)} required />
          
          <div className="pt-4 flex flex-col gap-3">
            <button
              className="w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-3 font-bold text-slate-600 transition-colors hover:border-brand-peach hover:bg-slate-50"
              type="button"
              onClick={async () => {
                try {
                  await ensureCsrfToken();
                  const response = await resendVerification(user ? {} : { email });
                  toast.success(response.verificationTokenPreview ? `Dev verify token: ${response.verificationTokenPreview}` : "Verification email resent");
                } catch (error) {
                  toast.error(error.response?.data?.message || "Resend failed");
                }
              }}
            >
              Resend Code
            </button>
            
            {!user && (
              <Input placeholder="Email for resend" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            )}
            
            {user && (
              <button
                className="w-full rounded-2xl border-2 border-red-100 bg-red-50 px-5 py-3 font-bold text-red-500 transition-colors hover:bg-red-100 mt-4"
                type="button"
                onClick={async () => {
                  try {
                    await ensureCsrfToken();
                    await logoutAllSessionsRequest();
                    logout();
                    toast.success("Logged out from all sessions");
                    navigate("/login");
                  } catch (error) {
                    toast.error(error.response?.data?.message || "Logout failed");
                  }
                }}
              >
                Logout all sessions
              </button>
            )}
          </div>
        </>
      }
      onSubmit={async (event) => {
        event.preventDefault();
        try {
          await ensureCsrfToken();
          await verifyEmailRequest({ token });
          if (user) {
            setUser({ ...user, isVerified: true });
          }
          toast.success("Email verified successfully!");
          navigate(user?.role === "ADMIN" ? "/admin" : "/account");
        } catch (error) {
          toast.error(error.response?.data?.message || "Verification failed");
        }
      }}
    />
  );
}
