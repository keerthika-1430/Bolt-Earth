// Bolt Earth Service Worker — PWA offline support
const CACHE = 'bolt-earth-v1';
const OFFLINE_URLS = ['/', '/register-page', '/dashboard-page'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(OFFLINE_URLS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Network first, cache fallback
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
document.addEventListener("keydown", e => { if (e.key === "Enter") handleRegister();
 });
 document.getElementById("email").addEventListener("input", function () {
  this.value = this.value.toLowerCase();
});


// Bolt Earth Service Worker — PWA offline support
const CACHE = 'bolt-earth-v1';
const OFFLINE_URLS = ['/', '/register-page', '/dashboard-page'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(OFFLINE_URLS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Network first, cache fallback
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

/* =========================================================
   REGISTER PAGE JS
========================================================= */

// Auto lowercase email
document.getElementById("email").addEventListener("input", function () {
  this.value = this.value.toLowerCase();
});

// Enter key submit
document.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    handleRegister();
  }
});

// Generate unique Vehicle ID
function generateVehicleID() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = Math.floor(1000 + Math.random() * 9000);

  return (
    "BE-" +
    letters[Math.floor(Math.random() * letters.length)] +
    letters[Math.floor(Math.random() * letters.length)] +
    "-" +
    numbers
  );
}

// Register Function
async function handleRegister() {

  const ownerName = document.getElementById("ownerName").value.trim();
  const vehicleModel = document.getElementById("vehicleModel").value.trim();
  const numberPlate = document.getElementById("numberPlate").value.trim();

  const mobile = document.getElementById("mobile").value.trim();
  const address = document.getElementById("address").value.trim();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Validation
  if (
    !ownerName ||
    !vehicleModel ||
    !numberPlate ||
    !mobile ||
    !address ||
    !email ||
    !password
  ) {
    alert("Please fill all required fields");
    return;
  }

  // Generate Vehicle ID
  const vehicleID = generateVehicleID();

  // Create User Object
  const userData = {
    ownerName,
    vehicleModel,
    numberPlate,
    mobile,
    address,
    email,
    password,
    vehicleID,

    bookings: []
  };

  // Save User
  localStorage.setItem("bolt_user", JSON.stringify(userData));

  // Save token
  localStorage.setItem("bolt_token", "bolt_logged_in");

  // Save Vehicle ID separately
  localStorage.setItem("vehicle_id", vehicleID);

  // Success message
  alert("Registration Successful!\nVehicle ID: " + vehicleID);

  // Redirect
  window.location.href = "/dashboard-page";
}

/* =========================================================
   BOOKING HISTORY SYSTEM
========================================================= */

// Save Booking History
function saveBookingHistory(station, slot, amount) {

  const user = JSON.parse(localStorage.getItem("bolt_user"));

  if (!user.bookings) {
    user.bookings = [];
  }

  const booking = {
    bookingID: "BK" + Date.now(),
    station: station,
    slot: slot,
    amount: amount,
    date: new Date().toLocaleString(),
    status: "Booked"
  };

  user.bookings.push(booking);

  localStorage.setItem("bolt_user", JSON.stringify(user));
}

// Display Booking History
function loadBookingHistory() {

  const historyContainer = document.getElementById("bookingHistory");

  if (!historyContainer) return;

  const user = JSON.parse(localStorage.getItem("bolt_user"));

  if (!user || !user.bookings || user.bookings.length === 0) {

    historyContainer.innerHTML = `
      <div class="empty-history">
        No bookings found
      </div>
    `;

    return;
  }

  let html = "";

  user.bookings.reverse().forEach(booking => {

    html += `
      <div class="history-card">
        <h3>${booking.station}</h3>

        <p><strong>Booking ID:</strong> ${booking.bookingID}</p>

        <p><strong>Slot:</strong> ${booking.slot}</p>

        <p><strong>Amount:</strong> ₹${booking.amount}</p>

        <p><strong>Date:</strong> ${booking.date}</p>

        <p><strong>Status:</strong> ${booking.status}</p>
      </div>
    `;
  });

  historyContainer.innerHTML = html;
}

/* =========================================================
   PROFILE DETAILS
========================================================= */

function loadProfile() {

  const user = JSON.parse(localStorage.getItem("bolt_user"));

  if (!user) return;

  if (document.getElementById("profileOwner")) {
    document.getElementById("profileOwner").innerText = user.ownerName;
  }

  if (document.getElementById("profileVehicle")) {
    document.getElementById("profileVehicle").innerText =
      user.vehicleModel;
  }

  if (document.getElementById("profilePlate")) {
    document.getElementById("profilePlate").innerText =
      user.numberPlate;
  }

  if (document.getElementById("profileVehicleID")) {
    document.getElementById("profileVehicleID").innerText =
      user.vehicleID;
  }
}

/* =========================================================
   LOGOUT
========================================================= */

function logout() {

  localStorage.removeItem("bolt_token");

  window.location.href = "/";
}

/* =========================================================
   AUTO LOAD
========================================================= */

window.onload = function () {

  loadProfile();

  loadBookingHistory();
};
// LOGIN FUNCTION

async function handleLogin() {

  const email = document
    .getElementById("email")
    .value
    .trim()
    .toLowerCase();

  const password = document
    .getElementById("password")
    .value
    .trim();

  // Get saved user
  const user = JSON.parse(localStorage.getItem("bolt_user"));

  // Check user exists
  if (!user) {
    showError("No account found. Please register first.");
    return;
  }

  // Match email & password
  if (
    user.email === email &&
    user.password === password
  ) {

    // Save login token
    localStorage.setItem("bolt_token", "logged_in");

    // Redirect
    window.location.href = "/dashboard-page";

  } else {

    showError("Invalid email or password");

  }
}

// Error Message
function showError(message) {

  const errorBox = document.getElementById("errorMsg");

  errorBox.innerText = message;

  errorBox.style.display = "block";
}

// Enter key login
document.addEventListener("keydown", function(e) {

  if (e.key === "Enter") {

    handleLogin();

  }
});

// Email lowercase
document.getElementById("email").addEventListener("input", function () {

  this.value = this.value.toLowerCase();

});


