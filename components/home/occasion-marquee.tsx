import { Fragment } from "react";

const OCCASIONS = [
  { text: "First Date", italic: false },
  { text: "Interview", italic: true },
  { text: "Wedding Guest", italic: false },
  { text: "CNY", italic: true },
  { text: "Company D&D", italic: false },
  { text: "Night Out", italic: true },
];

function MarqItems({ suffix }: { suffix: string }) {
  return (
    <>
      {OCCASIONS.map((o) => (
        <Fragment key={`${o.text}-${suffix}`}>
          <span
            style={{
              fontStyle: o.italic ? "italic" : "normal",
              color: o.italic ? "#9C978E" : "#ECEBE8",
            }}
          >
            {o.text}
          </span>
          <span style={{ color: "#C8A96A", fontSize: "20px" }}>◆</span>
        </Fragment>
      ))}
    </>
  );
}

export function OccasionMarquee() {
  return (
    <section
      aria-label="Occasions we style for"
      style={{ background: "#0A0A0B", padding: "34px 0", overflow: "hidden" }}
    >
      <div
        aria-hidden="true"
        style={{
          display: "flex",
          width: "max-content",
          gap: "48px",
          alignItems: "center",
          fontFamily: "var(--font-dm-serif), Georgia, serif",
          fontSize: "40px",
          whiteSpace: "nowrap",
          animation: "wmMarq 40s linear infinite",
        }}
      >
        <MarqItems suffix="a" />
        <MarqItems suffix="b" />
      </div>
      <span className="sr-only">
        First Date, Interview, Wedding Guest, CNY, Company D&D, Night Out
      </span>
    </section>
  );
}
