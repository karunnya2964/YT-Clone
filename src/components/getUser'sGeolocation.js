if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      // Use latitude and longitude to display the user's location.
    });
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
  