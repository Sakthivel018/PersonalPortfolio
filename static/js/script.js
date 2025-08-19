const apiURL = "https://script.google.com/macros/s/AKfycbwnnth6HVa_OX_QjMEl6cAHD41pV60MPfCJCZlIVzZDzhbijNXmCSsdV2psMOEyN61K/exec";

// Fetch social links
fetch(`${apiURL}?q=SocialList`)
  .then((response) => response.json())
  .then((data) => {
    let _social = "";
    data.forEach(element => {
      const href = element.href;
      const target = element.target;
      const a_class = element.class;
      const iconname = element.icon_name;
      li = `<li class="social-item">
            <a href="${href}" target="${target}" class="${a_class}">
              <ion-icon name="${iconname}"></ion-icon>
            </a>
          </li>`;
      _social = _social + li;
    });
    document.getElementById("social_list").innerHTML = _social;
  });

// Fetch profile information
fetch(`${apiURL}?q=Profile`)
  .then((response) => response.json())
  .then((apiData) => {
    document.getElementById("name").innerHTML = apiData.name;
    document.getElementById("designation").innerHTML = apiData.designation;
    document.getElementById("email").innerHTML = apiData.email;
    document.getElementById("ph_no").innerHTML = apiData.ph_no;
    document.getElementById("birthday").innerHTML = apiData.birthday;
    document.getElementById("location").innerHTML = apiData.location;
    
    let about_me = "";
    apiData.about_me.forEach((p) => {
      let p_tag = `<p>${p}</p>`;
      about_me = about_me + p_tag;
    });
    document.getElementById("about_me").innerHTML = about_me;
    
    let services = "";
    apiData.what_im_doing.forEach((service) => {
      const src = service.src;
      const alt = service.alt;
      const title = service.title;
      const text = service.text;
      let service_tag = `<li class="service-item relative bg-gradient-to-br from-[#222] to-[#111] p-5 rounded-xl shadow-custom-2 z-10 before:content-[''] before:absolute before:inset-1 before:bg-gradient-to-br before:from-[#0a0a0a] before:to-[#0d0d0d] before:rounded-xl before:-z-10 lg:flex lg:items-start lg:gap-5 lg:p-8">
            <div class="service-icon-box mb-2.5 lg:mb-0 lg:mt-1">
              <img src="${src}" alt="${alt}" width="40" class="mx-auto">
            </div>
            <div class="service-content-box text-center lg:text-left">
              <h4 class="h4 service-item-title text-base font-medium text-white capitalize mb-2">${title}</h4>
              <p class="service-item-text text-sm text-text font-light leading-relaxed">
                ${text}
              </p>
            </div>
          </li>`;
      services = services + service_tag;
    });
    document.getElementById("service_list").innerHTML = services;
  });

// Fetch testimonials
fetch(`${apiURL}?q=Testimonials`)
  .then((response) => response.json())
  .then((data) => {
    let testimonials = "";
    data.forEach((service) => {
      const src = service.src;
      const alt = service.alt;
      const title = service.title;
      const text = service.text;
      let li_tag = `<li class="testimonials-item min-w-full snap-center">
          <div class="content-card relative bg-gradient-to-br from-[#222] to-[#111] p-4 pt-12 rounded-xl shadow-custom-2 cursor-pointer z-10 before:content-[''] before:absolute before:inset-1 before:bg-gradient-to-br before:from-[#0a0a0a] before:to-[#0d0d0d] before:rounded-xl before:-z-10 lg:p-8 lg:pt-16" data-testimonials-item>
            <figure class="testimonials-avatar-box absolute top-0 left-0 translate-x-4 -translate-y-6 bg-gradient-to-br from-[#0a0a0a] to-[#111] rounded-xl shadow-custom-1 lg:translate-x-8 lg:-translate-y-8 lg:rounded-2xl">
              <img src="${src}" alt="${alt}" width="60" data-testimonials-avatar class="lg:w-20">
            </figure>
            <h4 class="h4 testimonials-item-title text-base font-medium text-white capitalize mb-2 lg:ml-24">${title}</h4>
            <div class="testimonials-text text-sm text-text font-light leading-relaxed line-clamp-4 overflow-hidden lg:line-clamp-2" data-testimonials-text>
              <p>
                ${text}
              </p>
            </div>
          </div>
        </li>`;
      testimonials = testimonials + li_tag;
    });
    document.getElementById("testimonials").innerHTML = testimonials;
  });

// Fetch education
fetch(`${apiURL}?q=Education`)
  .then((response) => response.json())
  .then((data) => {
    let education = "";
    data.forEach((edu) => {
      const place = edu.place;
      const span = edu.span;
      const description = edu.description;
      let li_tag = `<li class="timeline-item relative mb-5 lg:mb-6">
        <h4 class="h4 timeline-item-title text-sm font-medium leading-relaxed mb-2 lg:text-base">${place}</h4>
        <span class="text-accent font-normal leading-relaxed">${span}</span>
        <p class="timeline-text text-text font-light leading-relaxed">
          ${description}
        </p>
      </li>`;
      education = education + li_tag;
    });
    document.getElementById("education").innerHTML = education;
  });

// Fetch experience
fetch(`${apiURL}?q=Experience`)
  .then((response) => response.json())
  .then((data) => {
    let experience = "";
    data.forEach((exp) => {
      const title = exp.title;
      const span = exp.span;
      const description = exp.description;
      let li_tag = `<li class="timeline-item relative mb-5 lg:mb-6">
        <h4 class="h4 timeline-item-title text-sm font-medium leading-relaxed mb-2 lg:text-base">${title}</h4>
        <span class="text-accent font-normal leading-relaxed">${span}</span>
        <p class="timeline-text text-text font-light leading-relaxed">
          ${description}
        </p>
      </li>`;
      experience = experience + li_tag;
    });
    document.getElementById("experience").innerHTML = experience;
  });

// Fetch skills
fetch(`${apiURL}?q=Skills`)
  .then((response) => response.json())
  .then((data) => {
    let skills = "";
    data.forEach((skill) => {
      const name = skill.name;
      const score = skill.score;
      let li_tag = `<li class="skills-item mb-4 lg:mb-6">
        <div class="title-wrapper flex items-center gap-1 mb-2">
          <h5 class="h5 text-sm font-medium">${name}</h5>
          <data value="${score}" class="text-text-light text-xs font-light">${score}</data>
        </div>
        <div class="skill-progress-bg bg-[#222] w-full h-2 rounded-xl">
          <div class="skill-progress-fill bg-gradient-to-r from-accent to-accent-light h-full rounded-xl" style="width: ${score};"></div>
        </div>
      </li>`;
      skills = skills + li_tag;
    });
    document.getElementById("skills").innerHTML = skills;
  });

// Fetch certifications
fetch(`${apiURL}?q=Certifications`)
  .then((response) => response.json())
  .then((data) => {
    let certifications = "";
    data.forEach((exp) => {
      const title = exp.title;
      const span = exp.span;
      let li_tag = `<li class="timeline-item relative mb-5 lg:mb-6">
        <h4 class="h4 timeline-item-title text-sm font-medium leading-relaxed mb-2 lg:text-base">${title}</h4>
        <span class="text-accent font-normal leading-relaxed">${span}</span>
      </li>`;
      certifications = certifications + li_tag;
    });
    document.getElementById("certifications").innerHTML = certifications;
  });

// Fetch blogs
fetch(`${apiURL}?q=Blogs`)
  .then((response) => response.json())
  .then((data) => {
    let blogs = "";
    data.forEach((blog) => {
      const href = blog.href;
      const img_src = blog.img_src;
      const img_alt = blog.img_alt;
      const header = blog.header;
      const date_time = blog.date_time;
      const date_time_value = blog.date_time_value;
      const sub_title = blog.sub_title;
      const description = blog.description;
      let li_tag = `<li class="blog-post-item">
        <a onclick="showDetails('blog','${href}');" class="relative bg-gradient-to-br from-[#222] to-[#111] h-full shadow-custom-4 rounded-xl z-10 before:content-[''] before:absolute before:inset-1 before:bg-[#0a0a0a] before:rounded-xl before:-z-10">
          <figure class="blog-banner-box w-full h-48 rounded-xl overflow-hidden mb-4 lg:h-56">
            <img src="${img_src}" alt="${img_alt}" loading="lazy" class="w-full h-full object-cover transition-transform duration-300 hover:scale-110">
          </figure>
          <div class="blog-content p-4 lg:p-6">
            <div class="blog-meta flex justify-start items-center gap-2 mb-2.5">
              <p class="blog-category text-text-light text-xs font-light">${header}</p>
              <span class="dot bg-text-light w-1 h-1 rounded-full"></span>
              <time datetime="${date_time_value}" class="text-text-light text-xs font-light">${date_time}</time>
            </div>
            <h3 class="h3 blog-item-title text-base font-medium leading-relaxed mb-2.5 transition-colors duration-300 hover:text-accent">${sub_title}</h3>
            <p class="blog-text text-text font-light leading-relaxed text-sm">
              ${description}
            </p>
          </div>
        </a>
      </li>`;
      blogs = blogs + li_tag;
    });
    document.getElementById("blogs").innerHTML = blogs;
  });

// Fetch projects
fetch(`${apiURL}?q=Projects`)
  .then((response) => response.json())
  .then((data) => {
    let projects = "";
    let allCategories = new Set();
    allCategories.add("All");
    
    data.forEach((eachProject) => {
      if (!eachProject.visible) {
        return null;
      }
      
      const href = eachProject.href;
      const img_src = eachProject.img_src;
      const img_alt = eachProject.img_alt;
      const header = eachProject.header;
      const sub_title = eachProject.sub_title;
      const description = eachProject.description;
      const category = eachProject.category;
      allCategories.add(category);
      
      let li_tag = `<li class="project-item active animate-scale-up" data-filter-item data-category="${category}">
      <a onclick="showDetails('projects','${href}');" class="w-full">
        <figure class="project-img relative w-full h-48 rounded-xl overflow-hidden mb-4 lg:h-52">
          <div class="absolute inset-0 bg-transparent z-10 transition-all duration-300"></div>
          <div class="project-item-icon-box absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#222] text-accent text-xl p-5 rounded-xl opacity-0 z-10 transition-all duration-300" style="--scale: 0.8;">
            <ion-icon name="link-outline"></ion-icon>
          </div>
          <img src="${img_src}" alt="${img_alt}" loading="lazy" class="w-full h-full object-cover transition-transform duration-300">
        </figure>
        <h3 class="project-title text-base font-medium text-white capitalize leading-relaxed ml-2.5">${header}</h3>
        <p class="project-category text-text-light text-xs font-light ml-2.5">${category}</p>
      </a>
    </li>`;
      projects = projects + li_tag;
    });
    
    allCategories = Array.from(allCategories);
    let filter_text = "";
    let select_text = "";
    
    allCategories.forEach((each_category) => {
      filter_text += `<li class="filter-item">
        <button class="${each_category === 'All' ? 'text-accent' : 'text-text'} text-sm font-normal transition-colors duration-300 hover:text-text-light" data-filter-btn>${each_category}</button>
      </li>`;
      
      select_text += `<li class="select-item">
        <button class="bg-secondary text-text text-sm font-light w-full p-2 rounded-lg" data-select-item>${each_category}</button>
      </li>`;
    });
    
    document.getElementById("project_list").innerHTML = projects;
    document.getElementById("project_filter_list").innerHTML = filter_text;
    document.getElementById("project_select_list").innerHTML = select_text;
    document.getElementById("loader").style.display = "none";
  });

// Show details function
const showDetails = (type, href) => {
  // Clear the render content when switching pages
  const renderContent = document.querySelector('#render-content');
  if (renderContent) {
    renderContent.innerHTML = '';
  }
  document.getElementById("loader").style.display = "flex";
  // document.querySelector(".go_back").removeEventListener('click', () => {
  //   document.querySelector(`.renderer`).classList.remove("active");
  //   document.querySelector(`.${type}`).classList.add("active");
  // });
  
  hideArticles('renderer');
  
  fetch(`${apiURL}?q=${href}&p=${type}`)
    .then((response) => response.json())
    .then((data) => {
      const iframe = document.querySelector('#render-content');
      iframe.innerHTML = data.content;
      document.getElementById("loader").style.display = "none";
    });
    
  // document.querySelector(".go_back").addEventListener('click', () => {
  //   document.querySelector(`.renderer`).classList.remove("active");
  //   document.querySelector(`.${type}`).classList.add("active");
  // });
};

// Hide articles function
const hideArticles = className => {
  const pages = document.querySelectorAll("[data-page], .renderer");
  pages.forEach(articlePage => {
    articlePage.classList.remove("active");
  });
  window.scrollTo(0, 0);
  document.querySelector(`.${className}`).classList.add("active");
  if (className !== "renderer") {
    localStorage.setItem('articleState', className);
  }
};

document.querySelector('.go_back').addEventListener('click', function() {
  // Hide the renderer
  document.querySelector('.renderer').classList.remove('active');
  
  // Clear the render content
  const renderContent = document.querySelector('#render-content');
  if (renderContent) {
    renderContent.innerHTML = '';
  }
  
  // Get the currently active navigation link to determine which section to show
  const activeNavLink = document.querySelector('.navbar-link.active');
  if (activeNavLink) {
    const targetPage = activeNavLink.getAttribute('load-page') || activeNavLink.innerHTML.toLowerCase();
    
    // Hide all pages first
    const allPages = document.querySelectorAll('[data-page]');
    allPages.forEach(page => page.classList.remove('active'));
    
    // Show only the target page
    const targetPageElement = document.querySelector(`[data-page="${targetPage}"]`);
    if (targetPageElement) {
      targetPageElement.classList.add('active');
    }
  }
  
  // Scroll to top
  window.scrollTo(0, 0);
});