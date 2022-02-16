export default function FullTemplate({ children }) {
  return (
    <div className="h-screen flex flex-col">
      <main className="grow">{children}</main>
    </div>
  );
}
