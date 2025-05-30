import '../styles/components.css'; // Certifique-se que o nome do arquivo está correto

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
