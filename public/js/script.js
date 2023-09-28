// Toggle class active
const navbarNav = document.querySelector(".navbar-nav");
// ketika hamburger menu di klik
document.querySelector("#hamburger-menu").onclick = () => {
  navbarNav.classList.toggle("active");
};

//Klik di luar sidebar untuk menghilangkan nav
const hamburger = document.querySelector("#hamburger-menu");

document.addEventListener("click", function (e) {
  if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }
});

///////////// PAGE data.ejs /////////////

function idButtonClick(postId) {
  console.log(`ID Post ${postId}`);
}

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
fetch(`http://localhost:3000/admin/data/${postId}`)
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

function submitEditButtonClick(postId) {
event.preventDefault();

const updatedData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    message: document.getElementById('message').value,
    review: document.getElementById('review').value,
    postId: postId, // Sertakan postId di sini
};
// Kirim permintaan POST ke server
fetch(`http://localhost:3000/admin/data/${postId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
      // Kirim permintaan DELETE ke server
      fetch(`http://localhost:3000/admin/data/${postId}`, {
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
  ///////////////////////////////////////
