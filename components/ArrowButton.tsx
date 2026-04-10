"use client";
type Props = {
  onClick: () => void;
  direction?: "left" | "right";
};

export default function ArrowButton({ onClick, direction = "right" }: Props) {
  const src = direction === "left" ? "/left_arrow.png" : "/right_arrow.png";
  const alt = direction === "left" ? "Back" : "Continue";

  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        border: "none",
        padding: 0,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        filter: "drop-shadow(0 0 8px rgba(55,231,255,0.35))",
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: 110,
          height: "auto",
          display: "block",
          imageRendering: "pixelated",
        }}
      />
    </button>
  );
}