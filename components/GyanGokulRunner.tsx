import Link from "next/link";
import "./GyanGokulRunner.css";

export default function GyanGokulRunner() {
  return (
    <div className="gyangokul-runner-track">
      <Link
        href="/gyangokul"
        className="gyangokul-runner"
        aria-label="Visit GyanGokul"
      >
        <div className="gyangokul-speech-bubble">
          Follow me! ✨
        </div>

        <img
          src="games/GyanGokul/Boy Running.png"
          alt="GyanGokul character"
        />
      </Link>
    </div>
  );
}