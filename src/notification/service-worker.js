self.addEventListener('push', function (event) {
    const options = {
        body: event.data.text(),
        icon: '/icon.png', // Add your app icon
        badge: '/badge.png', // Add your badge icon
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };

    event.waitUntil(
        self.registration.showNotification('Order Status Update', options)
    );
});