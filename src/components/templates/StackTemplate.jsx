import Navbar from "../organisms/Navbar";

export default function BorderTemplate({ children }) {
  return (
    <div className="h-screen flex flex-col">
      <header>
        <Navbar />
      </header>
      <main className="grow">{children}</main>
      <footer />
    </div>
  );
}
