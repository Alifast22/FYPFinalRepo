document.getElementById('openPageButton').addEventListener('click', openPage);

function openPage() {
    const url = document.getElementById('urlInput').value;

    if (!url) {
        alert('Please enter a URL.');
        return;
    }

    const userConsent = confirm('Do you want to proceed to ' + url + '?');

    if (userConsent) {
        chrome.tabs.create({url: url});
    }
}

document.getElementById('urlInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        openPage();
    }
});
