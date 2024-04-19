// Get elements from the DOM
const form = document.getElementById("redactForm");
const contentInput = document.getElementById("content");
const redactWordsInput = document.getElementById("redactWords");
const replacementSelect = document.getElementById("replacement");
const redactedText = document.getElementById("redacted-text");
const wordsScanned = document.getElementById("words-scanned");
const wordsRedacted = document.getElementById("words-redacted");
const charactersRedacted = document.getElementById("characters-redacted");
const timeTaken = document.getElementById("time-taken");
const customWordInput = document.getElementById("customWordInput");

// Function to toggle visibility of the custom word input field
function toggleCustomWordInput() {
  const customWordContainer = document.getElementById("customWordContainer");
  const selectedOption = replacementSelect.value;

  if (selectedOption === "REDACTED") {
    customWordContainer.style.display = "block";
  } else {
    customWordContainer.style.display = "none";
  }
}

// Event listener to toggle visibility of custom word input field when selection changes
replacementSelect.addEventListener("change", toggleCustomWordInput);

// Function to escape special characters in regular expressions
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Function to redact content
function redactContent() {
  const content = contentInput.value;
  const redactWords = redactWordsInput.value.split(" ");
  let replacement;

  // If custom word option is selected, use value from custom word input field
  if (replacementSelect.value === "REDACTED") {
    replacement = customWordInput.value;
  } else {
    replacement = replacementSelect.value;
  }

  // Start timer
  const startTime = performance.now();

  // Create regular expression pattern for each word to be redacted
  const patterns = redactWords.map(
    (word) => new RegExp(`\\b${escapeRegExp(word)}\\b`, "gi")
  );

  // Replace words with chosen replacement
  let redactedContent = content;
  let matchedWords = 0;
  for (const pattern of patterns) {
    if (replacementSelect.value === "REDACTED") {
      redactedContent = redactedContent.replace(pattern, replacement);
    } else {
      redactedContent = redactedContent.replace(pattern, (match) =>
        replacement.repeat(match.length)
      );
    }

    matchedWords++;
  }

  // End timer
  const endTime = performance.now();
  const timeDiff = (endTime - startTime) / 1000;

  // Update redacted text
  redactedText.textContent = redactedContent;

  // Update stats
  wordsScanned.textContent = content.split(/\s+/).length;
  wordsRedacted.textContent = matchedWords;
  charactersRedacted.textContent = redactedContent.replace(/\s/g, "").length;
  timeTaken.textContent = timeDiff.toFixed(2) + " seconds";
}

// Function to reset form
function resetForm() {
  form.reset();
  redactedText.textContent = "";
  wordsScanned.textContent = "0";
  wordsRedacted.textContent = "0";
  charactersRedacted.textContent = "0";
  timeTaken.textContent = "0 seconds";
}

// Event listeners for form submission and reset
form.addEventListener("submit", function (e) {
  e.preventDefault();
  redactContent();
});

document.querySelector(".reset-btn").addEventListener("click", resetForm);
