chrome.storage.local.get(['phishing_report'], function(result) {
    const reportData = result['phishing_report'];
    chrome.storage.local.get(['phishing_url'], function(result) {
        const reportURL = result['phishing_url'];
        console.log(reportData);
        if (reportData) {
            document.getElementById('url').innerText = reportURL;
            const featureList = document.getElementById('feature-list');
            
            // Function to generate HTML card for each feature
            function createFeatureCard(featureName, description) {
                const card = document.createElement('div');
                card.classList.add('card');

                const cardContent = document.createElement('div');
                cardContent.classList.add('card-content');

                const span = document.createElement('span');
                span.classList.add('card-title');
                span.innerText = featureName+':';

                const p = document.createElement('p');
                p.innerText = description;

                cardContent.appendChild(span);
                cardContent.appendChild(p);
                card.appendChild(cardContent);

                featureList.appendChild(card);
            }

            // Mapper for features and their descriptions
            featureMap = {
                'having_IP_Address': 'Indicates whether the URL contains an IP address rather than a domain name. Phishing URLs often use IP addresses to mimic legitimate websites.',
                'URL_Length': 'Measures the length of the URL. Phishing URLs may have excessively long or obfuscated URLs to deceive users.',
                'Shortining_Service': 'Identifies whether a URL is shortened using a URL shortening service. Phishers often use shortened URLs to hide the true destination.',
                'having_At_Symbol': 'Indicates whether the URL contains the "@" symbol, which is typically not found in legitimate URLs but may be used in phishing attempts, especially in email phishing.',
                'double_slash_redirecting': 'Checks if the URL redirects using double slashes. Phishers may use such redirects to obfuscate the true destination.',
                'Prefix_Suffix': 'Examines if the domain name has a prefix or suffix added to it. Phishers may use similar-looking domain names with added prefixes or suffixes to mimic legitimate sites.',
                'having_Sub_Domain': 'Determines if the URL has subdomains. Phishers may create deceptive subdomains to impersonate legitimate sites.',
                'SSLfinal_State': 'Indicates the SSL certificate status of the website. Phishing sites may lack proper SSL certificates, leading to insecure connections.',
                'Domain_registeration_length': 'Measures the length of time the domain has been registered. Phishing sites often have short domain registration periods to minimize costs and evade detection.',
                'Favicon': 'Checks for the presence of a favicon (website icon). Absence of a favicon or a mismatched favicon may indicate a phishing attempt.',
                'port': 'Examines the port number in the URL. Phishing URLs may use non-standard ports to trick users into believing they are accessing a legitimate service.',
                'HTTPS_token': 'Identifies whether the URL contains an HTTPS token. Phishers may use HTTPS tokens to give the impression of a secure connection.',
                'Request_URL': 'Analyzes the number of requests made to URLs within the webpage. A high number of request URLs may indicate malicious activity, such as loading content from external sources.',
                'URL_of_Anchor': 'Examines the ratio of anchor URLs to total URLs. Phishing sites may have a higher ratio of anchor URLs, especially for redirects or hidden links.',
                'Links_in_tags': 'Counts the number of hyperlinks within HTML tags. Phishing pages may have a higher number of links embedded within tags, often to redirect users.',
                'SFH': 'Checks if the form action is set to a different domain. Phishers may attempt to steal sensitive information by submitting forms to malicious servers.',
                'Submitting_to_email': 'Identifies if the webpage submits data to an email address. Phishing forms may send captured information directly to attackers via email.',
                'Redirect': 'Detects if the webpage contains any redirects. Phishers may use redirects to direct users to malicious or fraudulent websites.',
                'on_mouseover': 'Checks for JavaScript events triggered on mouseover. Phishers may use JavaScript to display fake URLs or tooltips on mouseover events.',
                'RightClick': 'Determines if right-clicking is disabled on the webpage. Phishers may disable right-click functionality to prevent users from inspecting elements or copying URLs.',
                'popUpWindow': 'Identifies if the webpage opens pop-up windows. Phishers may use pop-ups to display fake login forms or alerts to users.',
                'Iframe': 'Checks for the presence of iframes within the webpage. Phishers may use iframes to load content from malicious sources or to overlay legitimate content with phishing forms.',
                'DNSRecord': 'Verifies the DNS record of the domain. Discrepancies or inconsistencies in DNS records may indicate phishing attempts.',
                'age_of_domain': 'Measures the age of the domain. Phishing sites may have recently registered domains, whereas legitimate sites often have longer histories.',
                'Google_Index': 'Checks if the webpage is indexed by Google. Phishing sites may not be indexed or may be flagged by Google Safe Browsing.',
                'Links_pointing_to_page': 'Counts the number of external links pointing to the webpage. Phishing sites may have fewer external links or links from suspicious sources.',
                'Statistical_report': 'Provides a statistical analysis of various features for phishing detection purposes, such as clustering or classification algorithms.'
            }
            
            // Loop through reportData and create feature cards
            reportData.forEach(feature => {
                if (feature in featureMap) {
                    createFeatureCard(feature, featureMap[feature]);
                }
            });
        }
    });
});
