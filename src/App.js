import './App.css';
import YaDiskUploader from './components/YaDiskUploader';

function App() {
  const LIMIT = 100;

  const hash_token = document.location.hash;
  if (!hash_token) {
      
    return <div className="App">
      <h2>Please Authorize</h2>
      <p>Seems like you didn't grant a permission to your Yandex disk.. Please authorize here</p>
      <button><a href="https://oauth.yandex.ru/authorize?response_type=token&client_id=89ed7aea9f424d399d32080abea953a3">Authorize</a></button>
    </div>
  }

  return (
    <div className="App">
      <YaDiskUploader LIMIT={LIMIT}/>
    </div>
  );
}

export default App;
