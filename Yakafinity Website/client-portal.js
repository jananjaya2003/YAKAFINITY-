(function () {
  let auth = null;
  let confirmationResult = null;

  function setMessage(text) {
    const msg = document.getElementById("authMessage");
    if (msg) msg.textContent = text;
  }

  function setPaymentsEnabled(enabled) {
    const config = window.YAKAFINITY_CONFIG || {};
    const payments = config.payments || {};
    const buttons = [
      { id: "stripePayBtn", link: payments.stripePaymentLink },
      { id: "paypalPayBtn", link: payments.paypalLink },
      { id: "payherePayBtn", link: payments.payhereLink }
    ];

    buttons.forEach((item) => {
      const el = document.getElementById(item.id);
      if (!el) return;
      const isActive = enabled && !!item.link;
      el.classList.toggle("disabled-link", !isActive);
      el.href = isActive ? item.link : "#";
    });
  }

  function handleAuthState(user) {
    if (user) {
      const label = user.email || user.phoneNumber || "Authenticated user";
      setMessage(`Logged in as ${label}. You can continue to payment.`);
      setPaymentsEnabled(true);
    } else {
      setMessage("Please login to continue to payment.");
      setPaymentsEnabled(false);
    }
  }

  function initFirebase() {
    const firebaseConfig = (window.YAKAFINITY_CONFIG && window.YAKAFINITY_CONFIG.firebase) || {};
    if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.appId) {
      setMessage("Firebase config not set. Add credentials in integrations-config.js");
      return false;
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    auth = firebase.auth();
    auth.onAuthStateChanged(handleAuthState);
    return true;
  }

  function setupGoogleLogin() {
    const googleBtn = document.getElementById("googleLoginBtn");
    googleBtn.addEventListener("click", async () => {
      if (!auth) return;
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
      } catch (error) {
        setMessage(`Google login failed: ${error.message}`);
      }
    });
  }

  function setupPhoneOtpLogin() {
    const sendBtn = document.getElementById("sendOtpBtn");
    const verifyBtn = document.getElementById("verifyOtpBtn");

    sendBtn.addEventListener("click", async () => {
      if (!auth) return;
      const phone = document.getElementById("phoneInput").value.trim();
      if (!phone) {
        setMessage("Enter mobile number with country code.");
        return;
      }
      try {
        if (!window.recaptchaVerifier) {
          window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container", { size: "normal" });
        }
        confirmationResult = await auth.signInWithPhoneNumber(phone, window.recaptchaVerifier);
        setMessage("OTP sent. Check your mobile and enter code.");
      } catch (error) {
        setMessage(`Send OTP failed: ${error.message}`);
      }
    });

    verifyBtn.addEventListener("click", async () => {
      const code = document.getElementById("otpCodeInput").value.trim();
      if (!confirmationResult || !code) {
        setMessage("Send OTP first, then enter code.");
        return;
      }
      try {
        await confirmationResult.confirm(code);
      } catch (error) {
        setMessage(`OTP verification failed: ${error.message}`);
      }
    });
  }

  function setupLogout() {
    const logoutBtn = document.getElementById("logoutClientBtn");
    logoutBtn.addEventListener("click", async () => {
      if (!auth) return;
      await auth.signOut();
    });
  }

  function showOrderId() {
    const badge = document.getElementById("orderBadge");
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("orderId");
    if (orderId && badge) {
      badge.textContent = `Order ID: ${orderId}`;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    showOrderId();
    setPaymentsEnabled(false);
    const ok = initFirebase();
    if (!ok) return;
    setupGoogleLogin();
    setupPhoneOtpLogin();
    setupLogout();
  });
})();
