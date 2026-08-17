/* Config JS - Dynaamic Domain Target Link Resolution */
(function () {
    var DEFAULT_REDIRECT_URL = "https://mm88e9e22qc.mm6799.com/register.html";
    window.REDIRECT_URL = window.REDIRECT_URL || DEFAULT_REDIRECT_URL;

    function getCleanHost() {
        return (window.location.hostname || "").replace(/^www\./i, "").toLowerCase();
    }

    function applyDomainConfig(domainData) {
        var cleanHost = getCleanHost();
        if (domainData && domainData[cleanHost]) {
            var entry = domainData[cleanHost];
            if (typeof entry === 'string') {
                window.REDIRECT_URL = entry;
            } else if (entry && entry.main_url) {
                window.REDIRECT_URL = entry.main_url;
            } else if (entry && entry.target_url) {
                window.REDIRECT_URL = entry.target_url;
            }
        }
        
        // Check query parameter override (?target=... or ?id=...)
        try {
            var params = new URLSearchParams(window.location.search);
            if (params.has('target')) {
                window.REDIRECT_URL = params.get('target');
            }
        } catch (e) {}

        // Notify listeners that REDIRECT_URL has been resolved
        window.dispatchEvent(new CustomEvent('domainConfigLoaded', { detail: { url: window.REDIRECT_URL } }));
    }

    // Try fetching local domains.json to resolve current domain link
    fetch('/domains.json')
        .then(function (res) { return res.json(); })
        .then(function (data) { applyDomainConfig(data); })
        .catch(function () { applyDomainConfig(null); });
})();
