// app/about/page.tsx
export default function About() {
  return (
    <section>
      <h1>About</h1>
      <p><strong>Name:</strong> Your Name</p>
      <p><strong>Student Number:</strong> 123456</p>

      <h2>How to use this website</h2>
      <video width="720" controls>
        <source src="/howto.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </section>
  );
}
