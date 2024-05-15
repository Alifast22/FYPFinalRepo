document.body.addEventListener('click', function(event) {
    console.log(event.target.tagName)
    let urlelement=findParentAnchor(event.target)
    if (urlelement) {
        event.preventDefault();
        showLoadingIndicator();
        console.log(urlelement.href);
        // Fetching URL data from the Flask server
        let url_to_check = urlelement.href;
        let server_url = "https://fypfinalrepo-production.up.railway.app/check_phishing";
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
                    if(data['phishing']==false){showSuccessAlert('Clicked URL Is Not Phishy!');}
                    else{showDangerAlert('Clicked URL Might Be Phishy')}
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
    // Create a container for the modal
    let modalOverlay = document.createElement('div');
    modalOverlay.id = 'modalOverlay';
    modalOverlay.style.position = 'fixed';
    modalOverlay.style.top = '0';
    modalOverlay.style.left = '0';
    modalOverlay.style.width = '100%';
    modalOverlay.style.height = '100%';
    modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modalOverlay.style.zIndex = '9998';
    modalOverlay.style.display = 'flex';
    modalOverlay.style.alignItems = 'center';
    modalOverlay.style.justifyContent = 'center';
    document.body.appendChild(modalOverlay);

    // Create the modal container
    let modalContainer = document.createElement('div');
    modalContainer.id = 'modalContainer';
    modalContainer.style.backgroundColor = '#fff';
    modalContainer.style.padding = '20px';
    modalContainer.style.borderRadius = '8px';
    modalContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    modalContainer.style.textAlign = 'center';
    modalContainer.style.position = 'relative';
    modalContainer.style.zIndex = '9999';
    modalOverlay.appendChild(modalContainer);

    // Create the loading text
    let loadingText = document.createElement('div');
    loadingText.id = 'loadingText';
    loadingText.innerText = 'Phishing Checking';
    loadingText.style.fontSize = '24px';
    loadingText.style.fontWeight = 'bold';
    modalContainer.appendChild(loadingText);

    // Create the small black loading sign
    let loadingSign = document.createElement('div');
    loadingSign.id = 'loadingSign';
    loadingSign.style.width = '20px';
    loadingSign.style.height = '20px';
    loadingSign.style.border = '4px solid #000'; /* Black */
    loadingSign.style.borderTop = '4px solid transparent'; /* Transparent */
    loadingSign.style.borderRadius = '50%';
    loadingSign.style.animation = 'spin 1s linear infinite';
    loadingSign.style.margin = '10px auto 0';
    modalContainer.appendChild(loadingSign);

    // Add keyframe animations
    let style = document.createElement('style');
    style.innerHTML = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Function to remove the loading indicator
function hideLoadingIndicator() {
    let modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
        modalOverlay.remove();
    }

    let styleElements = document.head.getElementsByTagName('style');
    for (let i = 0; i < styleElements.length; i++) {
        if (styleElements[i].innerHTML.includes('@keyframes spin') && styleElements[i].innerHTML.includes('@keyframes blink')) {
            styleElements[i].remove();
            break;
        }
    }
}

function showAlert(message, type) {
    let alertBox = document.createElement('div');
    alertBox.className = 'alert ' + type;
    alertBox.innerText = message;
    document.body.appendChild(alertBox);

    // Trigger show class to fade in
    setTimeout(() => {
        alertBox.classList.add('show');
    }, 100);

    // Automatically remove the alert after 5 seconds
    setTimeout(() => {
        alertBox.classList.remove('show');
        setTimeout(() => {
            alertBox.remove();
        }, 500); // Wait for fade out transition to complete
    }, 3000);
}

// Function to show a success alert
function showSuccessAlert(message) {
    showAlert(message, 'success');
}

// Function to show a danger alert
function showDangerAlert(message) {
    showAlert(message, 'danger');
}


function addAlertStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
        .alert {
            position: fixed;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            text-align: center;
            align-content: center;
            font-size: 20px;
            width: 300px;
            height:50px;
            opacity: 0;
            transition: opacity 0.5s;
        }

        .alert.show {
            opacity: 1;
        }

        .alert.success {
            background-color: #4CAF50; /* Green */
            color: white;
        }

        .alert.danger {
            background-color: #f44336; /* Red */
            color: white;
        }
    `;
    document.head.appendChild(style);
}
addAlertStyles()

