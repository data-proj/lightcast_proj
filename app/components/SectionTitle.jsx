export default function SectionTitle({ title, underline }) {
  return (
    <div
      className={`${
        underline ? "border-b" : ""
      } pb-2 text-xl font-semibold tracking-tight`}
    >
      {title}
    </div>
  );
}
