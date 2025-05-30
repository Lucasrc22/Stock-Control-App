import "../styles/components.css";


export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <img src="/assets/logo.png" alt="Logo" className="logo" />
        <h1 className="title">Stock Control</h1>
      </div>
    </header>
  );
}
