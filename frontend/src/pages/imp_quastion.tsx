import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

interface Question {
  question_number: string;
  question: string;
  option: "OR" | null;
}

interface PaperResult {
  filename: string;
  question_count: number;
  questions: Question[];
}

interface UploadResponse {
  message: string;
  papers: PaperResult[];
}

function Important() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [results, setResults] = useState<PaperResult[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    setMessage("");

    if (files.length === 0) {
      return;
    }

    // PDF validation
    const nonPdfFile = files.find(
      (file) => file.type !== "application/pdf"
    );

    if (nonPdfFile) {
      setMessage("Only PDF files are allowed.");
      e.target.value = "";
      return;
    }

    // Maximum 5 PDFs
    if (selectedFiles.length + files.length > 5) {
      setMessage("You can upload a maximum of 5 PDF files.");
      e.target.value = "";
      return;
    }

    // Duplicate validation
    const duplicateFile = files.find((newFile) =>
      selectedFiles.some(
        (existingFile) =>
          existingFile.name === newFile.name &&
          existingFile.size === newFile.size
      )
    );

    if (duplicateFile) {
      setMessage(
        `"${duplicateFile.name}" is already selected.`
      );
      e.target.value = "";
      return;
    }

    setSelectedFiles((prev) => [...prev, ...files]);

    e.target.value = "";
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) =>
      prev.filter((_, fileIndex) => fileIndex !== index)
    );

    setMessage("");
  };

  const handleAnalyze = async () => {
    if (selectedFiles.length === 0) {
      setMessage("Please select at least one PDF.");
      return;
    }

    setLoading(true);
    setMessage("Processing question papers...");
    setResults([]);

    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await api.post<UploadResponse>(
        "/important-questions/upload",
        formData
      );

      console.log(
        "PDF extraction result:",
        response.data
      );

      setResults(response.data.papers || []);

      setMessage(
        response.data.message ||
          "Question papers processed successfully."
      );
    } catch (error: any) {
      console.error("PDF processing error:", error);

      console.error(
        "STATUS:",
        error.response?.status
      );

      console.error(
        "RESPONSE DATA:",
        error.response?.data
      );

      const detail = error.response?.data?.detail;

      if (Array.isArray(detail)) {
        setMessage(
          detail
            .map(
              (item: any) =>
                item.msg || "Validation error"
            )
            .join(", ")
        );
      } else if (typeof detail === "string") {
        setMessage(detail);
      } else {
        setMessage(
          "Failed to process question papers."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Dashboard
          </Link>

          <h1 className="mt-5 text-3xl font-bold text-foreground">
            Important Questions
          </h1>

          <p className="mt-2 text-muted-foreground">
            Upload previous GTU question papers to analyze
            and find important questions.
          </p>
        </div>

        {/* Upload Card */}
        <div className="rounded-xl border border-slate-200 bg-background p-6 shadow-sm dark:border-gray-700">

          <h2 className="text-xl font-semibold text-foreground">
            Upload Question Papers
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Select up to 5 GTU question-paper PDFs.
          </p>

          {/* Hidden input */}
          <input
            type="file"
            accept=".pdf,application/pdf"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id="pdf-upload"
          />

          {/* Upload area */}
          <label
            htmlFor="pdf-upload"
            className="mt-6 flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-background px-6 py-10 text-center transition hover:border-blue-500 dark:border-gray-700"
          >
            <div>
              <p className="font-semibold text-foreground">
                Click to upload question papers
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                PDF files only • Maximum 5 papers
              </p>
            </div>
          </label>

          {/* Message */}
          {message && (
            <p
              className={`mt-4 text-center text-sm ${
                results.length > 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          {/* Selected files */}
          {selectedFiles.length > 0 && (
            <div className="mt-6">

              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-foreground">
                  Selected Papers
                </h3>

                <span className="text-sm text-muted-foreground">
                  {selectedFiles.length} / 5
                </span>
              </div>

              <div className="space-y-3">

                {selectedFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${file.size}`}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-background p-3 dark:border-gray-700"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">
                        {file.name}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(
                          2
                        )}{" "}
                        MB
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveFile(index)
                      }
                      disabled={loading}
                      className="ml-4 rounded-md px-3 py-1 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950"
                    >
                      Remove
                    </button>
                  </div>
                ))}

              </div>
            </div>
          )}

          {/* Analyze button */}
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={
              selectedFiles.length === 0 ||
              loading
            }
            className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Analyzing Papers..."
              : "Analyze Papers"}
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-8 space-y-6">

            <h2 className="text-2xl font-bold text-foreground">
              Extracted Questions
            </h2>

            {results.map((paper) => (
              <div
                key={paper.filename}
                className="rounded-xl border border-slate-200 bg-background p-6 shadow-sm dark:border-gray-700"
              >

                {/* Paper header */}
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {paper.filename}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {paper.question_count} questions
                    </p>
                  </div>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {paper.question_count} Questions
                  </span>

                </div>

                {/* Questions */}
                <div className="space-y-3">

                  {paper.questions.map(
                    (question, index) => (
                      <div
                        key={`${paper.filename}-${index}`}
                        className="rounded-lg border border-slate-200 p-4 dark:border-gray-700"
                      >

                        <div className="flex gap-3">

                          <span className="shrink-0 font-semibold text-blue-600">
                            {question.question_number}.
                          </span>

                          <div className="min-w-0 flex-1">

                            <p className="text-foreground">
                              {question.question}
                            </p>

                            {question.option ===
                              "OR" && (
                              <span className="mt-2 inline-block rounded bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                                OR
                              </span>
                            )}

                          </div>

                        </div>

                      </div>
                    )
                  )}

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default Important;