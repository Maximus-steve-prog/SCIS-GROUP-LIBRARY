jQuery(function(){

    // Define custom extension validation method
    jQuery.validator.addMethod("extension", function(value, element, param) {
      if (this.optional(element)) {
        return true;
      }
      if (!value) {
        return false; // or true if empty allowed
      }
      var extension = value.split('.').pop().toLowerCase();
      // param is a string of allowed extensions, e.g., "jpg|png|gif"
      return param.split('|').indexOf(extension) !== -1;
    }, "Please select a file with a valid extension.");

    jQuery('.nav-item').on('mouseover', function(){
        jQuery(this).find('.sub-item').stop(true, true).slideDown(500);
    });
    function applyTheme(isDark) {
            if (isDark) {
              jQuery('body').addClass('dark');
              jQuery('#themeIcon').removeClass('fa-sun').addClass('fa-moon');
            } else {
              jQuery('body').removeClass('dark');
              jQuery('#themeIcon').removeClass('fa-moon').addClass('fa-sun');
            }
    }
        
    // Load saved preference
    const darkModePref = localStorage.getItem('darkMode');
    if (darkModePref !== null) {
      applyTheme(darkModePref === 'true');
    } else {
      // Default to light mode
      applyTheme(false);
    }
        
    jQuery('.darkModeToggle').click(function() {
      const isDark = jQuery('body').hasClass('dark');
      // Toggle theme
      applyTheme(!isDark);
      // Save preference
      localStorage.setItem('darkMode', !jQuery('body').hasClass('dark'));
    });

    const swiper = new Swiper('.mySwiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
            pagination: {
              el: '.swiper-pagination',
              clickable: true,
            },
            breakpoints: {
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            },
    });

    jQuery('.toggle_menu').on('click', function(){
        jQuery('nav').toggleClass('active');
    })

    jQuery(document).on('mouseover', function(e){
            if(!jQuery(e.target).closest('.nav-item, .sub-item, .item, nav').length){
                jQuery('.sub-item').stop(true, true).slideUp(300);
            }
    })

    jQuery(document).on('click', function(e){
            if(!jQuery(e.target).closest('nav, .toggle_menu').length){
                jQuery('nav').removeClass('active');
            }
    })

    jQuery(window).resize(function() {
         if (jQuery(window).width() < 768) {
            jQuery('.nav-item').on('mouseover', function(){
                jQuery(this).find('.sub-item').css('display', 'none');
            });
         } else if (jQuery(window).width() < 400) {
        
         
         }
    });

    jQuery('section .border').hover(
        function() {
          jQuery(this).addClass('shadow-lg');
        },
        function() {
          jQuery(this).removeClass('shadow-lg');
        }
    );
    
      // Search filter
    jQuery('#searchInput').keyup(function() {
        const query = jQuery(this).val().toLowerCase();
        jQuery('section .container .list .border').each(function() {
          const name = jQuery(this).find('h2').text().toLowerCase();
          if (name.includes(query)) {
            jQuery(this).parent().show();
          } else {
            jQuery(this).parent().hide();
          }
        });
    });
    if(jQuery(window).on('scroll', function() {
      jQuery('nav').removeClass('active');
    }));

    var jQuerycircle = jQuery('#circleProgress');

    // Function to update the progress circle based on scroll
    function updateProgress() {
        var scrollTop = jQuery(window).scrollTop();
        var docHeight = jQuery(document).height() - jQuery(window).height();
        var scrollPercent = Math.min((scrollTop / docHeight) * 100, 100);
        var degree = (scrollPercent / 100) * 360;

        // Set the conic-gradient with the progress
        jQuerycircle.css('background', `conic-gradient(rgba(99, 102, 241, 1) ${degree}deg, transparent ${degree}deg, transparent 360deg)`);

        // Optional: hide button when at top
        if (scrollTop > 50) {
        jQuerycircle.fadeIn();
        } else {
        jQuerycircle.fadeOut();
        }
    }

    // Scroll event to update progress
    jQuery(window).on('scroll', updateProgress);
    // Initialize on load
    updateProgress();

    // Click event to scroll to top
    jQuerycircle.on('click', function() {
        jQuery('html, body').animate({ scrollTop: 0 }, 600);
    });


  function showPopup(jQuerypopup) {
        // Show overlay
        jQuery('#overlay').removeClass('hidden');
        // Show popup container
        jQuerypopup.removeClass('hidden').attr('aria-hidden', 'false');
        // Animate popup content
        const jQuerycontent = jQuerypopup.find('> div');
        jQuerycontent.removeClass('scale-0 opacity-0').addClass('scale-100 opacity-100');
  }
    
  function hidePopup(jQuerypopup) {
        const jQuerycontent = jQuerypopup.find('> div');
        // Animate out
        jQuerycontent.removeClass('scale-100 opacity-100').addClass('scale-0 opacity-0');
        // After transition, hide overlay and popup
        setTimeout(() => {
          jQuerypopup.addClass('hidden').attr('aria-hidden', 'true');
          jQuery('#overlay').addClass('hidden');
        }, 300); 
  }
      
      
  jQuery('.openChat').click(function() {
        showPopup(jQuery('#chatPopup'));
        jQuery(this).addClass('hidden');
        jQuery('#circleProgress').removeClass('z-50').addClass('z-0');
  });

  jQuery('#closeChat').click(function() {
        hidePopup(jQuery('#chatPopup'));
        jQuery('.openChat').removeClass('hidden');
        jQuery('#circleProgress').removeClass('z-0').addClass('z-50');
  })

  // Open login popup
  jQuery('.loginBtn').click(function() {
        showPopup(jQuery('#loginPopup'));
        jQuery('.openChat').addClass('hidden');
  })
  // Open register popup
  jQuery('.registerBtn').click(function() {
        showPopup(jQuery('#registerPopup'));
        jQuery('.openChat').addClass('hidden');
  });

  // Close buttons
  jQuery('#closeLogin').click(function() {
        hidePopup(jQuery('#loginPopup'));
        jQuery('.openChat').removeClass('hidden');
  });
  jQuery('#closeRegister').click(function() {
        hidePopup(jQuery('#registerPopup'));
        jQuery('.openChat').removeClass('hidden');
  });

  // Clicking overlay closes popups
  jQuery('#overlay').on( 'click', function() {
        alert('Overlay clicked!');
        hidePopup(jQuery('#loginPopup'));
        hidePopup(jQuery('#registerPopup'));
  });
    
      // Optional: handle form submissions
  jQuery('#loginForm').validate({
        rules: {
           userName: {
            required: true,
            minlength: 2
          },
          loginPassword: {
            required: true,
            minlength: 6
          }
        },
        messages: {
          userName: {
            required: "Please enter your full name",
            minlength: "Name must be at least 2 characters"
          },
          loginPassword: {
            required: "Please enter your password",
            minlength: "Password must be at least 6 characters"
          }
        },
        submitHandler: function(form) {
         
          const fullName= form.userName.value,
            password= form.loginPassword.value;

          console.log('Form submitted:', fullName, password);

          axios.post('/employees/login', {
            fullName: fullName,
            password: password
          })
          .then(function(response) {
            localStorage.setItem('token', response.data.access_token);
            // alert('Logged in!');
            // initializeSocket();
            console.log(response);
          })
          .catch(function(error) {
            alert('Login failed');
          });
        }
  });

  function initializeSocket() {
        const token = localStorage.getItem('token');
        const socket = io();

        socket.on('connect', function() {
          console.log('Connected to Socket.IO');

          // Optionally, join rooms or send messages
        });

        // Listen for status updates
        socket.on('status_update', function(data) {
          console.log('Status update:', data);
        });

        // Listen for messages
        socket.on('message', function(data) {
          console.log('Received message:', data);
        });
  }

  jQuery('#registerForm').validate({
        rules: {
          fullName: {
            required: true,
            minlength: 2
          },
          typeEmployee: {
            required: true
          },
          registerPassword: {
            required: true,
            minlength: 6
          },
          about:{
            required:true,
            minlength:20
          }
          ,
          confirmPassword: {
            required: true,
            equalTo: '#registerPassword'
          },
          profilePhoto: {
            required: true,
            extension: "png|jpg|jpeg"
          }
        },
        messages: {
          fullName: {
            required: "Please enter your full name",
            minlength: "Name must be at least 2 characters"
          },
          typeEmployee: {
            required: "Please select employee type"
          },
          registerPassword: {
            required: "Please provide a password",
            minlength: "Password should be at least 6 characters"
          },
          about: {
            required: "Please provide a self description",
            minlength: "Description should be at least 20 characters"
          },
          confirmPassword: {
            required: "Please confirm your password",
            equalTo: "Passwords do not match"
          },
          profilePhoto: {
            required: "Please upload a profile photo",
            extension: "Only png, jpg, jpeg files are allowed"
          }
        },
        submitHandler: function(form) {
          const formData = new FormData(form);
          axios.post('/employees', formData)
            .then(function(response) {
              console.log(response.data);
              hidePopup(jQuery('#registerPopup'));
              form.reset();
            })
            .catch(function(error) {
              console.log(error.response.data);
            });
        }
  });


  const section = jQuery('#animated-section')
  // Animate the entire section to fade in (initial)
  section.removeClass('opacity-0');
  // Animate each content piece with delays
  const title = jQuery('#title');
  const paragraph = jQuery('#paragraph');
  const btns1 = jQuery('#buttons1');
  const btns2 = jQuery('#buttons2');
  const imageContainer = jQuery('#imageContainer');
  // Trigger animations with delays
  setTimeout(() => {
    title.addClass('animate-fadeInUp', 'delay-1');
    paragraph.addClass('animate-fadeInUp', 'delay-2');
    btns1.addClass('animate-fadeInUp', 'delay-2');
    btns2.addClass('animate-fadeInUp', 'delay-3');
    imageContainer.addClass('animate-fadeInRight', 'delay-2');
  }, 100);


  jQuery('.preview #profilePhoto').on('change', function() {
        jQuery('.uploader-zone').removeClass('w-full').addClass('w-3/4');
        const file = this.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
            jQuery('.preview #profilePhotoPreview').attr('src', e.target.result).removeClass('hidden');
          };
          reader.readAsDataURL(file);
        }
  })

  i18next.init({
        lng: 'en', // default language
        resources: {
          en: {
            translation: {
              home: "Home",
              books: "Books",
              team: "Team",
              login: "Login",
              register: "Register",
              upload: "Publish a book",
              title: "SCIS-GROUP LIBRARY",
              welcome: "Welcome on SCIS-GROUP online Library",
              description: "SCIS-GROUP LIBRARY is a platform that allows you to find the best books for your projects. You can chat with other users and share your books."
            }
          },
          fr: {
            translation: {
              home: "Accueil",
              books: "Livres",
              team: "Equipe",
              login: "Se connecter",
              register: "Inscription",
              upload: "Publier un livre",
              title: "BIBLIO-SCIS-GROUP",
              welcome: "Bienvenue sur SCIS-GROUP bibliotheque en ligne",
              description: "SCIS-GROUP LIBRARY est une plateforme qui vous permet de trouver les meilleurs livres pour vos projets. Vous pouvez discuter avec d'autres utilisateurs et partager vos livres."  
            }
          }
        }
      }, function(err, t) {
        updateContent();
  });

  function updateContent() {
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      el.innerHTML = i18next.t(key);
    });
  }

  $('.lang-switcher img').on('click', function() {
      var lang = $(this).data('i18n-lang');
      i18next.changeLanguage(lang, function(err, t) {
        if (err) return console.error('Error switching language:', err);
        updateContent();
      });
    
  });

})
