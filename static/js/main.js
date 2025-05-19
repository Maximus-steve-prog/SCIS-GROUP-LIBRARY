jQuery(function(){

  const senderId = localStorage.getItem('id');
  let receiverId = null;
const typingIndicator = document.querySelector('#typing-indicator');

  const socket = io('http://192.168.48.11:2025', {
    query: { user_id: senderId }
  });

  
  
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
  });

  jQuery(document).on('mouseover', function(e){
            if(!jQuery(e.target).closest('.nav-item, .sub-item, .item, nav').length){
                jQuery('.sub-item').stop(true, true).slideUp(300);
            }
  });

  jQuery(document).on('click', function(e){
            if(!jQuery(e.target).closest('nav, .toggle_menu').length){
                jQuery('nav').removeClass('active');
            }
  });

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
          socket.emit('login', 
            { 
              fullName: form.userName.value, 
              password: form.loginPassword.value 
            });

        
        
          // Listen for login_success event
          socket.on('login_success', function(data) {
                if(data.me === form.userName.value.trim()){
                   form.reset();
                  //  console.log('Login successful:', data.token);
                  localStorage.setItem('user', data.me);
                  localStorage.setItem('token', data.token);
                  localStorage.setItem('id', data.id);
                  getAllEmployees();
                   hidePopup(jQuery('#loginPopup'));
                   
                }
                
          });
          // Listen for login_error event
          socket.on('login_error', function(data) {
                if(localStorage.getItem('user') === data.login){
                  //  console.log('Login error:', data.message);
                  showMessage('error', data.message);
                }
                
          });

          

           
        }
  });

  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('join_room', (data) => {
    console.log('Connected as user:', data.user_id);
  });

  socket.on('connect_error', (err) => {
    console.error('Connect error:', err.message);
  });

   // Listen for uploaded_books event
  socket.on('book_uploaded', function(data) {
      showMessage('success', `${data.employee} uploaded : ${data.book}`);
      fetchAllBooks();
  });

  socket.on('connected_other_user', function(data) {
    // console.log('This user is connected :', data);
    showMessage('success', data.employee + ' is online');
  });

  

  getAllEmployees();

  function getAllEmployees() {
    const token = localStorage.getItem('token'); // ton token

    if (token !== null) {
      axios.get('/employees/get_all_employees', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(function(response) {
        let employees = response.data; // assuming response.data is already an array

        $('#employees').empty(); // Optional: clear previous content

        employees.forEach(employee => {
          $('#employees').append(`
            <div class="p-2 lg:w-1/3 md:w-1/2 w-full">
              <div class="bg-white h-full dark:bg-gray-700 flex flex-col items-center border border-gray-200 p-4 rounded-lg cursor-pointer transition-shadow duration-200 hover:shadow-lg">
                <img alt="team" class="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mb-4"
                    src="../static${employee.photo_path || 'https://via.placeholder.com/150'}" />
                <div class="flex-grow text-center">
                  <h2 class="text-gray-900 title-font font-medium mb-1 dark:text-white">${employee.fullName}</h2>
                  <p class="text-gray-500 mb-2 dark:text-gray-200">${employee.employee_Type}</p>
                  <p class="text-sm text-gray-400 dark:text-gray-300">Last login: ${employee.last_LoginAt || 'N/A'}</p>
                  <div class="flex justify-center space-x-3 mt-2">
                    <a href="#" class="text-gray-500 dark:text-white text-xl hover:text-blue-500" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                    <a href="#" class="text-gray-500 dark:text-white text-xl hover:text-blue-700" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
                    <a href="#" class="text-gray-500 dark:text-white text-xl hover:text-gray-900" aria-label="GitHub"><i class="fab fa-github"></i></a>
                  </div>
                </div>
              </div>
            </div>
          `);
        });

        jQuery('#contact-list').empty(); // Clear the existing list

        jQuery.each(employees, function(index, employee) {
            const onlineDot = employee.status === "online"
                ? '<div class="absolute bottom-0 right-4 w-3 h-3 rounded-full bg-green-400 p-1"></div>'
                : '<div class="absolute bottom-0 right-4 w-3 h-3 rounded-full bg-gray-300"></div>';

            // Handle unread messages
            let unreadElement = 2;
            // if (employee.unread === 0) {
            //     unreadElement = '<p style="display: none;"></p>'; // Use display: none for better UX
            // } else {
            //     unreadElement = `<p class="text-blue-500 text-sm font-semibold bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center">${employee.unread}</p>`;
            // }

            // Extract only the time part (YYYY-MM-DDTHH:mm)
            // const timeOnly = employee.last_LoginAt.split("T")[1];
        
            var date = new Date(employee.last_LoginAt);
            var timeOnly = date.toLocaleTimeString();
            // console.log(timeOnly); // outputs: 3:51:56 PM (depending on your locale)
            const employeeItem = `
            <div  class="contact-item  bg-white flex items-center py-3 hover:bg-gray-100 focus:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:bg-gray-900 transition-colors duration-200 px-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 cursor-pointer">
                <div class="relative">
                    <img src="../static${employee.photo_path}" alt="" data-name="${employee.fullName}" class="contact-image w-12 h-12 object-cover border-gray-500 border dark:border-gray-600 rounded-full mr-3">
                    ${onlineDot}
                </div>
                <div data-id="${employee.id}" class="show-message flex items-center justify-between flex-grow">
                    <div class="contact-info">
                        <h3 class="text-sm font-medium text-black dark:text-white">${employee.fullName}</h3>
                        <p class="text-gray-500 text-sm dark:text-gray-400 truncate">${employee.self_Description.substring(0, 20)}...</p>
                    </div>
                    <div class="text-right flex flex-col items-end">
                        <p class="text-blue-400 dark:text-blue-300 text-sm">${timeOnly}</p>
                        ${unreadElement}
                    </div>
                </div>
            </div>`;
            $('#contact-list').append(employeeItem);
        });

        // Click handling for show-message
        jQuery('.show-message').on('click', function() {
            jQuery('#contact').toggleClass('hidden');
            receiverId = jQuery(this).data('id');
            console.log(receiverId);
            jQuery('.chat-room').toggleClass('hidden');
            appendMessageBySelectedUser(senderId, receiverId);
            const messageInput = document.querySelector('#messageInput');
            let typingTimeout;

              messageInput.addEventListener('input', () => {
                // Notify server that user is typing
                socket.emit('typing', {
                  senderId: senderId,
                  receiverId: receiverId,
                  isTyping: true
                });

                // Clear previous timeout
                clearTimeout(typingTimeout);
                // Set timeout to indicate stop typing after 3 seconds
                typingTimeout = setTimeout(() => {
                  socket.emit('typing', {
                    senderId: senderId,
                    receiverId: receiverId,
                    isTyping: false
                  });
                }, 5000);
              });
        });
      }).catch(function(error) {
         showPopup(jQuery('#loginPopup'));
        jQuery('.openChat').addClass('hidden');
        console.error('Error fetching employees:', error.response ? error.response.data : error);
      });
    }
  }

  // Listen for 'typing' event from server
    socket.on('typing', (data) => {
      //  console.log('Typing event received:', data.receiverId !== localStorage.getItem('id'));
      if (data.receiverId === localStorage.getItem('id')) return; // Ignore if not for you
      if (data.isTyping) {
        // Show indicator
        typingIndicator.innerText = 'is typing...';
        typingIndicator.classList.remove('hidden');
      } else {
        // Hide indicator
        typingIndicator.classList.add('hidden');
      }
    });

  socket.on('new_message', (msg) => {
    showMessage('success',msg.sender_id + ' says : ' + msg.msg_content);
  });

  // function appendMessage(msg) {
  // let html = '';

  // if (msg.msg_type === 'text') {
  //   // Simple text message
  //   html = `
  //     <div class="mb-2 p-2 border rounded bg-gray-100 dark:bg-gray-800 max-w-xs shadow-md">
  //       <p class="text-gray-800 dark:text-gray-200">${msg.msg_content}</p>
  //       <div class="flex justify-between items-center mt-1">
  //         <span class="text-xs text-gray-500">10:00 AM</span>
  //         <i class="fas fa-check-double text-gray-400 ml-2"></i>
  //       </div>
  //     </div>`;
  // } else {
  //   // Media message
  //   const url = `/static/message/${msg.msg_content}`;
  //   if (msg.msg_type === 'picture') {
  //     html = `<img src="${url}" class="w-48 mb-2 rounded" />`;
  //   } else if (msg.msg_type === 'video') {
  //     html = `<video src="${url}" controls class="w-48 mb-2 rounded"></video>`;
  //   } else if (msg.msg_type === 'audio') {
  //     html = `<audio controls src="${url}" class="mb-2"></audio>`;
  //   }
  // }

  // // Append to the conversation container
  // const container = document.querySelector('.conversation');

  // // Create a wrapper div with the same classes as your message structure
  // const messageWrapper = document.createElement('div');

  // // Determine if message is outgoing or incoming
  // // For example, based on a property in msg, e.g., msg.outgoing === true
  // // Here, assuming msg.type: 'outgoing' or 'incoming'
  // if (msg.type === 'outgoing') {
  //   messageWrapper.innerHTML = `
  //     <div class="flex items-center justify-end mb-4 message-wrapper">
  //       <div class="action flex mr-2 w-14 h-full items-center justify-center hidden">
  //         <div class="dark:bg-black flex items-center justify-between w-full border border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 dark:bg-gray-800 rounded-xl py-1 px-2">
  //           <i class="fas fa-smile emoji-button text-gray-500 cursor-pointer" title="Emoji"></i>
  //           <i class="fa-solid fa-angle-down text-gray-500"></i>
  //         </div>
  //       </div>
  //       <div class="flex items-end">
  //         <div class="bg-blue-500 text-white p-3 rounded-lg max-w-xs shadow-md relative">
  //           ${html}
  //           <div class="flex justify-between items-center mt-1">
  //             <span class="text-xs text-gray-300">10:00 AM</span>
  //             <i class="fas fa-check-double text-white ml-2"></i>
  //           </div>
  //           <div class="absolute top-14 w-6 h-6 flex overflow-y-hidden right-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full"></div>
  //         </div>
  //         <img src="{{url_for('static', filename='images/book-3088775_1280.jpg')}}" alt="Contact" class="border translate-y-3 w-10 h-10 rounded-full ml-2 dark:border-gray-600">
  //       </div>
  //     </div>`;
  // } else {
  //   // Incoming message
  //   messageWrapper.innerHTML = `
  //     <div class="flex relative justify-start items-center mb-4 message-wrapper">
  //       <img src="{{url_for('static', filename='images/bg.jpeg')}}" alt="Contact" class="border -translate-y-4 w-10 h-10 rounded-full mr-2 dark:border-gray-600">
  //       <div class="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 p-3 rounded-lg max-w-xs shadow-md relative">
  //         ${html}
  //         <div class="flex justify-between items-center mt-1">
  //           <span class="text-xs text-gray-500">10:02 AM</span>
  //         </div>
  //         <div class="absolute top-14 w-6 h-6 flex overflow-y-hidden left-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full"></div>
  //       </div>
  //       <div class="action flex ml-2 w-14 h-full items-center justify-center hidden">
  //         <div class="dark:bg-black flex items-center justify-between w-full border border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 dark:bg-gray-800 rounded-xl py-1 px-2">
  //           <i class="fa-solid fa-angle-down text-gray-500"></i>
  //           <i class="fas fa-smile emoji-button text-gray-500 cursor-pointer" title="Emoji"></i>
  //         </div>
  //       </div> 
  //     </div>`;
  // }

  // // Append the new message to the conversation
  // container.appendChild(messageWrapper);
  // // Optionally, scroll to bottom
  // container.scrollTop = container.scrollHeight;
  // }

  function formatTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function appendMessageBySelectedUser(senderId, receiverId) {
    

    axios.get(`/${senderId}/${receiverId}`)
              .then(response => {
                response.data.forEach(msg => {
    const isOutgoing = msg.sender_id === senderId;
    const time = formatTime(msg.send_at);
    let innerHtml = '';

    if (msg.msg_type === 'text') {
        innerHtml = `
            <p>${msg.msg_content}</p>
        `;
    } else {
        const url = `/static/${msg.msg_content}`;
        if (msg.msg_type === 'picture') {
            innerHtml = `<img src="${url}" class="w-48 mb-2 rounded" />`;
        } else if (msg.msg_type === 'video') {
            innerHtml = `<video src="${url}" controls class="w-48 mb-2 rounded"></video>`;
        } else if (msg.msg_type === 'audio') {
            innerHtml = `<audio controls src="${url}" class="mb-2 w-48"></audio>`;
        }
    }

    let messageHtml = '';

    if (isOutgoing) {
        messageHtml = `
        <div class="flex items-center justify-end mb-4 message-wrapper">
            <div class="action flex mr-2 w-14 h-full items-center justify-center hidden">
                <div class="dark:bg-black flex items-center justify-between w-full border border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 dark:bg-gray-800 rounded-xl py-1 px-2">
                    <i class="fas fa-smile emoji-button text-gray-500 cursor-pointer" title="Emoji"></i>
                    <i class="fa-solid fa-angle-down text-gray-500"></i>
                </div>
            </div>
            <div class="flex items-end">
                <div class="bg-blue-500 text-white p-3 rounded-lg max-w-xs shadow-md relative">
                    ${innerHtml}
                    <div class="flex justify-between items-center mt-1">
                        <span class="text-xs text-gray-300">${time}</span>
                        <i class="fas fa-check-double text-white ml-2"></i>
                    </div>
                    <div class="selected-emoji absolute top-14 w-6 h-6 flex overflow-y-hidden right-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full"></div>
                </div>
                <img src="/static/images/book-3088775_1280.jpg" alt="Contact" class="border translate-y-3 w-10 h-10 rounded-full ml-2 dark:border-gray-600">
            </div>
        </div>`;
    } else {
        messageHtml = `
        <div class="flex relative justify-start items-center mb-4 message-wrapper">
            <img src="/static/images/bg.jpeg" alt="Contact" class="border -translate-y-4 w-10 h-10 rounded-full mr-2 dark:border-gray-600">
            <div class="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 p-3 rounded-lg max-w-xs shadow-md relative">
                ${innerHtml}
                <div class="flex justify-between items-center mt-1">
                    <span class="text-xs text-gray-500">${time}</span>
                </div>
                <div class="selected-emoji absolute top-14 w-6 h-6 flex overflow-y-hidden left-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full"></div>
            </div>
            <div class="action flex ml-2 w-14 h-full items-center justify-center hidden">
                <div class="dark:bg-black flex items-center justify-between w-full border border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 dark:bg-gray-800 rounded-xl py-1 px-2">
                    <i class="fa-solid fa-angle-down text-gray-500"></i>
                    <i class="fas fa-smile emoji-button text-gray-500 cursor-pointer" title="Emoji"></i>
                </div>
            </div>
        </div>`;
    }

    $('.conversation').append(messageHtml);
    $('.conversation').scrollTop($('.conversation')[0].scrollHeight);

    }); 
    })
    .catch(error => {
      console.error('Error fetching messages:', error);
    });
  }

  $('#messageForm').submit(function(e) {
    e.preventDefault();
    const messageText = $('#messageInput').val();
    const file = $('#fileInput')[0].files[0];

    const formData = new FormData();
    formData.append('sender_id', senderId);
    formData.append('receiver_id', receiverId);

    if (file) {
      let msgType = '';
      if (file.type.startsWith('image/')) msgType = 'picture';
      else if (file.type.startsWith('video/')) msgType = 'video';
      else if (file.type.startsWith('audio/')) msgType = 'audio';
      else {
        alert('Unsupported file type');
        return;
      }
      formData.append('msg_type', msgType);
      formData.append('file', file);
    } else {
      formData.append('msg_type', 'text');
      formData.append('msg_content', messageText);
    }

    axios.post('/send', formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(() => {
        $('#messageInput').val('');
        $('#fileInput').val('');
      })
      .catch(console.error);
  });

  function downloadBook(bookId) {
    const token = localStorage.getItem('token');
    axios.get(`/books/download_book/${bookId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error('Error downloading book:', error);
    });
  }

  socket.on('book_downloaded', function(data) {
    showMessage('success', `${data.employee} downloaded : ${data.book}`);
  });

  // Fetch all books on page load for all Employees
  fetchAllBooks();

  function fetchAllBooks() {
    
    axios.get('/books/all_books')
    .then(response => {
      const books  = response.data;
      jQuery('#books_loader').empty(); // Clear the existing list

      jQuery.each(books, function(index, book) {
        const bookItem = `
        <div class="swiper-slide p-4  ">
          <div class="border rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700 hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out">
            <a class="block relative h-48 overflow-hidden">
                <img alt="Book Cover" class="object-cover object-center w-full h-full" src="/${book.book_cover_path}" />
            </a>
            <div class="p-4">
                <h3 class="text-gray-500 text-xs tracking-widest mb-1 dark:text-gray-400">Title</h3>
                <h2 class="text-gray-900 dark:text-gray-100 title-font text-lg font-medium mb-2">${book.title}</h2>
                <p class="text-gray-700 text-sm mb-2 dark:text-gray-300">${book.description}</p>
                <p class="font-semibold mb-3 text-gray-800 dark:text-gray-200 flex flex-col gap-3 items-start justify-between">
                <label>Uploaded at : <span class="text-gray-500 py-1 px-10 w-full text-center bg-gray-100 rounded">${book.added_at.split("T")[0]}</span> </label>
                <label>Status: <span class="text-green-500 py-1 px-10 w-full text-center bg-green-100 rounded">Active</span></p></label>
                <a href="/${book.book_path}" download  class="inline-block btn_download bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded " book_id="${book.id}">Download</a>
            </div>
          </div>
        </div>
        `;
        $('#books_loader').append(bookItem);
      });

      // send download request on click
      jQuery('.btn_download').on('click', function() {
        const bookId = jQuery(this).attr('book_id');
        downloadBook(bookId);
      });
    })
    .catch(error => {
      console.error('Error fetching books:', error);
    });
  }

  function showMessage(iconName, messageContent) {
    // Set icon src
    $('#messageIcon').attr('src', '../static/icons/' + iconName + '.png');

    // Set message content
    $('#messageContent').text(messageContent);

    // Animate into view
    $('#message').stop(true, true)
                 .hide().css('top', '-10%').show()
                 .animate({ top: '5%' }, 300);

    setTimeout(function() {
        $('#message').animate({ top: '-10%' }, 300);
    }, 5000);
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


  $('#uploadForm').validate({
      rules: {
        title: {
          required: true,
          minlength: 3
        },
        description: {
          required: true,
          minlength: 5
        },
        book: {
          required: true,
          extension: "pdf|docx|txt|epub"
        },
        bookCover: {
          required: true,
          extension: "jpg|jpeg|png"
        }
      },
      messages: {
        title: {
          required: "Please enter a title.",
          minlength: "Title must be at least 3 characters."
        },
        description: {
          required: "Please enter a description.",
          minlength: "Description must be at least 5 characters."
        },
        book: {
          required: "Please select a book file.",
          extension: "Allowed extensions: pdf, docx, txt, epub."
        },
        bookCover: {
          required: "Please select a cover image.",
          extension: "Allowed extensions: jpg, jpeg, png."
        }
      },
      submitHandler: function(form) {
      const token = localStorage.getItem('token');

      const formData = new FormData(form);
     

      axios.post('/books/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);

        // $('#statusMessage').text('Error uploading book.').removeClass('text-green-600').addClass('text-red-600');
      });
      }
  });
 


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
