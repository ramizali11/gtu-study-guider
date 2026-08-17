import { useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


interface ImportantQuestion {
  question: string;
  frequency: number;
}

interface ApiResponse {
  message: string;
  papers: {
    filename: string;
    question_count: number;
    questions: unknown[];
  }[];
  important_questions: ImportantQuestion[];
}

export default function ImportantQuestions() {
  const [files, setFiles] = useState<File[]>([]);
  const [questions, setQuestions] = useState<ImportantQuestion[]>([]);
  const [paperCount, setPaperCount] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const addFiles = (newFiles: File[]) => {
    const pdfFiles = newFiles.filter((file) => file.type === "application/pdf");

    if (pdfFiles.length === 0) {
      setError("Please select PDF files only.");
      return;
    }

    setError("");

    setFiles((previous) => {
      const existingNames = new Set(previous.map((file) => file.name));

      const uniqueFiles = pdfFiles.filter(
        (file) => !existingNames.has(file.name),
      );

      return [...previous, ...uniqueFiles];
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      addFiles(Array.from(event.target.files));
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();

    setDragging(false);

    const droppedFiles = Array.from(event.dataTransfer.files);

    addFiles(droppedFiles);
  };

  const removeFile = (index: number) => {
    setFiles((previous) => previous.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setFiles([]);
    setQuestions([]);
    setPaperCount(0);
    setTotalQuestions(0);
    setSearch("");
    setError("");
  };

  const processPapers = async () => {
    if (files.length === 0) {
      setError("Please upload at least one PDF.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await axios.post<ApiResponse>(
        "http://127.0.0.1:8000/important-questions/upload",
        formData,
      );

      const data = response.data;

      setQuestions(data.important_questions || []);
      setPaperCount(data.papers?.length || files.length);

      const questionTotal =
        data.papers?.reduce(
          (total, paper) => total + (paper.question_count || 0),
          0,
        ) || 0;

      setTotalQuestions(questionTotal);
    
    } catch (err) {
      console.error("PDF processing error:", err);

      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.detail ||
            "Unable to process the question papers.",
        );
      } else {
        setError("Something went wrong while processing the PDFs.");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return questions;
    }

    return questions.filter((item) =>
      item.question.toLowerCase().includes(query),
    );
  }, [questions, search]);

  const getFrequencyStyle = (frequency: number) => {
    if (frequency >= 5) {
      return {
        label: "🔥 Very Important",
        className: "bg-red-500/15 text-red-400 border-red-500/30",
      };
    }

    if (frequency >= 4) {
      return {
        label: "🔥 High Priority",
        className: "bg-orange-500/15 text-orange-400 border-orange-500/30",
      };
    }

    if (frequency === 3) {
      return {
        label: "⭐ Important",
        className: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
      };
    }

    return {
      label: "✓ Repeated",
      className: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    };
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-30 top-30 h-100 w-100 rounded-full bg-blue-600/10 blur-[120px]" />

        <div className="absolute right-25 top-[20%] h-87.5 w-87.5 rounded-full bg-purple-600/10 blur-[120px]" />

        <div className="absolute bottom-37.5 left-[35%] h-100 w-100 rounded-full bg-cyan-500/5 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-10">
       <button
            onClick={() => navigate("/dashboard")}
            className="mb-6 flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
          >
            ← Dashboard
          </button>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
              <span className="text-xl">🎓</span>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                GTU AI Study Assistant
              </p>

              <h1 className="text-2xl font-bold sm:text-3xl">
                Important Questions
              </h1>
            </div>
          </div>

          <p className="max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Upload atleast two previous GTU question papers and let AI identify
            the questions that repeat across papers.
          </p>
        </header>

        {/* Upload section */}
        <section className="mb-8">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-2xl backdrop-blur-xl sm:p-7">
          <div>

            <label
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              
              className={`relative flex min-h-65 flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                dragging
                ? "border-blue-400 bg-blue-500/10"
                : "border-border bg-background hover:border-blue-500/40 hover:bg-blue-500/5"
              }`}
              >
              <input
                id="pdf-upload"
                type="file"
                accept=".pdf,application/pdf"
                multiple
                onChange={handleFileChange}
                className="hidden"
                />

                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl">
                  📄
                </div>

                <h2 className="mb-2 text-lg font-semibold">
                  Upload GTU question papers
                </h2>

                <p className="mb-4 text-sm text-muted-foreground">
                  Drag & drop your PDFs here or{" "}
                  <span className="font-medium text-blue-400">
                    browse files
                  </span>
                </p>

                <p className="text-xs text-muted-foreground">
                  You can upload multiple PDF papers at once.
                </p>
            </label>
                </div>
            <br></br>
            {files.length > 0 && files.length < 5 && (
              <div className="mb-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
                <div className="flex items-start gap-3">
                  <div className="text-xl">💡</div>

                  <div>
                    <h3 className="font-semibold text-yellow-600 dark:text-yellow-400">
                      Upload more question papers
                    </h3>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      You have uploaded {files.length} question paper
                      {files.length !== 1 ? "s" : ""}. The more PDF papers you
                      upload, the more repeated questions we can identify
                      accurately.
                    </p>

                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Recommended: upload 5 or more previous GTU question
                      papers.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Selected files */}
            {files.length > 0 && (
              <div className="mt-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">
                    Selected papers ({files.length})
                  </p>

                  <button
                    onClick={clearAll}
                    className="text-xs text-slate-500 transition hover:text-red-400"
                  >
                    Clear all
                  </button>
                </div>

                <div className="grid gap-2">
                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="rounded-lg bg-red-500/10 px-2 py-2">
                          📕
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">
                            {file.name}
                          </p>

                          <p className="text-xs text-slate-500">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFile(index)}
                        className="ml-3 rounded-lg px-3 py-1.5 text-xs text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                ⚠️ {error}
              </div>
            )}

            {/* Process button */}
            <button
              onClick={processPapers}
              disabled={loading || files.length === 0}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 px-5 py-3.5 text-sm font-semibold shadow-lg shadow-blue-600/20 transition hover:from-blue-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  AI is analyzing papers...
                </>
              ) : (
                <>✨ Find Important Questions</>
              )}
            </button>
          </div>
        </section>

        <div className="mb-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
          <div className="flex gap-3">
            <div className="text-xl">⚠️</div>

            <div>
              <h3 className="font-semibold text-yellow-600 dark:text-yellow-400">
                Study Warning
              </h3>

              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                These questions are identified from previous GTU question papers
                and are provided for practice and revision. Studying only these
                questions does not guarantee passing the exam. Make sure you
                prepare the complete syllabus as well.
              </p>
            </div>
          </div>
        </div>

        {/* Results */}
        {questions.length > 0 && (
          <section>
            {/* Stats */}
            <div className="mb-7 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card p-5 backdrop-blur-xl">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Papers analyzed
                </p>

                <p className="mt-2 text-3xl font-bold">{paperCount}</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 backdrop-blur-xl">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Questions scanned
                </p>

                <p className="mt-2 text-3xl font-bold">{totalQuestions}</p>
              </div>

              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/6 p-5 backdrop-blur-xl">
                <p className="text-xs font-medium uppercase tracking-wider text-blue-400">
                  Repeated questions
                </p>

                <p className="mt-2 text-3xl font-bold text-blue-400">
                  {questions.length}
                </p>
              </div>
            </div>

            {/* Heading + Search */}
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-purple-400">
                  AI Analysis
                </p>

                <h2 className="text-2xl font-bold">Most Important Questions</h2>

                <p className="mt-1 text-sm text-slate-500">
                  Questions repeated across multiple GTU papers.
                </p>
              </div>

              <div className="relative sm:w-72">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  🔍
                </span>

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search questions..."
                  className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-blue-500/50"
                />
              </div>
            </div>

            {/* Question cards */}
            {filteredQuestions.length > 0 ? (
              <div className="grid gap-4">
                {filteredQuestions.map((item, index) => {
                  const style = getFrequencyStyle(item.frequency);

                  return (
                    <div
                      key={`${item.question}-${index}`}
                     className="group rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/30 hover:bg-accent hover:shadow-xl hover:shadow-blue-500/5 sm:p-6"
                    >
                      <div className="flex gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-500/20 to-purple-500/20 text-sm font-bold text-blue-300">
                          {index + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="mb-3 flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${style.className}`}
                            >
                              {style.label}
                            </span>

                            <span className="rounded-full border border-white/10 bg-white/3 px-2.5 py-1 text-[11px] font-medium text-slate-400">
                              Repeated in{" "}
                              <span className="text-foreground">
                                {item.frequency}
                              </span>{" "}
                              papers
                            </span>
                          </div>

                          <h3 className="text-base font-medium leading-7 text-card-foreground sm:text-lg">
                            {item.question}
                          </h3>
                        </div>

                        <div className="hidden text-2xl sm:block">
                          {item.frequency >= 4
                            ? "🔥"
                            : item.frequency === 3
                              ? "⭐"
                              : "✓"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-card p-10 text-center">
                <div className="mb-3 text-3xl">🔍</div>

                <p className="font-medium">No matching questions</p>

                <p className="mt-1 text-sm text-slate-500">
                  Try a different search term.
                </p>
              </div>
            )}
          </section>
        )}

        {/* Empty state */}
        {!loading && files.length === 0 && questions.length === 0 && (
          <div className="mt-10 text-center">
            <p className="text-sm text-muted-foreground">
              Upload previous GTU papers to discover frequently repeated
              questions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
