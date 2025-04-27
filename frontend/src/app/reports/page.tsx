'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import ReportCard from '@/components/ReportCard';

interface AnalyzeResponse {
  analysis_id: string;
  patent_id: string;
  company_name: string;
  analysis_date: string;
  top_infringing_products: any[];
  overall_risk_assessment: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<AnalyzeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    fetch(`${apiUrl}/reports`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch reports');
        return res.json();
      })
      .then((data: AnalyzeResponse[]) => {
        setReports(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [apiUrl]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-full mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Saved Reports</h1>
        {reports.length === 0 ? (
          <p className="text-gray-600">No saved reports yet.</p>
        ) : (
          reports.map((r) => (
            <div key={r.analysis_id} className="border rounded-lg bg-white shadow-sm">
              <div className="px-4 py-2 flex justify-between items-center">
                <div>
                  <p><span className="font-semibold">Analysis ID:</span> {r.analysis_id}</p>
                  <p><span className="font-semibold">Patent:</span> {r.patent_id}</p>
                  <p><span className="font-semibold">Company:</span> {r.company_name}</p>
                  <p><span className="font-semibold">Date:</span> {r.analysis_date}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const el = document.getElementById(r.analysis_id);
                    if (el) el.classList.toggle('hidden');
                  }}
                >
                  Toggle Details
                </Button>
              </div>
              <div id={r.analysis_id} className="hidden">
                <ReportCard report={r} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
