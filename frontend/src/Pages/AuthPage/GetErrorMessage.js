export default function getErrorMessage(errorData) {
    // Get first field name
    const firstField = Object.keys(errorData)[0];

    // Get the first field's value
    const messages = errorData[firstField];

    // DRF standard:
    // { password: ["message"] }

    if (Array.isArray(messages)) {
        return messages[0];
    }

    // Your custom nested style:
    // { password: { error: "message" } }

    if (typeof messages === "object") {
        return messages.error;
    }

    return "Unknown error.";
}