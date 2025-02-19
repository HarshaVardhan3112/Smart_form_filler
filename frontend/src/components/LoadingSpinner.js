import './styledcomponents.css';
export default function LoadingSpinner({ message }) {
    return (
        <div className="loading-spinner">
            <div className="spinner"></div>
            <p className="loading-message">{message}</p>
        </div>
    );
}