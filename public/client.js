self.addEventListener('push', event => {
    const data = event.data.json();
        console.log(data)
        var notificationOptions = {
          body: data.text,
          icon: data.image,
          data: { url:data.url }, 
          actions: [{action: "open_url", title: "Read Now"}]
        };
      self.registration.showNotification(data.title,notificationOptions );
  });
