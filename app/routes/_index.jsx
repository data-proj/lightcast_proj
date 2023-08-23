export const meta = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="grid grid-cols-3">
      <a
        target="_blank"
        href="https://remix.run/tutorials/blog"
        rel="noreferrer"
      >
        15m Quickstart Blog Tutorial
      </a>

      <a
        target="_blank"
        href="https://remix.run/tutorials/jokes"
        rel="noreferrer"
      >
        Deep Dive Jokes App Tutorial
      </a>

      <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
        Remix Docs
      </a>
    </div>
  );
}
