// components/footer.tsx
export default function Footer() {
  const year = new Date().getFullYear(); // stable enough (year)
  return (
    <footer>
      © {year} Your Name — Student No: 123456 — Built for CSE3CWA/CSE5006
    </footer>
  );
}
