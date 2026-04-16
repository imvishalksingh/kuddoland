import { useState } from "react";
import { X, Smartphone } from "lucide-react";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "../../store/authStore";
import { loginWithGoogle } from "../../api/auth.api";
import "./AuthModal.css";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, setSession } = useAuthStore();
  const [phoneNumber, setPhoneNumber] = useState("");

  if (!isAuthModalOpen) return null;

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await loginWithGoogle(credentialResponse.credential);
      setSession({ user: response.user, accessToken: response.accessToken });
      toast.success("Welcome, " + response.user.name + "!");
      closeAuthModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Google Login failed");
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    toast("Mobile Login Coming Soon!", {
      icon: "⏳",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };

  return (
    <div className="auth-overlay" onClick={closeAuthModal}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={closeAuthModal}>
          <X size={24} />
        </button>

        <h2 className="auth-title">Welcome</h2>
        <p className="auth-subtitle">Enter your mobile number to continue</p>

        <div className="google-auth-container">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("Google Login failed")}
            useOneTap
            shape="square"
            width="100%"
            text="continue_with"
          />
        </div>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <form onSubmit={handleSendOtp}>
          <div className="input-group">
            <label className="input-label">Mobile Number</label>
            <div className="relative">
              <input
                type="tel"
                placeholder="Enter 10-digit mobile number"
                className="auth-input"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                required
              />
            </div>
          </div>

          <button type="submit" className="submit-btn text-center">
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
}
