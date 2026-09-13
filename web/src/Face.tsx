import type { FaceState } from "./types";

const labels: Record<FaceState, string> = {
  idle: "IDLE",
  listening: "LISTEN",
  thinking: "THINK",
  speaking: "SPEAK",
  happy: "HELLO",
  alert: "ALERT",
  sleepy: "SLEEP",
  movie: "MOVIE",
  study: "STUDY",
  quiet: "QUIET",
};

export function Face({ state }: { state: FaceState }) {
  return (
    <div className={`oled ${state}`}>
      <div className="oled-chrome">
        <span>FRIDAY</span>
        <span>{labels[state]}</span>
      </div>
      <div className="oled-screen" aria-label={`Face is ${state}`}>
        <div className="eyes">
          <i />
          <i />
        </div>
        <div className="mouth" />
      </div>
    </div>
  );
}
