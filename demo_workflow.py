#!/usr/bin/env python3
"""
GeneInsight Platform Demo Workflow
Demonstrates the complete gene analysis workflow
"""

import requests
import json
import time

def demo_gene_analysis():
    """Demonstrate a complete gene analysis workflow"""
    print("🧬 GeneInsight Platform Demo")
    print("=" * 50)

    # Sample DNA sequence for analysis
    sample_sequence = "ATGCGATCGTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAG"

    print(f"📝 Sample DNA Sequence: {sample_sequence}")
    print(f"   Length: {len(sample_sequence)} base pairs")

    # Calculate basic features
    gc_content = (sample_sequence.count('G') + sample_sequence.count('C')) / len(sample_sequence) * 100
    print(f"   GC Content: {gc_content:.1f}%")

    # Simulate ORF detection (simplified)
    orf_count = sample_sequence.count('ATG')  # Start codons
    print(f"   Potential ORFs: {orf_count}")

    # Simulate motif detection
    motifs = []
    if 'TATA' in sample_sequence:
        motifs.append('TATA')
    if 'ATG' in sample_sequence:
        motifs.append('ATG')
    if 'TAG' in sample_sequence:
        motifs.append('TAG')

    print(f"   Detected Motifs: {motifs}")

    print("\n🤖 Sending to ML Service for Disease Prediction...")

    # Prepare data for ML service
    ml_data = {
        "features": {
            "gcContent": gc_content,
            "orfCount": orf_count,
            "length": len(sample_sequence),
            "motifs": motifs
        }
    }

    try:
        # Call ML service
        response = requests.post("http://localhost:5000/predict", json=ml_data)

        if response.status_code == 200:
            result = response.json()

            print("✅ ML Analysis Complete!")
            print(f"   Prediction: {result['prediction']}")
            print(f"   Confidence: {result['confidence']:.3f}")
            print(f"   Model: {result['modelVersion']}")

            print("\n📊 Feature Importance:")
            for feature, importance in result['featureImportance'].items():
                print(f"   {feature}: {importance:.3f}")

            # Simulate saving to backend
            print("\n💾 Saving Results to Database...")

            # This would normally go through the backend API
            # For demo purposes, we'll just show what would be saved
            analysis_record = {
                "sequenceName": "Demo Sequence",
                "sequenceData": sample_sequence,
                "sequenceLength": len(sample_sequence),
                "gcContent": gc_content,
                "orfCount": orf_count,
                "motifsDetected": motifs,
                "prediction": result['prediction'],
                "confidence": result['confidence'],
                "modelVersion": result['modelVersion'],
                "processingTime": result['processingTime']
            }

            print("✅ Analysis record prepared:")
            print(json.dumps(analysis_record, indent=2))

            return True

        else:
            print(f"❌ ML Service error: {response.status_code}")
            return False

    except Exception as e:
        print(f"❌ Error calling ML service: {e}")
        return False

def demo_batch_analysis():
    """Demonstrate batch analysis of multiple sequences"""
    print("\n🔄 Batch Analysis Demo")
    print("=" * 30)

    # Sample sequences for batch processing
    sequences = [
        ("BRCA1_sample", "ATGCGATCGTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAG"),
        ("TP53_sample", "GCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTA"),
        ("CFTR_sample", "CGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGAT"),
    ]

    results = []

    for name, sequence in sequences:
        print(f"\n📝 Analyzing {name}...")

        # Calculate features
        gc_content = (sequence.count('G') + sequence.count('C')) / len(sequence) * 100
        orf_count = sequence.count('ATG')
        motifs = ['ATG'] if 'ATG' in sequence else []

        # Call ML service
        ml_data = {
            "features": {
                "gcContent": gc_content,
                "orfCount": orf_count,
                "length": len(sequence),
                "motifs": motifs
            }
        }

        try:
            response = requests.post("http://localhost:5000/predict", json=ml_data)
            if response.status_code == 200:
                result = response.json()
                results.append({
                    "name": name,
                    "prediction": result['prediction'],
                    "confidence": result['confidence']
                })
                print(f"   ✅ {result['prediction']} (confidence: {result['confidence']:.3f})")
            else:
                print(f"   ❌ Analysis failed")

        except Exception as e:
            print(f"   ❌ Error: {e}")

    # Summary
    print("\n📊 Batch Analysis Summary:")
    print("-" * 40)
    for result in results:
        status = "🔴" if result['prediction'] == 'DISEASE_ASSOCIATED' else "🟢"
        print(f"{status} {result['name']}: {result['prediction']} ({result['confidence']:.3f})")

    return len(results) > 0

def main():
    """Run the complete demo"""
    print("🚀 Starting GeneInsight Platform Demo")
    print("This demo shows the complete gene analysis workflow\n")

    # Check if services are running
    try:
        ml_health = requests.get("http://localhost:5000/health")
        backend_health = requests.get("http://localhost:8080/api/health")

        if ml_health.status_code != 200 or backend_health.status_code != 200:
            print("❌ Services not running. Please start all services first.")
            return False

    except Exception as e:
        print(f"❌ Cannot connect to services: {e}")
        return False

    # Run demos
    success1 = demo_gene_analysis()
    success2 = demo_batch_analysis()

    if success1 and success2:
        print("\n🎉 Demo completed successfully!")
        print("\n🔗 Next Steps:")
        print("   • Visit http://localhost:3000 to use the web interface")
        print("   • Try the analysis page at http://localhost:3000/analyze")
        print("   • View the dashboard at http://localhost:3000/dashboard")
        print("   • Check the H2 database at http://localhost:8080/h2-console")
        return True
    else:
        print("\n⚠️  Demo completed with some errors")
        return False

if __name__ == "__main__":
    main()