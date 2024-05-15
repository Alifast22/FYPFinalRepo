document.body.addEventListener('click', function(event) {
    console.log(event.target.tagName)
    let urlelement=findParentAnchor(event.target)
    if (urlelement) {
        event.preventDefault();
        showLoadingIndicator();
        console.log(urlelement.href);
        // Fetching URL data from the Flask server
        let url_to_check = urlelement.href;
        let server_url = "http://127.0.0.1:5000/check_phishing";
        chrome.storage.local.get(['mode'], function(result) {
            let selectedMode = result.mode === 'user';
            let payload = { url: url_to_check, mode: selectedMode};
            fetch(server_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } 
                else {
                    console.log("Network response was not ok")
                    throw new Error('Network response was not ok: ' + response.status_code);
                }
            })
            .then(data => {
                if ('error' in data) {
                    console.log(data)
                    alert(data)
                    console.log("Error:", data['error']);
                } 
                else {
                    console.log("URL:", data['url']);
                    console.log("Phishing:", data['phishing']);
                    if (selectedMode == false){
                        chrome.storage.local.set({phishing_report: data['phishy_features']})
                        chrome.storage.local.set({phishing_url: data['url']})
                        chrome.runtime.sendMessage({url: urlelement.href, value:data['phishing'], features:data['phishy_features']});
                    }
                    else{
                        chrome.runtime.sendMessage({url: urlelement.href, value:data['phishing'], features:[]});
                    }
                }
            })
            .catch(error => {
                console.error("Error:", error);
            })
            .finally(() => {
                // Hide loading indicator when response is received
                hideLoadingIndicator();
            });
        });

        return false
    }
});

function findParentAnchor(element) {
    console.log(element)
    if (!element) return null;
    if (element.tagName === 'A') return element;
    return findParentAnchor(element.parentElement);
}

function showLoadingIndicator() {
    // Show loading spinner
    let spinner = document.createElement('div');
    spinner.id = 'loadingSpinner';
    spinner.style.position = 'fixed';
    spinner.style.top = '50%';
    spinner.style.left = '50%';
    spinner.style.transform = 'translate(-50%, -50%)';
    spinner.style.border = '16px solid #f3f3f3'; /* Light grey */
    spinner.style.borderTop = '16px solid #3498db'; /* Blue */
    spinner.style.borderRadius = '50%';
    spinner.style.width = '120px';
    spinner.style.height = '120px';
    spinner.style.animation = 'spin 2s linear infinite'; // Add spinning animation
    spinner.style.zIndex = '9999';
    document.body.appendChild(spinner);

    // Add keyframe animation
    let style = document.createElement('style');
    style.innerHTML = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

function hideLoadingIndicator() {
    // Hide loading spinner
    let spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.parentNode.removeChild(spinner);
    }
}
