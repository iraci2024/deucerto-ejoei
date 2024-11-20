(function() {
    const socket = io();
    const sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);

    function sendUserAction(action, data) {
        socket.emit('userAction', {
            sessionId: sessionId,
            timestamp: new Date().toISOString(),
            page: window.location.pathname,
            action: action,
            data: data
        });
    }

    // Send page view on load
    sendUserAction('pageView', null);

    // Track input changes
    document.addEventListener('input', function(event) {
        if (event.target.tagName === 'INPUT') {
            sendUserAction('input', {
                inputId: event.target.id,
                value: event.target.value
            });
        }
    });

    // Track form submissions
    document.addEventListener('submit', function(event) {
        sendUserAction('formSubmit', {
            formId: event.target.id
        });
    });

    // Track user leaving the page
    window.addEventListener('beforeunload', function() {
        sendUserAction('leavePage', null);
    });
})();
