export default function LoadingSpinner({ message }) {
    return (
        <div className="text-center mt-3">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">{message}</p>
        </div>
    );
}
