'use client';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import apiService from '@/app/lib/api';
import { webSocketService } from '@/app/lib/websocket';
import AnalysisResults from '@/app/components/AnalysisResults';

export default function AnalyzePage() {
  const [sequence, setSequence] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleProgress = (data: any) => {
      setProgress(data.progress);
    };

    const handleResults = (data: any) => {
      setResults(data);
      setStatus('success');
    };

    const handleError = (data: any) => {
      setError(data.message);
      setStatus('error');
      toast({
        title: 'Analysis Error',
        description: data.message,
        variant: 'destructive',
      });
    };

    // Only subscribe to WebSocket if connected
    let progressSubscription: any;
    let resultsSubscription: any;
    let errorSubscription: any;

    if (webSocketService.isConnected()) {
      try {
        progressSubscription = webSocketService.subscribeToAnalysisProgress(handleProgress);
        resultsSubscription = webSocketService.subscribeToAnalysisResult(handleResults);
        errorSubscription = webSocketService.subscribeToAnalysisError(handleError);
      } catch (error) {
        console.warn('WebSocket subscription failed:', error);
      }
    } else {
      console.log('WebSocket not connected, skipping real-time updates');
    }

    return () => {
      if (progressSubscription) progressSubscription.unsubscribe();
      if (resultsSubscription) resultsSubscription.unsubscribe();
      if (errorSubscription) errorSubscription.unsubscribe();
    };
  }, [toast]);

  const handleAnalyze = async () => {
    try {
      setStatus('loading');
      setError(null);
      setProgress(0);

      // Use the correct analysis endpoint with proper error handling
      console.log('Sending sequence for analysis:', sequence.trim());

      const response = await fetch('/api/analysis/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sequence: sequence.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const data = await response.json();
      console.log('Received analysis data:', data);

      setResults(data);
      setStatus('success');
      setProgress(100);
      toast({
        title: 'Analysis Complete',
        description: 'Sequence analysis completed successfully!',
      });

    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Analysis error:', err);
      toast({
        title: 'Analysis Failed',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files;
      if (!files || files.length === 0) return;
      
      setFile(files[0]);
      setStatus('loading');
      setError(null);
      setProgress(0);
      
      const response = await apiService.uploadSequenceFile(files[0], files[0].name);
      
      if (!response?.data?.sequenceId) {
        throw new Error('Invalid response from server');
      }
      
      if (response.error) {
        throw new Error(response.error);
      }
      
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('File upload error:', err);
      toast({
        title: 'Upload Failed',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sequence Analysis</h1>
      
      <div className="mb-4">
        <label htmlFor="sequence-input" className="block text-sm font-medium mb-2">
          Biological Sequence
        </label>
        <textarea
          id="sequence-input"
          className="w-full p-2 border rounded"
          value={sequence}
          onChange={(e) => setSequence(e.target.value)}
          placeholder="Enter DNA (A,T,G,C), RNA (A,U,G,C), or Protein (amino acids) sequence"
          rows={5}
          aria-describedby="sequence-help"
        />
        <p id="sequence-help" className="text-sm text-gray-600 mt-1">
          <strong>Supported sequence types:</strong><br/>
          • <strong>DNA:</strong> A, T, G, C nucleotides<br/>
          • <strong>RNA:</strong> A, U, G, C nucleotides<br/>
          • <strong>Protein:</strong> 20 standard amino acids (single letter codes)
        </p>
      </div>

      <div className="mb-4">
        <label htmlFor="sequence-file" className="block text-sm font-medium mb-2">
          Or upload a sequence file
        </label>
        <input
          id="sequence-file"
          type="file"
          onChange={handleFileUpload}
          accept=".fasta,.fa,.txt,.seq,.pdb"
          aria-describedby="file-help"
        />
        <p id="file-help" className="text-sm text-gray-600 mt-1">
          <strong>Supported formats:</strong> FASTA (.fasta, .fa), Plain text (.txt), Sequence (.seq), PDB (.pdb)<br/>
          <strong>Content:</strong> DNA, RNA, or Protein sequences
        </p>
      </div>
      
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={handleAnalyze}
        disabled={status === 'loading' || !sequence}
      >
        {status === 'loading' ? 'Analyzing...' : 'Analyze'}
      </button>
      
      {status === 'loading' && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm mt-1">{progress}% complete</p>
        </div>
      )}
      
      {status === 'error' && error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}
      
      {status === 'success' && results && (
        <AnalysisResults results={results} />
      )}
    </div>
  );
}