import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tool, data } = body;

    let resultData;

    if (tool === 'ramachandran-plot') {
      // Generate mock data for the Ramachandran plot
      const phi = Array.from({ length: 100 }, () => Math.random() * 360 - 180);
      const psi = Array.from({ length: 100 }, () => Math.random() * 360 - 180);
      resultData = { phi, psi };
    } else if (tool === 'swiss-prot') {
      const proteinId = data.proteinId;
      const response = await fetch(`https://www.uniprot.org/uniprot/${proteinId}.json`);
      if (response.ok) {
        resultData = await response.json();
      } else {
        resultData = { error: 'Failed to fetch protein data' };
      }
    } else if (tool === 'de-novo-assembly') {
      resultData = { message: 'De novo assembly started successfully.' };
    } else if (tool === 'orf-finder') {
      resultData = { message: 'ORF finding process initiated.' };
    } else if (tool === 'variation-analysis') {
      resultData = { message: 'Variation analysis started successfully.' };
    } else if (tool === 'peptide-analysis') {
      resultData = { message: 'Peptide analysis started successfully.' };
    } else if (tool === 'gene-expression') {
      resultData = { message: 'Gene expression analysis started successfully.' };
    } else {
      // Placeholder for other tools
      resultData = `Analysis results for ${tool} with data: ${JSON.stringify(data)}`;
    }

    const result = {
      tool,
      status: 'success',
      data: resultData,
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred during analysis' }, { status: 500 });
  }
}