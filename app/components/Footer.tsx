import Link from "next/link";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-line" />

      <div className="footer-top">
        <div className="footer-brand">
          <div>
            <span className="footer-label">RONAS / CORDUENE</span>
            <h2>BUILT<br />DIFFERENT.</h2>
          </div>
        </div>

        <nav className="footer-nav">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/store">Store</Link>
        </nav>
      </div>

      <div className="footer-middle">
        <span>RONAS</span>
      </div>

      <div className="footer-line" />

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} RONAS CORDUENE</span>

        <span>AUTOMOTIVE EQUIPMENT</span>

        <span>ALL RIGHTS RESERVED</span>
      </div>
    </footer>
  );
}
