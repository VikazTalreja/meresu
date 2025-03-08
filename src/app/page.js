"use client";
import { useState } from "react";

export default function HomePage() {
  const [companyName, setCompanyName] = useState("");
  // const [data, setData] = useState({
  //     "id": "71425e2f-b9b5-4310-8bf7-93a98d7aaa6d",
  //     "model": "sonar",
  //     "created": 1741448653,
  //     "usage": {
  //         "prompt_tokens": 1218,
  //         "completion_tokens": 281,
  //         "total_tokens": 1499
  //     },
  //     "citations": [
  //         "https://www.thecompanycheck.com/company/meresu-ventures-india-private-limited/U63119MH2024PTC426471",
  //         "https://www.indiafilings.com/search/meresu-ventures-india-private-limited-cin-U63119MH2024PTC426471",
  //         "https://internshala.com/company/meresu-ventures-india-private-limited-1739380952/",
  //         "https://meresu.in",
  //         "https://www.falconebiz.com/company/MERESU-VENTURES-INDIA-PRIVATE-LIMITED-U63119MH2024PTC426471"
  //     ],
  //     "object": "chat.completion",
  //     "choices": [
  //         {
  //             "index": 0,
  //             "finish_reason": "stop",
  //             "message": {
  //                 "role": "assistant",
  //                 "content": "## Basic Information\n\n- **Full Legal Name:** Meresu Ventures India Private Limited\n- **Corporate Identification Number (CIN):** U63119MH2024PTC426471\n- **GST Number:** Not available in the provided data.\n\n## Director Information\n\n- **Names and Roles:**\n  - Manish Bhingarde (Director)\n  - Vijendra Pawar (Director)\n  - Ashish Singh (Director)\n  - Narayan Debanath (Director)\n  - Harsh Chaudhari (Director)\n- **Tenure:** All directors were appointed on June 4, 2024.\n\n## Financials\n\n- **Revenue, Profit, Key Ratios:** The latest financial reports are not available in the provided data. However, the company has an authorized and paid-up capital of ₹0.10 million (₹100,000) each[1][2].\n- **Latest Filings:** No recent financial filings have been reported.\n\n## Market Position & History with Steel Vendors\n\nThere is no specific information available regarding Meresu Ventures India's involvement with steel vendors, such as JSW Steel competitors, purchase history, supplier relationships, existing contracts, key procurement policies, supplier preferences, or buying behavior. Meresu Ventures India is primarily an AI-driven HR tech SaaS company focused on workforce management and employee engagement solutions[3][4]."
  //             },
  //             "delta": {
  //                 "role": "assistant",
  //                 "content": ""
  //             }
  //         }
  //     ]
  // });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null)

  const fetchCompanyInfo = async () => {
    if (!companyName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/company-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ companyName }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch company details");
      }

      const data = await response.json();
      setData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeMarkdown = (text) => {
    return text.replace(/\*\*(.*?)\*\*/g, "$1");
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="h-[40%] flex flex-col items-center justify-center bg-gray-200 p-6">
        <h1 className="text-4xl font-bold text-gray-800">Company Search</h1>
        <input
          type="text"
          placeholder="Enter company name or CIN"
          className="mt-4 w-2/3 md:w-1/2 p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <button
          onClick={fetchCompanyInfo}
          className={`mt-4 px-6 py-2 rounded-lg text-white transition ${
            loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="h-[60%] bg-white p-6 overflow-y-auto">
      {loading && <p className="text-center text-gray-600">Fetching company details...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {data && data.choices?.[0]?.message?.content ? (
        <div className="p-4 border border-gray-300 rounded-lg shadow-md bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Company Details</h2>

          {/* Extract and format content dynamically */}
          <div className="space-y-4 text-gray-800">
            {data.choices[0].message.content
              .split("\n\n")
              .map((section, index) => {
                const [title, ...details] = section.split("\n");
                return (
                  <div key={index}>
                    <h3 className="text-lg font-semibold">
                      {removeMarkdown(title.replace(/## /, ""))}
                    </h3>
                    <ul className="list-disc pl-5 text-gray-700">
                      {details.map((detail, i) => (
                        <li key={i}>{removeMarkdown(detail.replace(/^- /, ""))}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}

            {data.citations && data.citations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold">References & Citations</h3>
                <ul className="list-disc pl-5 text-blue-600">
                  {data.citations.map((link, index) => (
                    <li key={index}>
                      <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
    </div>
  );
}
