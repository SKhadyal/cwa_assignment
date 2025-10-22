"use client";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <p>
        API service is running. Use <code>/api/users</code> to interact with the
        REST endpoint.
      </p>
    </main>
  );
}
