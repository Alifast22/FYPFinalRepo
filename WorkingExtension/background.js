chrome.runtime.onMessage.addListener(function(message, sender) {
    console.log(message.value)
    val=message.value
    //message.value
    if (val===true){
        
    if (message.url) {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'https://media.istockphoto.com/id/1335959802/photo/ransomware-cyber-security-email-phishing-encrypted-technology-digital-information-protected.jpg?s=612x612&w=0&k=20&c=9LgCSouqRqbAeJzDXTkRE8O6T74eJwTmGMKBxiOSS5E=',  // make sure you have this icon in your extension folder
            title: 'Navigation Request',
            message: 'Do you want to proceed to ' + message.url + '?',
            buttons: [
                {title: 'Yes'},
                {title: 'No'}
            ],
            isClickable: true
        }, function(notificationId) {
            // Handle notification clicks and button clicks here
            chrome.notifications.onClicked.addListener(function(clickedNotificationId) {
                if (clickedNotificationId === notificationId) {
                    chrome.tabs.update(sender.tab.id, {url: message.url});
                }
            });

            chrome.notifications.onButtonClicked.addListener(function(clickedNotificationId, buttonIndex) {
                if (clickedNotificationId === notificationId && buttonIndex === 0) {
                    chrome.tabs.update(sender.tab.id, {url: message.url});
                }
            });
        });
    }
}
else{
    chrome.tabs.update(sender.tab.id, {url: message.url});
}
}

);
