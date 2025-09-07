'use client'

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const GenomicsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Genomics and its Diversifications</h1>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Module I - Genome definition, Genomics and its diversifications</AccordionTrigger>
          <AccordionContent>
            Structural Genomics, Functional Genomics, Pharmacogenomics, Personal Genomics, Genome organization – Differences in prokaryotes, eukaryotes and viruses, Repeat content of the genome, C value paradox; Model Genomes (E.coli, Arabidopsis, C.elegans)
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Module II - Whole Genome Sequencing techniques and annotation</AccordionTrigger>
          <AccordionContent>
            Massively parallel Genome Sequencing Techniques –Second-Generation Sequencing Techniques, Pyrosequencing, Virtual Terminator Sequencing, SOLiD, N-NGS – Nanopore and ZMW De novo Whole Genome Sequencing strategies – De novo sequencing and assembly strategies - Whole Genome Shotgun and Hierarchical Shotgun, Genome finishing – Gaps and their resolution, Human Genome Project - findings and impact, Reference based assembly and alignment algorithms for short reads Genome Annotation – Concepts of Open Reading Frame, in silico annotation approaches – de novo, homology based annotation – common gene finding algorithms and wet lab confirmation methods – mRNA, ESTs
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Module III - Molecular markers and applications</AccordionTrigger>
          <AccordionContent>
            Variations in genomes and Molecular markers – Concepts, assays and Applications – Dominant and codominant markers, RFLP, AFLP, CAPS, SSRs, RAPDs, SNPs, Copy number variations (CNVs), Variations and diseases, Genome Engineering basics
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Module IV - Elucidation of Transcriptomes and Proteomes</AccordionTrigger>
          <AccordionContent>
            Transcriptome analysis - ESTs, SAGE, RNAseq; ENCODE project; Microarray Chips and applications- ChIPSeq, ChIP-chip, Subtractive Hybridization – Concepts and applications Proteomes and Sub- proteomes (structure, function and expression correlations); Expression and Analytical Proteome analysis; Quantitative Proteomics Proteomic technologies -Gel based proteome investigations (1D/ 2D- GE, IEF,DIGE); Sequence based technologies - Mass spectrometry (ESI, MALDI and hybrid); LC/MS-MS; Differential Display proteomics; Protein sequence determination – Edman versus Peptide sequencing and mass fingerprinting; Identification of post-translational modifications; DEEP SEQ MS; Protein de novo sequencing and top down proteomics; Applications of X-Ray and NMR for structure determination; Computational tools for structure
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>Module V - Interaction proteomics and applications of proteomics</AccordionTrigger>
          <AccordionContent>
            Proteomic analysis of protein-protein, protein-DNA interactions - experimental and computational methods (Co-IP, Y2H approaches, Phage display); Proteome interaction maps Structure function relationship - Protein function from structure; Structural proteomics; Proteomics experimental workflows; Protein Engineering Techniques; Basics of Metabolic networks, Protein databases and bioinformatics processing; Experimental design in proteomics Proteomics applications - Pharmacogenomics; Metabolomics, Metaproteomics, Proteogenomics and introduction to systems and synthetic biology; Generating genome scale evolutionary and expression data for simulating futuristic challenges of National interest as envisioned for sustainable development in Viksit Bharat@2047
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default GenomicsPage;