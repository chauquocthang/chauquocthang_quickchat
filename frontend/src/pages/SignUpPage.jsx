import { useState } from "react";
import { ShipWheelIcon, MessageCircle, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router";

import useSignUp from "../hooks/useSignUp";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { isPending, error, signupMutation } = useSignUp();

  // Tính độ mạnh mật khẩu
  const calculateStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength += 1;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength += 1;
    if (/\d/.test(pass)) strength += 1;
    if (/[@$!%*?&]/.test(pass)) strength += 1;
    return strength;
  };

  const getStrengthColor = (strength) => {
    if (strength <= 1) return "bg-red-500";
    if (strength === 2) return "bg-orange-500";
    if (strength === 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength) => {
    if (strength <= 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    return "Strong";
  };

  const handlePasswordChange = (e) => {
    const newPass = e.target.value;
    setSignupData({ ...signupData, password: newPass });
    setPasswordStrength(calculateStrength(newPass));
  };

  const handleSignup = (e) => {
    e.preventDefault();

    // Kiểm tra confirm password ở frontend trước khi gọi API
    if (signupData.password !== signupData.confirmPassword) {
      // useSignUp hook không có cách set error thủ công → ta có thể dùng toast hoặc state riêng
      // Ở đây mình sẽ để backend trả lỗi, nhưng vẫn chặn sớm cho UX tốt hơn
      return;
    }

    signupMutation({
      fullName: signupData.fullName,
      email: signupData.email,
      password: signupData.password,
    });
  };

  // Kiểm tra lỗi xác nhận mật khẩu (nếu backend không bắt, ta tự hiển thị)
  const confirmPasswordError =
    signupData.confirmPassword &&
    signupData.password !== signupData.confirmPassword
      ? "Passwords do not match"
      : null;

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="forest"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* LEFT SIDE - FORM */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8 text-center">
            <img
              src="/i.png"
              alt="Language partners"
              className="mx-auto max-w-sm"
            />
            <h2 className="text-2xl font-bold mt-8">
              Connect with language partners worldwide
            </h2>
            <p className="mt-3 opacity-80">
              Practice real conversations, make friends, and master new
              languages together!
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - ILLUSTRATION (giữ nguyên) */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          <div className="mb-4 flex items-center justify-start gap-2">
            <MessageCircle className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              QuickChat
            </span>
          </div>

          {/* GLOBAL ERROR FROM SERVER */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response?.data?.message || error.message}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold">Create an Account</h2>
              <p className="text-sm opacity-70 mt-1">
                Join and start your language learning adventure!
              </p>
            </div>

            {/* FULL NAME */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="input input-bordered w-full"
                value={signupData.fullName}
                onChange={(e) =>
                  setSignupData({ ...signupData, fullName: e.target.value })
                }
                required
              />
            </div>

            {/* EMAIL */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                className="input input-bordered w-full"
                value={signupData.email}
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="input input-bordered w-full pr-12"
                  value={signupData.password}
                  onChange={handlePasswordChange}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-400" />
                  )}
                </button>
              </div>

              {/* Thanh sức mạnh mật khẩu */}
              {passwordFocused && signupData.password && (
                <div className="mt-3">
                  <div className="flex gap-1 h-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-all duration-300 ${
                          i <= passwordStrength
                            ? getStrengthColor(passwordStrength)
                            : "bg-base-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs mt-1 opacity-80">
                    Password Strength:{" "}
                    <span className="font-semibold">
                      {getStrengthText(passwordStrength)}
                    </span>
                  </p>
                </div>
              )}

              <div className="text-xs mt-2 space-y-1 opacity-70">
                <p>At least 8 characters</p>
                <p>One uppercase & one lowercase letter</p>
                <p>One number & one special character (@$!%*?&)</p>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Confirm Password</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  className={`input input-bordered w-full pr-12 ${
                    confirmPasswordError ? "input-error" : ""
                  }`}
                  value={signupData.confirmPassword}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-base-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-400" />
                  )}
                </button>
              </div>

              {confirmPasswordError && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {confirmPasswordError}
                  </span>
                </label>
              )}
            </div>

            {/* TERMS */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  required
                />
                <span className="label-text text-sm">
                  I agree to the{" "}
                  <a href="#" className="link link-primary">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="link link-primary">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="
              btn
              btn-primary
              w-full"
              disabled={
                isPending || passwordStrength < 4 || confirmPasswordError
              }
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            <p className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
