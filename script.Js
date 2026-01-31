document.getElementById('action-btn').addEventListener('click', function() {
    const msg = document.getElementById('message');
    msg.innerText = "The button works! Date: " + new Date().toLocaleTimeString();
    console.log("Button clicked!");
});
