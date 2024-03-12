<!-- Full Bleed Video Setup -->
<div class="video-container">
  <div class="welcome-text">Welcome to DriveXperience</div>
  <video
    src="HomePageVid.mp4"
    autoplay
    muted
    playsinline
    class="full-bleed-video">
    Your browser does not support the video tag.
  </video>
</div>

<!-- Adjusted Content Area under the video -->
<div class="content-area">
  <div class="find-branch mb-20" style="color: var(--color-tertiary-900);">
    <h2>Find a DriveExperience Branch Near You</h2>
    <input
      type="text"
      placeholder="Enter your postal code"
      class="input-field" />
  </div>

  <!-- Feature Buttons -->
  <div class="features-grid">
    <a
      href="/browse-vehicles"
      class="feature-box bg-tertiary-900 text-tertiary-100 hover:bg-tertiary-600">
      <h3>Explore our Vehicles</h3>
      <p>Text</p>
    </a>

    <a
      href="/browse-vehicles"
      class="feature-box bg-tertiary-900 text-tertiary-100 hover:bg-tertiary-600">
      <h3>Explore our Vehicles</h3>
      <p>Text</p>
    </a>

    <a
      href="/browse-vehicles"
      class="feature-box bg-tertiary-900 text-tertiary-100 hover:bg-tertiary-600">
      <h3>Explore our Vehicles</h3>
      <p>Text</p>
    </a>
  </div>
</div>

<form method="POST" action="?/makeAdmin">
  <button type="submit" class="variant-filled-secondary btn">Admin</button>
</form>

<style>
  .video-container {
    position: relative;
    width: 100%;
    height: 90vh;
    display: flex;
    align-items: center; /* Vertically centers content */
    justify-content: flex-start; /* Aligns content to the left */
    margin-top: -165px; /* Adjust as needed */
    z-index: 1; /* Ensures stacking context */
  }

  .welcome-text {
    position: absolute;
    left: 38px;
    color: var(--color-tertiary-900);
    font-size: 2rem;
    font-weight: bold;
    z-index: 2;
    top: 27%; /* Adjust for vertical positioning */
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
  }

  .full-bleed-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1; /* Video behind text */
  }

  .content-area {
    padding: 20px 0;
  }

  .find-branch {
    margin-top: 2rem;
    text-align: center;
    color: var(--color-secondary-500);
  }

  .features-grid {
    display: flex;
    justify-content: space-around; /* Space around feature boxes */
    flex-wrap: wrap;
    gap: 20px; /* Gap between boxes */
    margin: auto;
    max-width: 1200px;
  }

  .feature-box {
    width: 300px; /* Box width */
    padding: 20px; /* Padding inside boxes */
    border-radius: 5px; /* Rounded corners */
    margin: 0 auto; /* Centers the boxes */
    text-align: center; /* Centers the text horizontally */
    background-color: var(--color-tertiary-900); /* Background color */
    color: var(--color-tertiary-100); /* Text color */
    display: flex; /* Enables flexbox layout */
    flex-direction: column; /* Stacks items vertically */
    justify-content: center; /* Centers items vertically */
    height: 100%; /* Ensures the box takes full available height */
  }
</style>
