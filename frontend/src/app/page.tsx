// File: src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import ReportCard from '@/components/ReportCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import SearchableDropdown from '@/components/SearchableDropdown';

export default function Home() {
  const [patentId, setPatentId] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [patents, setPatents] = useState<string[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

  // Fetch available patents and companies for dropdowns
  useEffect(() => {
    fetch(`${apiUrl}/patents`)
      .then((res) => res.json())
      .then((data) => setPatents(data))
      .catch(() => {
        console.warn('Failed to load patents');
      });

    fetch(`${apiUrl}/companies`)
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch(() => {
        console.warn('Failed to load companies');
      });
  }, [apiUrl]);

  async function analyze() {
    if (!patentId || !companyName) {
      setError('Please select both a patent and a company.');
      return;
    }

    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const res = await fetch(`${apiUrl}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patent_id: patentId, company_name: companyName }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Unknown error');
      }

      const data = await res.json();
      setReport(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-full mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Patent Infringement Checker
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <SearchableDropdown
            label="Patent"
            options={patents}
            value={patentId}
            onChange={setPatentId}
          />
          <SearchableDropdown
            label="Company"
            options={companies}
            value={companyName}
            onChange={setCompanyName}
          />
        </div>

        <Button
          onClick={analyze}
          disabled={loading}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white"
        >
          {loading ? <Loader2 className="animate-spin mr-2" /> : 'Analyze'}
        </Button>

        {error && (
          <p className="mt-4 text-center text-red-600 font-medium">
            Error: {error}
          </p>
        )}

        {report && (
          <div className="mt-8">
            <ReportCard report={report} />
          </div>
        )}
      </div>
    </div>
  );
}
