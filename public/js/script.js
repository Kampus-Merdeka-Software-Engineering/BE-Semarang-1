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

function submitContact(){
  const inputName = document.getElementById('input-name').value;
  const inputEmail = document.getElementById('input-email').value;
  const inputMessage = document.getElementById('input-message').value;
  const inputContactUs = {
      name: inputName,
      email: inputEmail,
      message: inputMessage
  }
  fetch('/submit-form', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(inputContactUs)
  })
  .then(response => response.json())
  .then(result => {
    console.log(result);
    alert(JSON.stringify(result, null, 2));
  })
  .catch(error => {
    console.error('Error:', error);
  });
}



