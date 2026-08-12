/* ============================================================
   BARBER 4 ALL - BOOKING FORM (B4N / wowhair site)
   ------------------------------------------------------------
   Sends the booking form to the Google Sheet via Apps Script.
   Uses mode "no-cors" (send-and-forget) which works in every
   browser; the response body can't be read, so success is shown
   once the request is sent and the sheet is the source of truth.
   ============================================================ */

var B4A_BOOKING_CONFIG = {
  /* Deployed Apps Script web app URL (already live). */
  appsScriptUrl: "https://script.google.com/macros/s/AKfycbxu6UuYGuvO0h1t6TkJ67Ls8FyGRZryWK29j2BAtWGs6oE418os8Wti5BjLDWyOf5bK/exec",

  /* Services shown in the booking form (matches the Service Menu). */
  services: [
    "Signature Haircuts",
    "Beard Trims",
    "Wash & Scalp Care",
    "Beard Sculpting",
    "Kids Haircuts",
    "3D Design Add-ons",
    "Dyeing",
    "Manicure",
    "Pedicure",
    "Homecall"
  ],

  /* Barbers available for booking. */
  barbers: [
    "No preference",
    "Ng'ash",
    "Jay"
  ],

  /* Available time slots (24h format). */
  timeSlots: [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"
  ],

  /* Message shown after a successful booking. */
  successMessage: "Thanks! Your appointment request has been sent. Check your email for a confirmation - we'll also confirm on WhatsApp or by phone."
};

(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState !== "loading") { fn(); }
    else { document.addEventListener("DOMContentLoaded", fn); }
  }

  ready(function () {
    var form = document.getElementById("b4a-booking-form");
    if (!form) { return; }

    fillSelect("b4a-booking-service", B4A_BOOKING_CONFIG.services, "Select a service");
    fillSelect("b4a-booking-barber", B4A_BOOKING_CONFIG.barbers, null);
    fillSelect("b4a-booking-time", B4A_BOOKING_CONFIG.timeSlots, "Select a time");

    var dateInput = document.getElementById("b4a-booking-date");
    if (dateInput) {
      dateInput.min = todayISO();
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var messageBox = document.getElementById("b4a-booking-response");
      var submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
      var originalValue = submitButton ? submitButton.innerHTML : "";

      clearMessage(messageBox);

      var data = collectData(form);
      if (!data) {
        showMessage(messageBox, "Please fill in all the required fields.", "error");
        return;
      }

      if (!B4A_BOOKING_CONFIG.appsScriptUrl) {
        showMessage(messageBox, "The booking form is not connected yet. Please contact us on WhatsApp at +254 733 572239.", "error");
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = "Sending...";
      }

      fetch(B4A_BOOKING_CONFIG.appsScriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(data)
      }).then(function () {
        finishSuccess(form, submitButton, originalValue, messageBox);
      }).catch(function () {
        finishError(submitButton, originalValue, messageBox, "Something went wrong. Please try again or WhatsApp us at +254 733 572239.");
      });
    });
  });

  function fillSelect(id, values, placeholder) {
    var select = document.getElementById(id);
    if (!select || !values) { return; }
    if (placeholder) {
      var ph = document.createElement("option");
      ph.value = "";
      ph.textContent = placeholder;
      select.appendChild(ph);
    }
    values.forEach(function (value) {
      var option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function collectData(form) {
    var get = function (name) {
      var field = form.elements[name];
      return field ? field.value.trim() : "";
    };

    var name = get("b4a-name");
    var phone = get("b4a-phone");
    var email = get("b4a-email");
    var service = get("b4a-service");
    var date = get("b4a-date");
    var time = get("b4a-time");

    if (!name || !phone || !service || !date || !time) { return null; }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { return null; }

    return {
      name: name,
      phone: phone,
      email: email,
      service: service,
      barber: get("b4a-barber"),
      date: date,
      time: time,
      notes: get("b4a-notes")
    };
  }

  function todayISO() {
    var now = new Date();
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var day = ("0" + now.getDate()).slice(-2);
    return now.getFullYear() + "-" + month + "-" + day;
  }

  function showMessage(box, text, type) {
    if (!box) { return; }
    box.textContent = text;
    box.className = "booking-response " + (type === "error" ? "booking-error" : "booking-success");
    box.style.display = "block";
    box.setAttribute("aria-hidden", "false");
  }

  function clearMessage(box) {
    if (!box) { return; }
    box.textContent = "";
    box.style.display = "none";
    box.setAttribute("aria-hidden", "true");
  }

  function finishSuccess(form, submitButton, originalValue, messageBox) {
    form.reset();
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerHTML = originalValue;
    }
    showMessage(messageBox, B4A_BOOKING_CONFIG.successMessage, "success");
  }

  function finishError(submitButton, originalValue, messageBox, message) {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerHTML = originalValue;
    }
    showMessage(messageBox, message, "error");
  }
})();
