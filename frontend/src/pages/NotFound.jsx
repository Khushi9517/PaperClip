import { useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="notfound-page">
      <div className="notfound-container">
        <div className="notfound-bg-text">404</div>
        <div className="notfound-content">
          <h1 className="notfound-title">Page Not Found</h1>
          <p className="notfound-sub">
            Looks like this page was lost somewhere between the inkwell and the paper.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;