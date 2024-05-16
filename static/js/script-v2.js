'use strict';
const apiURL = "https://script.google.com/macros/s/AKfycbwz5OO_NQUcCrurH1ErGgBUHmRF4CDZgefqRt1kUVBAA92VKfQ0iHGySX5g-g22cKfB/exec";


const callAPI = async (filename) => {
    let data = null;
    await fetch(`${apiURL}?q=${filename}`)
        .then((response) => response.json())
        .then((res) => {
            data = res
        });
    return data
};

const addSocialLink = () => {
    callAPI("SocialList").then(apiData => {
        let _social = ""
        apiData.forEach(element => {
            _social += `<li>
            <a href="${element.href}" target="${element.target}" class="${element.class}">
                <img class="w-8 h-8" src="${element.src_icon}"/>
            </a>
        </li>`;
        });
        document.getElementById("social_list").innerHTML = _social;
    });
};

const addContactDetails = () => {
    callAPI("Contacts").then(apiData => {
        let _social = ""
        apiData.forEach(element => {
            _social += `<li class="min-w-full flex items-center gap-4">
            <div class="border-2 p-2 rounded-md border-gray-300 shadow-md">
                <img class="w-8 h-8" src=${element.src_icon} />
            </div>

            <div class="w-[calc(100% - 46px)] max-w-[calc(100% - 46px)]">
              <p class="font-semibold text-lg text-gray-900">${element.title}</p>

              <a href="${element.href}" class="contact-link text-gray-800 text-md">${element.value}</a>
            </div>

          </li>`;
        });
        document.getElementById("contact_list").innerHTML = _social;
    });
};


const addProfileDetails = async () => {
    callAPI("Profile").then(apiData => {
        document.getElementById("name").innerHTML = apiData.name;
        document.getElementById("designation").innerHTML = apiData.designation;

    });
};

document.addEventListener("DOMContentLoaded", function (event) {
    addProfileDetails();
    addSocialLink();
    addContactDetails();
});

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}




// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");
// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.remove("hidden");
        navigationLinks[i].classList.add("text-orange-800");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.add("hidden");
        navigationLinks[i].classList.remove("text-orange-800");
      }
    } 
  });
}

document.querySelector("[data-nav-link='contact']").click();
