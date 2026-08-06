import { useState } from "react";

function Papers() {
  const [session, setSession] = useState("Winter 2025");
  const [course, setCourse] = useState("Diploma");
  const [subjectCode, setSubjectCode] = useState("");
  const [loading, setLoading] = useState(false);
  const currentYear = new Date().getFullYear();
  const sessions = [];

  for (let year = currentYear; year >= 2017; year--) {
  sessions.push(`Winter ${year}`);
  sessions.push(`Summer ${year}`);
}

  const searchPaper = async () => {
    if (!subjectCode.trim()) {
      alert("Enter Subject Code");
      return;
    }

    setLoading(true);

    try {
      const newTab = window.open("", "_blank");
      const response = await fetch("http://127.0.0.1:8000/papers/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session,
          course,
          subject_code: subjectCode,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
         console.log("PDF URL:", data.url);
         if (newTab) {
           newTab.location.href = data.url;
         }
      } else {
        alert("Paper not found");
      }
    } catch (err) {
      alert("Server Error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center items-center">
      <div className="w-full max-w-lg rounded-xl bg-slate-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-center text-white mb-8">
          Previous Year Papers
        </h1>

        <div className="space-y-5">
          <div>
            <label className="text-gray-300">Session</label>

            <select
              value={session}
              onChange={(e) => setSession(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
            >
              {sessions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-gray-300">Course</label>

            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
            >
              <option>Diploma</option>
            </select>
          </div>

          <div>
            <label className="text-gray-300">Subject Code</label>

            <input
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              placeholder="4320001"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white outline-none"
            />
          </div>

          <button
            onClick={searchPaper}
            disabled={loading}
            className="mt-4 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            {loading ? "Searching..." : "Search Paper"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Papers;
