export default function PDFPreview({ pdfUrl }) {
    return (
        <div className="mt-4">
            <h4>Preview Filled Form</h4>
            <iframe src={pdfUrl} width="100%" height="500px" title="PDF Preview"></iframe>
            <a href={pdfUrl} download="filled_form.pdf" className="btn btn-success mt-3">
                Download Filled Form
            </a>
        </div>
    );
}
