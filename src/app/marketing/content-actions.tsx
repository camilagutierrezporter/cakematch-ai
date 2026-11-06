"use client";

import { useState } from "react";

type ContentActionsProps = {
  content: string;
  filename: string;
  label: string;
};

export default function ContentActions({
  content,
  filename,
  label,
}: ContentActionsProps) {
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error">("success");

  async function copyContent() {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard access is unavailable in this browser.");
      }

      await navigator.clipboard.writeText(content);
      setFeedback(`${label} copied to the clipboard.`);
      setFeedbackType("success");
    } catch {
      setFeedback(
        `Could not copy ${label.toLowerCase()}. Check browser clipboard permissions and try again.`,
      );
      setFeedbackType("error");
    }
  }

  function exportContent() {
    let downloadUrl: string | null = null;
    let downloadLink: HTMLAnchorElement | null = null;

    try {
      const file = new Blob([content], { type: "text/plain;charset=utf-8" });
      downloadUrl = URL.createObjectURL(file);
      downloadLink = document.createElement("a");
      downloadLink.href = downloadUrl;
      downloadLink.download = filename;
      downloadLink.hidden = true;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      const objectUrl = downloadUrl;
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      downloadUrl = null;
      setFeedback(`${filename} download started.`);
      setFeedbackType("success");
    } catch {
      setFeedback(`Could not export ${label.toLowerCase()}. Please try again.`);
      setFeedbackType("error");
    } finally {
      downloadLink?.remove();
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    }
  }

  return (
    <div className="content-actions">
      <div
        className="content-action-buttons"
        role="group"
        aria-label={`${label} actions`}
      >
        <button
          className="content-action-button"
          type="button"
          onClick={copyContent}
          aria-label={`Copy ${label}`}
        >
          Copy
        </button>
        <button
          className="content-action-button"
          type="button"
          onClick={exportContent}
          aria-label={`Export ${label} as a text file`}
        >
          Export .txt
        </button>
      </div>
      <p
        className={`content-action-feedback${feedbackType === "error" ? " is-error" : ""}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {feedback}
      </p>
    </div>
  );
}
