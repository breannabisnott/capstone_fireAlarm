function checkLogin(e) {
    e.preventDefault();
    const hardcodedUsername = "admin";
    const hardcodedPassword = "123";

    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    if (user === hardcodedUsername && pass === hardcodedPassword) {
        document.getElementById("message").innerText = "Login successful!";
        window.location.replace( "overview.html"); 
    } else {
        document.getElementById("message").innerText = "Invalid credentials!";
    }
}

const uname = document.querySelector('#username');
const pass = document.querySelector('#password');
const btnContainer = document.querySelector('.btn-container');
const btn = document.querySelector('#login-btn');
const form = document.querySelector('form');
const msg = document.querySelector('.msg');
btn.disabled = true;

function shiftButton() {
    showMsg();
    const positions = ['shift-left', 'shift-top', 'shift-right', 'shift-bottom'];
    const currentPosition = positions.find(dir => btn.classList.contains(dir));
    const nextPosition = positions[(positions.indexOf(currentPosition) + 1) % positions.length];
    btn.classList.remove(currentPosition);
    btn.classList.add(nextPosition);
}

function showMsg() {
    const isEmpty = uname.value === '' || pass.value === '';
    btn.classList.toggle('no-shift', !isEmpty);

    if (isEmpty) {
        btn.disabled = true
        msg.style.color = 'rgb(218 49 49)';
        msg.innerText = 'Please fill the input fields before proceeding';
    } else {
        msg.innerText = 'Great! Now you can proceed';
        msg.style.color = '#04AA6D';
        btn.disabled = false;
        btn.classList.add('no-shift')
    }
}

btnContainer.addEventListener('mouseover', shiftButton);
btn.addEventListener('mouseover', shiftButton);
form.addEventListener('input', showMsg)
btn.addEventListener('touchstart', shiftButton);