document.addEventListener('DOMContentLoaded', function () {
    const modeTitle = document.getElementById('modeTitle');
    const toggleButton = document.getElementById('toggleMode');
    const viewReportButton = document.getElementById('viewReport'); // Get the "View Report" button

    // Load initial mode from Chrome Storage API
    chrome.storage.local.get(['mode'], function(result) {
        let isUserMode = result.mode === 'user';
        updateModeDisplay(isUserMode);

        toggleButton.addEventListener('click', function () {
            isUserMode = !isUserMode;
            chrome.storage.local.set({ 'mode': isUserMode ? 'user' : 'admin' });
            updateModeDisplay(isUserMode);
        });

        // Show or hide "View Report" button based on the mode
        viewReportButton.style.display = isUserMode ? 'none' : 'block';
    });

    function updateModeDisplay(isUserMode) {
        if (isUserMode) {
            modeTitle.textContent = 'Normal Mode Selected';
            toggleButton.textContent = 'Detailed Mode';
            viewReportButton.style.display = 'none'; // Hide "View Report" button in user mode
        } else {
            modeTitle.textContent = 'Detailed Mode Selected';
            toggleButton.textContent = 'Normal Mode';
            viewReportButton.style.display = 'block'; // Show "View Report" button in admin mode
        }
    }

    // Add event listener for "View Report" button
    viewReportButton.addEventListener('click', function() {
        chrome.tabs.create({ url: chrome.runtime.getURL('report.html') });
    });
});
