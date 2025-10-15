'use client';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { axiosClient } from "@/app/utils/axiosClient";

export default function ProblemSubmissionsPage() {
  const { problem } = useSelector((state: any) => state.problem);
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [noteValue, setNoteValue] = useState("");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/api/problems/${problem._id}/submissions`);
        setSubmissions(res.data.submissions);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && problem) fetchSubmissions();
  }, [isAuthenticated, problem]);

  const formatMemory = (kb: number) => (kb / 1024).toFixed(2);

  // 🟡 fetch single submission details on row click
  const handleRowClick = async (id: string) => {
    try {
      const res = await axiosClient.get(`/api/submissions/${id}`);
      setSelectedSubmission(res.data.submission);
    } catch (error) {
      console.error("Error fetching submission details:", error);
    }
  };

  // ✏️ Start editing a note
  const handleEditNote = (id: string, currentNote: string) => {
    setEditingId(id);
    setNoteValue(currentNote);
  };

  // 💾 Save note to backend
  const handleSaveNote = async (id: string) => {
    try {
      await axiosClient.post(`/api/submissions/${id}/notes`, { text: noteValue });
      setSubmissions(prev =>
        prev.map(s => (s.id === id ? { ...s, notes: { ...s.notes, text: noteValue } } : s))
      );
      setEditingId(null);
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  if (loading) return <p>Loading submissions...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Problem Submissions</h1>

      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Language</th>
              <th className="border border-gray-300 p-2">Runtime (ms)</th>
              <th className="border border-gray-300 p-2">Memory (MB)</th>
              <th className="border border-gray-300 p-2">Notes</th>
              <th className="border border-gray-300 p-2">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <tr
                key={sub.id}
                onClick={() => handleRowClick(sub.id)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="border border-gray-300 p-2 capitalize">{sub.status}</td>
                <td className="border border-gray-300 p-2">{sub.language}</td>
                <td className="border border-gray-300 p-2">{sub.runtime}</td>
                <td className="border border-gray-300 p-2">{formatMemory(sub.memory)}</td>

                {/* ✏️ Notes cell */}
                <td
                  className="border border-gray-300 p-2"
                  onClick={(e) => {
                    e.stopPropagation(); // avoid triggering row click
                    handleEditNote(sub.id, sub.notes?.text || "");
                  }}
                >
                  {editingId === sub.id ? (
                    <div className="flex gap-2">
                      <input
                        className="border p-1 w-full"
                        value={noteValue}
                        onChange={(e) => setNoteValue(e.target.value)}
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveNote(sub.id)}
                        className="text-blue-600"
                      >
                        💾
                      </button>
                    </div>
                  ) : (
                    sub.notes?.text || "-"
                  )}
                </td>

                <td className="border border-gray-300 p-2">
                  {new Date(sub.submittedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 🪟 Modal for submission details */}
      {selectedSubmission && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedSubmission(null)}
        >
          <div
            className="bg-white p-6 rounded-md max-w-3xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-2">
              Submission — {selectedSubmission.id}
            </h2>
            <p>Status: <b>{selectedSubmission.status}</b></p>
            <p>Language: {selectedSubmission.language}</p>
            <p>Runtime: {selectedSubmission.runtime} ms</p>
            <p>Memory: {formatMemory(selectedSubmission.memory)} MB</p>
            <p>
              Test Cases: {selectedSubmission.testCasesPassed}/
              {selectedSubmission.testCasesTotal}
            </p>

            <div className="mt-4">
              <h3 className="font-semibold mb-1">Code:</h3>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                {selectedSubmission.code}
              </pre>
            </div>

            <button
              onClick={() => setSelectedSubmission(null)}
              className="mt-4 bg-gray-800 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
