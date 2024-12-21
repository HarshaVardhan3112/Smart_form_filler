import cv2
import pytesseract
from PIL import Image

# Ensure Tesseract is installed and set the path to the executable
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


def preprocess_image(image_path):
    # Read the image
    img = cv2.imread(image_path)

    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Denoise the image
    denoised = cv2.fastNlMeansDenoising(gray, h=30)

    # Apply adaptive thresholding
    thresholded = cv2.adaptiveThreshold(
        denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )

    return thresholded


def extract_text(preprocessed_image):
    # Use Tesseract to perform OCR
    text = pytesseract.image_to_string(preprocessed_image)
    return text


if __name__ == "__main__":
    # Input image path
    image_path = "Bhargavi_aadhar.jpg"  # Replace with your image path

    # Preprocess the image
    preprocessed_img = preprocess_image(image_path)

    # Save and display the preprocessed image for debugging
    cv2.imwrite("preprocessed_image.jpg", preprocessed_img)
    cv2.imshow("Preprocessed Image", preprocessed_img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

    # Extract text
    extracted_text = extract_text(preprocessed_img)
    print("Extracted Text:")
    print(extracted_text)
