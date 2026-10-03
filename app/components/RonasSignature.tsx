import "./RonasSignature.css";

export default function RonasSignature() {
  return (
    <div className="ronas-signature-wrap">
      <h1 className="ronas-signature">Ronas Corduene</h1>

      {/* The pen travels with the reveal edge as the name is written. */}
      <span className="ronas-signature-pen" aria-hidden="true" />
    </div>
  );
}
