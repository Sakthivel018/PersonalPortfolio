const apiURL = "https://script.google.com/macros/s/AKfycbzh4mYL-EMU3V8qNaE__okpl7Gm1QLhmZGAmOK7Nsghi_q30SKOX5bXeKSkZDfcmtOl/exec";


fetch(`${apiURL}?q=SocialList`)
  .then((response) => response.json())
  .then((data) => {
    let _social = ""
    data.forEach(element => {
      const href = element.href;
      const target = element.target;
      const a_class = element.class;
      const iconname = element.icon_name;
      li = `<li class="social-item">
            <a href="${href}" target="${target}" class="${a_class}">
              <ion-icon name="${iconname}"></ion-icon>
            </a>
          </li>`
      _social = _social + li;
    });
    document.getElementById("social_list").innerHTML = _social
  });

fetch(`${apiURL}?q=Profile`)
  .then((response) => response.json())
  .then((apiData) => {
    document.getElementById("name").innerHTML = apiData.name;
    document.getElementById("designation").innerHTML = apiData.designation;
    document.getElementById("email").innerHTML = apiData.email;
    document.getElementById("ph_no").innerHTML = apiData.ph_no;
    document.getElementById("birthday").innerHTML = apiData.birthday;
    document.getElementById("location").innerHTML = apiData.location;
    let about_me = ""
    apiData.about_me.forEach((p) => {
      let p_tag = `<p>${p}</p>`
      about_me = about_me + p_tag
    })
    document.getElementById("about_me").innerHTML = about_me;
    let services = ""
    apiData.what_im_doing.forEach((service) => {
      const src = service.src;
      const alt = service.alt;
      const title = service.title;
      const text = service.text;
      let service_tag = `<li class="service-item">

            <div class="service-icon-box">
              <img src="${src}" alt="${alt}" width="40">
            </div>

            <div class="service-content-box">
              <h4 class="h4 service-item-title">${title}</h4>

              <p class="service-item-text">
                ${text}
              </p>
            </div>

          </li>`
      services = services + service_tag
    })
    document.getElementById("service_list").innerHTML = services;
  });


fetch(`${apiURL}?q=Testimonials`)
  .then((response) => response.json())
  .then((data) => {
    let testimonials = ""
    data.forEach((service) => {
      const src = service.src;
      const alt = service.alt;
      const title = service.title;
      const text = service.text;
      let li_tag = ` <li class="testimonials-item">
          <div class="content-card" data-testimonials-item>

            <figure class="testimonials-avatar-box">
              <img src="${src}" alt="${alt}" width="60" data-testimonials-avatar>
            </figure>

            <h4 class="h4 testimonials-item-title" data-testimonials-title>${title}</h4>

            <div class="testimonials-text" data-testimonials-text>
              <p>
                ${text}
              </p>
            </div>

          </div>
        </li>`
      testimonials = testimonials + li_tag
    })
    document.getElementById("testimonials").innerHTML = testimonials;
  });


fetch(`${apiURL}?q=Education`)
  .then((response) => response.json())
  .then((data) => {
    let education = ""
    data.forEach((edu) => {
      const place = edu.place;
      const span = edu.span;
      const description = edu.description;
      let li_tag = `<li class="timeline-item">

        <h4 class="h4 timeline-item-title">${place}</h4>

        <span>${span}</span>

        <p class="timeline-text">
          ${description}
        </p>

      </li>`
      education = education + li_tag
    })
    document.getElementById("education").innerHTML = education;
  });

fetch(`${apiURL}?q=Experience`)
  .then((response) => response.json())
  .then((data) => {
    let experience = ""
    data.forEach((exp) => {
      const title = exp.title;
      const span = exp.span;
      const description = exp.description;
      let li_tag = `<li class="timeline-item">

        <h4 class="h4 timeline-item-title">${title}</h4>

        <span>${span}</span>

        <p class="timeline-text">
          ${description}
        </p>

      </li>`
      experience = experience + li_tag
    })
    document.getElementById("experience").innerHTML = experience;
  });

fetch(`${apiURL}?q=Skills`)
  .then((response) => response.json())
  .then((data) => {
    let skills = ""
    data.forEach((skill) => {
      const name = skill.name;
      const score = skill.score;
      let li_tag = `            <li class="skills-item">

        <div class="title-wrapper">
          <h5 class="h5">${name}</h5>
          <data value="${score}">${score}</data>
        </div>

        <div class="skill-progress-bg">
          <div class="skill-progress-fill" style="width: ${score};"></div>
        </div>

      </li>`
      skills = skills + li_tag
    })
    document.getElementById("skills").innerHTML = skills;
  });

fetch(`${apiURL}?q=Certifications`)
  .then((response) => response.json())
  .then((data) => {
    let certifications = ""
    data.forEach((exp) => {
      const title = exp.title;
      const span = exp.span;
      let li_tag = `<li class="timeline-item">

        <h4 class="h4 timeline-item-title">${title}</h4>

        <span>${span}</span>

      </li>`
      certifications = certifications + li_tag
    })
    document.getElementById("certifications").innerHTML = certifications;
  });

fetch(`${apiURL}?q=Blogs`)
  .then((response) => response.json())
  .then((data) => {
    let blogs = ""
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
        <a onclick="showDetails('blog','${href}');" style="cursor: pointer;">

          <figure class="blog-banner-box">
            <img src="${img_src}" alt="${img_alt}" loading="lazy">
          </figure>

          <div class="blog-content">

            <div class="blog-meta">
              <p class="blog-category">${header}</p>

              <span class="dot"></span>

              <time datetime="${date_time_value}">${date_time}</time>
            </div>

            <h3 class="h3 blog-item-title">${sub_title}</h3>

            <p class="blog-text">
              ${description}
            </p>

          </div>

        </a>
      </li>`
      blogs = blogs + li_tag
    })
    document.getElementById("blogs").innerHTML = blogs;
  });


fetch(`${apiURL}?q=Projects`)
  .then((response) => response.json())
  .then((data) => {
    let projects = "";
    let allCategories = new Set();;
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
      let li_tag = `<li class="project-item active" data-filter-item data-category="${category}">
      <a onclick="showDetails('project','${href}');" style="cursor: pointer;">
        <figure class="project-img">
          <img src="${img_src}" alt="${img_alt}" loading="lazy">
        </figure>
        <h3 class="project-title">${header}</h3>
        <p class="project-category">${category}</p>
      </a>
    </li>`
      projects = projects + li_tag
    })
    allCategories = Array.from(allCategories);
    let filter_text = "";
    let select_text = "";
    allCategories.forEach((each_category) => {
      filter_text += `<li class="filter-item">
        <button ${each_category === 'All' ? 'class="active"' : ''} data-filter-btn>${each_category}</button>
      </li>`;
      select_text += `<li class="select-item">
        <button data-select-item>${each_category}</button>
      </li>`
    });
    document.getElementById("project_list").innerHTML = projects;
    document.getElementById("project_filter_list").innerHTML = filter_text;
    document.getElementById("project_select_list").innerHTML = select_text;
    document.getElementById("loader").style.display = "none";
  });

const showDetails = (type, href) => {
  document.getElementById("loader").style.display = "block";
  document.querySelector(".go_back").removeEventListener('click', () => { });
  hideArticles('renderer');
  fetch(`${apiURL}?q=${href}&p=${type}`)
    .then((response) => response.json())
    .then((data) => {
      const iframe = document.querySelector('#pageRender div');
      // const iframeDocument = iframe.contentWindow.document;
      // iframeDocument.open();
      // iframeDocument.write(data.content);
      // iframeDocument.close();
      iframe.innerHTML = data.content;
      document.getElementById("loader").style.display = "none";
    });
  document.querySelector(".go_back").addEventListener('click', () => {
    document.querySelector(`.renderer`).classList.remove("active");
    document.querySelector(`.${type}`).classList.add("active");
  });
};

const hideArticles = className => {
  const pages = document.querySelectorAll("[data-page]");
  pages.forEach(articlePage => {
    articlePage.classList.remove("active");
  });
  window.scrollTo(0, 0);
  document.querySelector(`.${className}`).classList.add("active");
};
