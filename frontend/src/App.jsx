import React, { useEffect, useState } from 'react';
import api from './services/api';

function App() {
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    api.get('/estoque/ping')
      .then(response => setMensagem(response.data.mensagem))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>{mensagem || 'Carregando...'}</h1>
    </div>
  );
}

export default App;
