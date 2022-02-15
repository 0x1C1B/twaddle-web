export default function BorderTemplate({ children }) {
  return (
    <div className="h-screen flex flex-col">
      <header />
      <main className="grow">{children}</main>
      <footer />
    </div>
  );
}
