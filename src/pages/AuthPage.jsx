import React, { useState, useEffect, useContext } from 'react';
import './AuthPage.css';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { privateInstance, publicInstance } from '../api/api'
import { Loader } from '../Component/Kolopocketloader';
import { useNavigate } from 'react-router-dom'
import { authContext } from '../Context/authcontext'
import { GoogleLogin } from "@react-oauth/google";

function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingSignin, setLoadingSignin] = useState(false)
  const [loadingSignup, setLoadingSignup] = useState(false)
  const [googleLoadingSignin, setGoogleLoadingSignin] = useState(false)
  const [googleLoadingSignup, setGoogleLoadingSignup] = useState(false)
  const [error, setError] = useState(null);
  // Sign In form state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  // Sign Up form state
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const navigate = useNavigate()
  const { login } = useContext(authContext)

  const handleGoogleSuccess = async (credentialResponse, mode) => {
    // mode is 'signin' or 'signup', depending on which panel's button was clicked
    const setGoogleLoading = mode === 'signup' ? setGoogleLoadingSignup : setGoogleLoadingSignin;
    try {
      setGoogleLoading(true);
      // Send the token received from Google straight to your backend route
      const res = await publicInstance.post("/auth/googleauth", {
        credential: credentialResponse.credential,
      });

      if (res.data.success) {
        // If someone hit "Sign up with Google" but the account already existed,
        // don't silently log them in — tell them to use Sign In instead.
        if (mode === 'signup' && res.data.isNewUser === false) {
          setError('An account with this email already exists. Please sign in instead.');
          return;
        }

        // Save token local storage/context and redirect dashboard
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        if (login) {
          login({
            user: res.data.user,
            token: res.data.token
          });
        }
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Backend Google Authentication verification failed:", err);
      setError("Authentication failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error("Google login initialized popup closed or failed");
  };

  const handleSubmitSignup = async (e) => {
    e.preventDefault()
    if (!signUpPassword || !signUpEmail || !signUpName) {
      setError('please fill in all fields')
      return
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setError('Passwords do not match')
      return
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/

    if (!passwordRegex.test(signUpPassword)) {
      setError('Password must be at least 8 characters, include uppercase, lowercase, a number and a special character')
      return
    }

    console.log('name :', signUpName);
    console.log('Email :', signUpEmail);

    try {
      setLoadingSignup(true)
      const response = await publicInstance.post("/auth/register", { name: signUpName, email: signUpEmail, password: signUpPassword })
      console.log(response);

      if (response.status === 404) {
        // console.log(error.message)
        setError('endpoint not found')
      }

      if (response.status === 201) {
        console.log(response);
        setError('Account Created Successfully, kindly Login to continue');
        setSignUpName('')
        setSignUpEmail('')
        setSignUpPassword('')
        setSignUpConfirmPassword('')
        return navigate("/auth")
      }

    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "An Error Occuirred")
    } finally {
      setLoadingSignup(false)
    }
  }

  const handleSubmitSignin = async (e) => {
    e.preventDefault()

    if (!signInEmail || !signInPassword) {
      setError('Please fill in all fields')
      return
    }

    try {
      setLoadingSignin(true)
      const response = await publicInstance.post("/auth/login", { email: signInEmail, password: signInPassword })
      console.log(response);

      if (response?.data) {
        const { token, user } = response.data
        login({ user, token })
        navigate("/dashboard")
      } else {
        setError("Login failed: empty response")
      }

    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "An Error Occuirred")
    } finally {
      setLoadingSignin(false)
    }
  }

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000) // clears after 4 seconds
      return () => clearTimeout(timer)
    }
  }, [error])

  return (
    <div className="auth-bg">
      <div className={`error-toast ${error ? 'show' : ''}`}>
        {loadingSignin && <Loader caption="Signing you in..." />}
        {loadingSignup && <Loader caption="Creating account..." />}
        <p>{error}</p>
      </div>
      <div className={`auth-container${isSignUp ? ' signup-mode' : ''}`}>

        {/* Sign In Form */}
        <div className="form-panel sign-in-panel">
          <form className="auth-form" onSubmit={handleSubmitSignin}>
            <h2>Sign In</h2>
            <div className="google-btn-wrapper">
              <GoogleLogin
                className="social-login"
                onSuccess={(cred) => handleGoogleSuccess(cred, 'signin')}
                onError={handleGoogleError}
                theme="outline" /* Changes filled blue background to transparent/outline */
                shape="pill"
                useOneTap
                auto_select
                cancel_on_tap_outside={false}
              />
              {googleLoadingSignin && (
                <div className="google-btn-loading-overlay">
                  <span className="google-btn-spinner" />
                </div>
              )}
            </div>
            <input
              type="email"
              placeholder="Email"
              className="auth-input"
              value={signInEmail}
              onChange={e => setSignInEmail(e.target.value)}
              autoComplete="off"
            />
            <div className="password-input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="auth-input"
                value={signInPassword}
                onChange={e => setSignInPassword(e.target.value)}
                autoComplete="off"
              />
              <span className="toggle-password" onClick={() => setShowPassword(s => !s)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <a href="#" className="forgot-link">Forgot your password?</a>
            <button type="submit" className="submit-btn">Sign In</button>
          </form>
        </div>

        {/* Sign Up Form */}
        <div className="form-panel sign-up-panel">
          <form className="auth-form" onSubmit={handleSubmitSignup}>
            <h2>Create Account</h2>
            <div className="google-btn-wrapper">
              <GoogleLogin
                className="social-login"
                onSuccess={(cred) => handleGoogleSuccess(cred, 'signup')}
                onError={handleGoogleError}
                theme="outline" /* Changes filled blue background to transparent/outline */
                shape="pill"
                text="signup_with"
              />
              {googleLoadingSignup && (
                <div className="google-btn-loading-overlay">
                  <span className="google-btn-spinner" />
                </div>
              )}
            </div>
            <input
              type="text"
              placeholder="Full Name"
              className="auth-input"
              value={signUpName}
              onChange={e => setSignUpName(e.target.value)}
              autoComplete="off"
            />
            <input
              type="email"
              placeholder="Email"
              className="auth-input"
              value={signUpEmail}
              onChange={e => setSignUpEmail(e.target.value)}
              autoComplete="off"
            />
            <div className="password-input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="auth-input"
                value={signUpPassword}
                onChange={e => setSignUpPassword(e.target.value)}
                autoComplete="off"
              />
              <span className="toggle-password" onClick={() => setShowPassword(s => !s)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="password-input-group">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                className="auth-input"
                value={signUpConfirmPassword}
                onChange={e => setSignUpConfirmPassword(e.target.value)}
                autoComplete="off"
              />
              <span className="toggle-password" onClick={() => setShowConfirmPassword(s => !s)}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <button type="submit" className="submit-btn">Sign Up</button>
          </form>
        </div>
        {/* Overlay Panel */}
        <div className="overlay-panel">
          <div className="overlay-content">
            {isSignUp ? (
              <>
                <h2>New here?</h2>
                <p>Sign up and start saving with KoloPocket!</p>
                <button className="overlay-btn" onClick={() => setIsSignUp(false)}>Sign In</button>
              </>
            ) : (
              <>
                <h2>Welcome back!</h2>
                <p>Already have an account?</p>
                <button className="overlay-btn" onClick={() => setIsSignUp(true)}>Sign Up</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



export default AuthPage;