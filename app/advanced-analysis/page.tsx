'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const RamachandranPlot = dynamic(() => import('@/app/components/RamachandranPlot'), {
  ssr: false,
  loading: () => <p>Loading plot...</p>
});

const AdvancedAnalysisPage = () => {
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalysis = async (tool: string, data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/advanced-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tool, data }),
      });
      const result = await response.json();
      setResults(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Advanced Genomics & Proteomics Analysis</h1>
      <p className="text-gray-600 mb-8">A suite of powerful tools for in-depth biological sequence analysis.</p>

      <Tabs defaultValue="module2" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="module2">Genome Sequencing & Annotation</TabsTrigger>
          <TabsTrigger value="module3">Molecular Markers</TabsTrigger>
          <TabsTrigger value="module4">Transcriptomes & Proteomes</TabsTrigger>
        </TabsList>

        <TabsContent value="module2" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Whole Genome Sequencing & Annotation</CardTitle>
              <CardDescription>Tools for analyzing sequencing data and annotating genomes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Genome Assembly</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="assembly-input">Sequencing Reads (FASTA/FASTQ)</Label>
                      <Textarea id="assembly-input" placeholder="Paste your sequencing reads here..." className="min-h-[150px] font-mono" />
                    </div>
                    <Button onClick={() => handleAnalysis('de-novo-assembly', {})}>Start De novo Assembly</Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Genome Annotation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="annotation-input">Assembled Genome (FASTA)</Label>
                      <Textarea id="annotation-input" placeholder="Paste your assembled genome sequence here..." className="min-h-[150px] font-mono" />
                    </div>
                    <Button onClick={() => handleAnalysis('orf-finder', {})}>Find Open Reading Frames (ORFs)</Button>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="module3" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Molecular Markers & Applications</CardTitle>
              <CardDescription>Identify and analyze genetic markers like SNPs and CNVs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <Card>
                <CardHeader>
                  <CardTitle className="text-lg">SNP & CNV Detection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="snp-input">Genomic Data (VCF/BAM)</Label>
                      <Input id="snp-input" type="file" />
                    </div>
                    <Button onClick={() => handleAnalysis('variation-analysis', {})}>Analyze Variations</Button>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="module4" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Transcriptome & Proteome Elucidation</CardTitle>
              <CardDescription>Analyze gene expression and protein data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="proteomics" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="proteomics">Proteomics</TabsTrigger>
                  <TabsTrigger value="transcriptomics">Transcriptomics</TabsTrigger>
                  <TabsTrigger value="structure">Structure Analysis</TabsTrigger>
                </TabsList>
                <TabsContent value="proteomics" className="mt-4">
                  <Card>
                    <CardHeader><CardTitle className="text-lg">Swiss-Prot Analysis</CardTitle></CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="protein-id">Protein ID (e.g., P05067)</Label>
                          <Input id="protein-id" placeholder="Enter a UniProtKB accession number" />
                        </div>
                        <Button onClick={() => {
                          const proteinId = (document.getElementById('protein-id') as HTMLInputElement).value;
                          handleAnalysis('swiss-prot', { proteinId });
                        }}>Fetch Protein Data</Button>
                        {results?.tool === 'swiss-prot' && (
                          <pre>{JSON.stringify(results.data, null, 2)}</pre>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="transcriptomics" className="mt-4">
                   <Card>
                    <CardHeader><CardTitle className="text-lg">RNA-Seq Analysis</CardTitle></CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="rnaseq-data">RNA-Seq Reads (FASTQ)</Label>
                          <Input id="rnaseq-data" type="file" />
                        </div>
                        <Button onClick={() => handleAnalysis('gene-expression', {})}>Analyze Gene Expression</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                 <TabsContent value="structure" className="mt-4">
                   <Card>
                    <CardHeader><CardTitle className="text-lg">Protein Structure Analysis</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                       <div>
                          <Label htmlFor="pdb-input">Protein Structure (PDB)</Label>
                          <Input id="pdb-input" type="file" />
                        </div>
                      <Button onClick={() => handleAnalysis('ramachandran-plot', {})}>Generate Ramachandran Plot</Button>
                      {results?.tool === 'ramachandran-plot' && (
                        <RamachandranPlot data={results.data} />
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isLoading && <p>Loading...</p>}
      {results && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <pre>{JSON.stringify(results, null, 2)}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedAnalysisPage;