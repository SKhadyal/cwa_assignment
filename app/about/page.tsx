export default function About() {
  return (
    <section className="container py-4">
      <h1>About</h1>
      <p><strong>Name:</strong> Sushank Sharma</p>
      <p><strong>Student Number:</strong> 21664359</p>

      <h2>How to use this website</h2>
      <div className="ratio ratio-16x9 mt-3">
        <iframe
          src="https://www.youtube.com/embed/FVbTop42cG4"
          title="How to use this website"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <p className="mt-3">
        If the video does not load, you can also watch it directly on{" "}
        <a href="https://youtu.be/FVbTop42cG4" target="_blank" rel="noopener noreferrer">
          YouTube
        </a>.
      </p>
    </section>
  );
}

