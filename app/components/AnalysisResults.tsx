'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface AnalysisResultsProps {
  results: any
}

export default function AnalysisResults({ results }: AnalysisResultsProps) {
  // Remove the console.log to prevent infinite re-rendering
  // console.log('AnalysisResults received:', results);

  if (!results) {
    return (
      <div className="mt-6 p-4 bg-yellow-100 text-yellow-800 rounded">
        <p>No analysis results available.</p>
      </div>
    )
  }

  // Handle both direct analysis data and wrapped basicAnalysis structure
  const analysis = results.basicAnalysis || results.data || results

  if (!analysis) {
    return (
      <div className="mt-6 p-4 bg-yellow-100 text-yellow-800 rounded">
        <p>Analysis data is not available. Please try running the analysis again.</p>
        <details className="mt-2">
          <summary className="cursor-pointer text-sm">Debug Info</summary>
          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(results, null, 2)}
          </pre>
        </details>
      </div>
    )
  }

  const sequenceType = analysis.sequenceType || 'DNA'

  // Get appropriate icon for sequence type
  const getSequenceIcon = (type: string) => {
    switch (type) {
      case 'RNA': return '🧬'
      case 'PROTEIN': return '🧪'
      default: return '🧬'
    }
  }

  // Get risk level color
  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'moderate': case 'low-moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  return (
    <div className="mt-8 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="text-2xl">{getSequenceIcon(sequenceType)}</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
              <p className="text-sm text-gray-600 font-normal">
                {sequenceType} Sequence Analysis • {analysis.length} nucleotides/residues
              </p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {analysis.length || analysis.sequence?.length || 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Length (bp/aa)</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {analysis.gcContent?.toFixed(1) || analysis.gcPercentage?.toFixed(1) || 'N/A'}%
              </div>
              <div className="text-sm text-gray-600">
                {sequenceType === 'RNA' ? 'GC Content' : sequenceType === 'PROTEIN' ? 'Hydrophobic' : 'GC Content'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {analysis.analysis?.confidence ? `${(analysis.analysis.confidence * 100).toFixed(0)}%` :
                 analysis.confidence ? `${(analysis.confidence * 100).toFixed(0)}%` : '85%'}
              </div>
              <div className="text-sm text-gray-600">Confidence</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {analysis.atContent?.toFixed(1) || 'N/A'}%
              </div>
              <div className="text-sm text-gray-600">AT Content</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sequence Display */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📄 Sequence Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="font-mono text-sm break-all leading-relaxed">
              {analysis.sequence || 'No sequence data available'}
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Analysis ID: {analysis.id} • Generated: {new Date(analysis.timestamp).toLocaleString()}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detected Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🔍 Detected Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysis.detectedGenes?.map((gene: string, index: number) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm font-medium text-gray-800">{gene}</span>
                </div>
              )) || (
                <div className="text-gray-500 text-sm">No specific features detected</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">⚠️ Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Overall Risk:</span>
                <Badge className={getRiskColor(analysis.riskLevel)}>
                  {analysis.riskLevel || 'Unknown'}
                </Badge>
              </div>
              
              {analysis.predictions && (
                <>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">Disease Risk:</span>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        {analysis.predictions.diseaseRisk || 0}%
                      </div>
                      <Progress 
                        value={analysis.predictions.diseaseRisk || 0} 
                        className="w-20 h-2 mt-1"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">Pathogenicity:</span>
                    <span className="font-medium text-gray-900">
                      {analysis.predictions.pathogenicity || 'Unknown'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">Functional Impact:</span>
                    <span className="font-medium text-gray-900">
                      {analysis.predictions.functionalImpact || 'Unknown'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Nucleotide/Amino Acid Composition */}
      {analysis.composition && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🧪 Sequence Composition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(analysis.composition).map(([nucleotide, count]) => (
                <div key={nucleotide} className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">
                    {count}
                  </div>
                  <div className="text-sm text-gray-600">
                    {nucleotide} ({((count as number / analysis.length) * 100).toFixed(1)}%)
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Open Reading Frames (ORFs) */}
      {analysis.orfs && analysis.orfs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🔬 Open Reading Frames (ORFs)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysis.orfs.slice(0, 5).map((orf: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <span className="font-medium text-blue-800">ORF {index + 1}</span>
                    <div className="text-sm text-gray-600">
                      Position: {orf.start} - {orf.end} | Length: {orf.length} bp
                    </div>
                  </div>
                  <div className="text-sm text-blue-600 font-medium">
                    Frame: {orf.frame}
                  </div>
                </div>
              ))}
              {analysis.orfs.length > 5 && (
                <div className="text-sm text-gray-500 text-center">
                  ... and {analysis.orfs.length - 5} more ORFs
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Motifs */}
      {analysis.motifs && analysis.motifs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🎯 Detected Motifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysis.motifs.slice(0, 5).map((motif: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <span className="font-medium text-green-800">{motif.name}</span>
                    <div className="text-sm text-gray-600">
                      Pattern: {motif.pattern} | Position: {motif.position}
                    </div>
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    Score: {motif.score?.toFixed(2) || 'N/A'}
                  </div>
                </div>
              ))}
              {analysis.motifs.length > 5 && (
                <div className="text-sm text-gray-500 text-center">
                  ... and {analysis.motifs.length - 5} more motifs
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quality Metrics */}
      {analysis.qualityMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📊 Quality Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <div className="text-lg font-bold text-blue-800">
                  {analysis.qualityMetrics.sequenceQuality}
                </div>
                <div className="text-sm text-blue-600">Sequence Quality</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <div className="text-lg font-bold text-green-800">
                  {analysis.qualityMetrics.completeness}
                </div>
                <div className="text-sm text-green-600">Completeness</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <div className="text-lg font-bold text-purple-800">
                  {analysis.qualityMetrics.complexity}
                </div>
                <div className="text-sm text-purple-600">Complexity</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Metrics for Different Sequence Types */}
      {sequenceType === 'RNA' && analysis.rnaType && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🧬 RNA-Specific Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-medium text-gray-700 mb-2">RNA Type:</div>
                <div className="space-y-1">
                  {analysis.rnaType.map((type: string, index: number) => (
                    <Badge key={index} variant="outline" className="mr-2">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-700 mb-2">Stability:</div>
                <Badge className={
                  analysis.stability === 'High' ? 'bg-green-100 text-green-800' :
                  analysis.stability === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }>
                  {analysis.stability}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {sequenceType === 'PROTEIN' && analysis.proteinType && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🧪 Protein-Specific Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="font-medium text-gray-700 mb-2">Protein Classification:</div>
                <div className="space-y-1">
                  {analysis.proteinType.map((type: string, index: number) => (
                    <Badge key={index} variant="outline" className="mr-2">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {analysis.hydrophobicPercent !== undefined && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-600">Hydrophobic Content</div>
                    <div className="text-lg font-bold text-blue-800">
                      {analysis.hydrophobicPercent.toFixed(1)}%
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-600">Charged Residues</div>
                    <div className="text-lg font-bold text-green-800">
                      {analysis.chargedPercent?.toFixed(1) || 0}%
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Raw Data (Collapsible) */}
      <Card>
        <CardContent className="p-0">
          <details className="group">
            <summary className="px-6 py-4 bg-gray-50 cursor-pointer text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
              📋 View Raw Analysis Data
            </summary>
            <div className="p-6 border-t">
              <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          </details>
        </CardContent>
      </Card>
    </div>
  )
}
