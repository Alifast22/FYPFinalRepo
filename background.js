chrome.runtime.onMessage.addListener(function(message, sender) {
    console.log(message.value);
    let val = message.value;

    if (val === true) {
        if (message.url) {
            chrome.storage.local.get(['mode'], function(result) {
                let buttons = [
                    { title: 'Yes' },
                    { title: 'No' }
                ];

                // Check if the mode is admin and include the simulated "View Report" button
                if (result.mode === 'admin') {
                    buttons.push({ title: 'View Report' });
                }

                let messageText = 'Do you want to proceed to ' + message.url + '?';

                // Add information about the "View Report" option in the message if mode is admin
                if (result.mode === 'admin') {
                    messageText += '\n\n(To view the report, click the "View Report" button)';
                }

                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: 'https://media.istockphoto.com/id/1335959802/photo/ransomware-cyber-security-email-phishing-encrypted-technology-digital-information-protected.jpg?s=612x612&w=0&k=20&c=9LgCSouqRqbAeJzDXTkRE8O6T74eJwTmGMKBxiOSS5E=',
                    title: result.mode === 'user' ? 'Navigation Request' : 'ALERT! This link has some features which are suspicious',
                    message: messageText,
                    buttons: buttons,
                    isClickable: true
                }, function(notificationId) {
                    chrome.notifications.onButtonClicked.addListener(function(clickedNotificationId, buttonIndex) {
                        if (clickedNotificationId === notificationId) {
                            if (buttonIndex === 0) {
                                chrome.tabs.update(sender.tab.id, { url: message.url });
                            } else if (buttonIndex === 2 && result.mode === 'admin') {
                                localStorage.setItem('phishingReport', JSON.stringify(message));
                                chrome.tabs.create({ url: chrome.runtime.getURL('report.html') }, function(newTab) {
                                    chrome.tabs.update(sender.tab.id, { url: message.url });
                                });
                            }
                        }
                    });
                });
            });
        }
    } else {
        chrome.tabs.update(sender.tab.id, { url: message.url });
    }
});

