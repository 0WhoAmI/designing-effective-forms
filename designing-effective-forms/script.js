let clickCount = 0;

const countryInput = document.getElementById("country");
const myForm = document.getElementById("form");
const modal = document.getElementById("form-feedback-modal");
const clicksInfo = document.getElementById("click-count");

function handleClick() {
  clickCount++;
  clicksInfo.innerText = clickCount;
}

async function fetchAndFillCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    if (!response.ok) {
      throw new Error("Błąd pobierania danych");
    }
    const data = await response.json();
    const countries = data.map((country) => country.name.common);
    countryInput.innerHTML = countries
      .map((country) => `<option value="${country}">${country}</option>`)
      .join("");
  } catch (error) {
    console.error("Wystąpił błąd:", error);
  }
}

function getCountryByIP() {
  fetch("https://get.geojs.io/v1/ip/geo.json")
    .then((response) => response.json())
    .then((data) => {
      const country = data.country;

      if (country) {
        const optionToSelect = Array.from(countryInput.options).find(
          (option) => option.value === country
        );

        if (optionToSelect) {
          countryInput.value = country;
        }

        getCountryCode(country);
      }
    })
    .catch((error) => {
      console.error("Błąd pobierania danych z serwera GeoJS:", error);
    });
}

function getCountryCode(countryName) {
  const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Błąd pobierania danych");
      }
      return response.json();
    })
    .then((data) => {
      const countryCode = data[0].idd.root + data[0].idd.suffixes.join("");

      const countryCodeSelect = document.getElementById("countryCode");
      const optionToSelect = Array.from(countryCodeSelect.options).find(
        (option) => option.value === countryCode
      );

      if (optionToSelect) {
        countryCodeSelect.value = countryCode;
      }
    })
    .catch((error) => {
      console.error("Wystąpił błąd:", error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");

  form.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      if (e.target.tagName.toLowerCase() === "textarea") return;

      e.preventDefault();
      if (form.checkValidity()) {
        form.requestSubmit();
      } else {
        form.reportValidity();
      }
    }
  });

  // Przykładowe inne skróty:
  document.addEventListener("keydown", (e) => {
    // Ctrl + L = wyczyść formularz
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "l") {
      e.preventDefault();
      form.reset();
    }
  });
});

(() => {
  // nasłuchiwania na zdarzenie kliknięcia myszką
  document.addEventListener("click", handleClick);

  fetchAndFillCountries().then(() => {
    getCountryByIP();
  });
})();
