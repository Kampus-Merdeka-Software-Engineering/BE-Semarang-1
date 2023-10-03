///////////// PAGE DATA /////////////
function editButtonClick(postId) {
  // Get modal
  var modal = document.getElementById("myModal");
  
  // Get elemen <span> untuk menutup modal
  var span = document.getElementsByClassName("close")[0];
  
  // Saat user klik button, modal muncul 
  modal.style.display = "block";
  
  // User klik <span> (x) untuk menutup modal
  span.onclick = function() {
    modal.style.display = "none";
  }
  
  // Modal tertutup saat user klik di luar modal
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
}
  // Kirim permintaan untuk mengambil data dari server yang ditampilkan di form
  fetch(`https://be-semarang-g-1-production.up.railway.app/api/admin/data/${postId}`)
    .then((response) => response.json())
    .then((data) => {
        const message = data[0]; // Ambil elemen pertama dari array data
        document.getElementById("data_id").value = message.data_id;
        document.getElementById("name").value = message.name;
        document.getElementById("email").value = message.email;
        document.getElementById("message").innerText = message.message;
        document.getElementById("review").value = message.review;
  
      // Menampilkan modal
      modal.style.display = "block";
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
  
function submitEditButtonClick(postId, event) {
    event.preventDefault();

    const updatedData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value,
        review: document.getElementById('review').value,
        postId: postId,
    };
    fetch(`https://be-semarang-g-1-production.up.railway.app/api/admin/data/${postId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData),
    })
        .then((response) => response.json())
        .then((data) => {
        console.log('Data updated:', data);
        // Navigate ke seluruh data setelah berhasil update
        window.location.href = '/admin/data';
        })
        .catch((error) => {
        console.error('Error updating data:', error);
        });
    }

function deleteButtonClick(postId) {
    const confirmDelete = confirm("Apakah Anda yakin ingin menghapus data ini?");
    if (confirmDelete) {
    fetch(`https://be-semarang-g-1-production.up.railway.app/api/admin/data/${postId}`, {
        method: 'DELETE',
    })
        .then((response) => response.json())
        .then((data) => {
        // Navigate ke /admin/data
        window.location.href = '/admin/data';
        alert('Data berhasil dihapus');
        })
        .catch((error) => {
        console.error('Error deleting data:', error);
        });
    }
}

const tableBody = document.getElementById('table-body-data');
fetch('https://be-semarang-g-1-production.up.railway.app/admin/data/')
  .then((response) => response.json())
  .then((data) => {
    if (data.success) {
      const messages = data.messages;

      messages.forEach((message) => {
        const newRow = document.createElement('tr');
        const dataElement = `
          <td style="text-align: center;">${message.data_id}</td>
          <td>${message.name}</td>
          <td>${message.email}</td>
          <td>${message.message}</td>
          <td>${message.review}</td>
          <td>
            <center>
              <button onclick="editButtonClick('${message.data_id}')" style="width: 47%; height: 20px; border: 1px solid; background: #28a745; border-radius: 5px; color: #e9f4fb; font-weight: 500; cursor: pointer; outline: none;">
                Edit
              </button>
              <button onclick="deleteButtonClick('${message.data_id}')" style="width: 47%; height: 20px; border: 1px solid; background: #dc3545; border-radius: 5px; color: #e9f4fb; font-weight: 500; cursor: pointer; outline: none;">
                Delete
              </button>
            </center>
          </td>
        `;
        newRow.innerHTML = dataElement;
        tableBody.appendChild(newRow);
      });
    } else {
      console.error('Error fetching data:', data.error);
    }
  })
  .catch((error) => {
    console.error('Error fetching data:', error);
  });

///////////// PAGE LOGIN /////////////

function submitLogin(event) {
  event.preventDefault();

  const loginData = {
      usernameLogin: document.getElementById('usernameLogin').value,
      emailLogin: document.getElementById('emailLogin').value,
      passwordLogin: document.getElementById('passwordLogin').value,
  };

  // Kirim permintaan POST ke server
  fetch(`https://be-semarang-g-1-production.up.railway.app/api/login`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
  })
      .then((response) => response.json())
      .then((data) => {
      if (data.success) {
          const token = data.token; //token from server
          localStorage.setItem('token', token); // save to local storage
          document.cookie = `token=${token}`
          window.location.href = '/admin/data';
      } else {
          alert('Login gagal. Periksa kembali username dan password Anda.');
      }
      })
      .catch((error) => {
      console.error('Error during login:', error);
      });
}

document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem('token'); // token from Local storage
  if (!token) {
      // Token not found, balik ke halaman login
      window.location.href = '/login';
  } else {
      // Kirim permintaan GET ke server dengan token
      fetch('/admin/data', {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}` // Kirim token dalam header "Authorization"
          }
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
      })
      .catch(error => {
          console.error('Error fetching data:', error);
      });
  }
});

