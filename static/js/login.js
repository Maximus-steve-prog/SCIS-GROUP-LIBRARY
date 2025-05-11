jQuery(function(){
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
  
        const email = $('#email').val();
        const password = $('#password').val();
  
        axios.post('/auth/login', {
          email: email,
          password: password
        })
        .then(res => {
          // Stocker le token dans le localStorage
          const token = res.data.access_token;
          localStorage.setItem('token', token);
          // Mettre à jour l'en-tête Authorization
         // axios.defaults.headers['Authorization'] = `Bearer ${token}`;
            window.location.href = 'index.html'
          $('#message').html('<p class="text-green-600">Login successful!</p>');
        })
        .catch(error => {
          if (error.response && error.response.data && error.response.data.msg) {
            $('#message').html(`<p class="text-red-600">${error.response.data.msg}</p>`);
          } else {
            $('#message').html('<p class="text-red-600">Login failed. Please try again.</p>');
          }
        });
      });
})