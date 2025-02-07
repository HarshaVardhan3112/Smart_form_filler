import cv2
import pytesseract
import os


def preprocess_image(image_path):
    """
    Preprocess the input image for better OCR accuracy.
    """
    # Read the image
    img = cv2.imread(image_path)

    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Denoise the image
    denoised = cv2.fastNlMeansDenoising(gray, h=30)

    # Apply adaptive thresholding
    thresholded = cv2.adaptiveThreshold(
        denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
    
    # Apply dilation to make numbers more distinct
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
    dilated = cv2.dilate(thresholded, kernel, iterations=1)

    return dilated


def extract_text(preprocessed_image, languages="eng+hin+tel"):
    """
    Extract text from a preprocessed image using Tesseract.
    
    :param preprocessed_image: The preprocessed image ready for OCR.
    :param languages: Languages to be used for OCR (default: English, Hindi, Telugu).
    :return: Extracted text.
    """
    try:
        # Use Tesseract to perform OCR with the specified languages
        custom_config = "--oem 3 --psm 6 -c tessedit_char_whitelist=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
        text = pytesseract.image_to_string(preprocessed_image, lang=languages, config=custom_config)
        return text
    except Exception as e:
        print(f"Error during text extraction: {e}")
        return ""


if __name__ == "__main__":
    # Input image path
    image_path = "img\Bhargavi_aadhar.jpg"  # Replace with your image path

    try:
        # Preprocess the image
        print("Preprocessing the image...")
        preprocessed_img = preprocess_image(image_path)

        # Dynamically construct the filename
        # Extract original filename without extension
        base_name = os.path.splitext(os.path.basename(image_path))[0]
        # Add "preprocess" to the name
        preprocessed_img_path = f"preprocessed_img/{base_name}_preprocess.jpg"

        # Save and display the preprocessed image for debugging
        cv2.imwrite(preprocessed_img_path, preprocessed_img)
        print(f"Preprocessed image saved at: {preprocessed_img_path}")

        cv2.imshow("Preprocessed Image", preprocessed_img)
        cv2.waitKey(0)
        cv2.destroyAllWindows()

        # Extract text
        print("Extracting text from the image...")
        extracted_text = extract_text(preprocessed_img, languages="eng+tel")

        # Display the extracted text
        print("\nExtracted Text:")
        print(extracted_text)

    except Exception as e:
        print(f"An error occurred: {e}")
