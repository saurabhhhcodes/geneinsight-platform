'use client';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import apiService from '@/app/lib/api';
import { webSocketService } from '@/app/lib/websocket';

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

      // Use simple analysis for now (no authentication required)
      const response = await apiService.analyzeSequenceSimple(sequence);

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        setResults(response.data);
        setStatus('success');
        setProgress(100);
        toast({
          title: 'Analysis Complete',
          description: 'Sequence analysis completed successfully!',
        });
      } else {
        throw new Error('No analysis results received');
      }

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
        <label htmlFor="dna-sequence" className="block text-sm font-medium mb-2">
          DNA Sequence
        </label>
        <textarea
          id="dna-sequence"
          className="w-full p-2 border rounded"
          value={sequence}
          onChange={(e) => setSequence(e.target.value)}
          placeholder="Enter DNA sequence (A, T, G, C)"
          rows={5}
          aria-describedby="sequence-help"
        />
        <p id="sequence-help" className="text-sm text-gray-600 mt-1">
          Enter your DNA sequence using standard nucleotide codes (A, T, G, C).
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
          accept=".fasta,.fa,.txt,.seq"
          aria-describedby="file-help"
        />
        <p id="file-help" className="text-sm text-gray-600 mt-1">
          Supported formats: FASTA, TXT, SEQ
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
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
          <h2 className="font-bold">Results:</h2>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}