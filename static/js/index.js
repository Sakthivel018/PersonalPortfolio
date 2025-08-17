'use strict';

// element toggle function
const elementToggleFunc = function (elem) { 
  elem.classList.toggle("active"); 
}

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { 
  elementToggleFunc(sidebar); 
});

// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {
  testimonialsItem[i].addEventListener("click", function () {
    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;
    testimonialsModalFunc();
  });
}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);

// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-select-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { 
  elementToggleFunc(this); 
});

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);
    
    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}

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

// Function to scroll content to top
const scrollToTop = function(targetPage) {
  // Scroll the main window to top
  window.scrollTo(0, 0);
  
  // Also scroll the specific article to top
  const activeArticle = document.querySelector(`[data-page="${targetPage}"]`);
  if (activeArticle) {
    activeArticle.scrollTop = 0;
  }
  
  // Scroll main content container to top if it exists
  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    mainContent.scrollTop = 0;
  }
}

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    const targetPageName = this.innerHTML.toLowerCase();
    
    // Remove active class from renderer
    document.querySelector(`.renderer`).classList.remove("active");
      
    // Clear the render content when switching pages
    const renderContent = document.querySelector('#render-content');
    if (renderContent) {
      renderContent.innerHTML = '';
    }
    // Remove active class from all pages and nav links first
    for (let j = 0; j < pages.length; j++) {
      pages[j].classList.remove("active");
      navigationLinks[j].classList.remove("active");
    }
    
    // Add active class to clicked nav and corresponding page
    for (let j = 0; j < pages.length; j++) {
      if (targetPageName === pages[j].dataset.page) {
        // Add active classes
        pages[j].classList.add("active");
        this.classList.add("active");
        
        // Scroll to top after a brief delay to ensure the page is active
        setTimeout(() => {
          scrollToTop(targetPageName);
        }, 50);
        
        // Store state
        localStorage.setItem('articleState', targetPageName);
        break;
      }
    }
  });
}

const changeState = () => {
  const storedState = localStorage.getItem('articleState');
  if (storedState) {
    const targetButton = document.querySelector(`[load-page="${storedState}"]`);
    if (targetButton) {
      targetButton.click();
      // Ensure scroll to top after state change
      setTimeout(() => {
        scrollToTop(storedState);
      }, 100);
    }
  }
};

// Enhanced window load event
window.addEventListener('load', function() {
  changeState();
  // Additional scroll to top on page load
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 200);
});

// Also handle page visibility changes (when user returns to tab)
document.addEventListener('visibilitychange', function() {
  if (!document.hidden) {
    const currentActive = document.querySelector('article.active');
    if (currentActive) {
      setTimeout(() => {
        scrollToTop(currentActive.dataset.page);
      }, 100);
    }
  }
});