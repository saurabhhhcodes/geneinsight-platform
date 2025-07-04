"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Code, 
  Key, 
  Zap, 
  Shield, 
  Globe, 
  Book,
  Copy,
  ExternalLink
} from "lucide-react"
import Link from "next/link"

export default function APIPage() {
  const endpoints = [
    {
      method: "POST",
      path: "/api/analysis",
      description: "Submit DNA sequence for analysis",
      params: ["sequence", "type", "options"]
    },
    {
      method: "GET",
      path: "/api/analysis/{id}",
      description: "Get analysis results by ID",
      params: ["id"]
    },
    {
      method: "POST",
      path: "/api/structure",
      description: "Generate 3D protein structure",
      params: ["sequence", "format"]
    },
    {
      method: "GET",
      path: "/api/reports/{id}",
      description: "Download analysis report",
      params: ["id", "format"]
    }
  ]

  const codeExamples = {
    curl: `curl -X POST https://api.geneinsight.com/v1/analysis \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "sequence": "ATCGATCGATCG...",
    "type": "disease_association",
    "options": {
      "include_structure": true,
      "confidence_threshold": 0.8
    }
  }'`,
    
    python: `import requests

api_key = "YOUR_API_KEY"
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

data = {
    "sequence": "ATCGATCGATCG...",
    "type": "disease_association",
    "options": {
        "include_structure": True,
        "confidence_threshold": 0.8
    }
}

response = requests.post(
    "https://api.geneinsight.com/v1/analysis",
    headers=headers,
    json=data
)

result = response.json()
print(f"Analysis ID: {result['id']}")`,

    javascript: `const apiKey = 'YOUR_API_KEY';

const response = await fetch('https://api.geneinsight.com/v1/analysis', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    sequence: 'ATCGATCGATCG...',
    type: 'disease_association',
    options: {
      include_structure: true,
      confidence_threshold: 0.8
    }
  })
});

const result = await response.json();
console.log('Analysis ID:', result.id);`
  }

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "High Performance",
      description: "Process thousands of sequences per minute with our optimized API"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime guarantee"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global CDN",
      description: "Low latency access from anywhere in the world"
    },
    {
      icon: <Book className="h-6 w-6" />,
      title: "Comprehensive Docs",
      description: "Detailed documentation with examples and SDKs"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            GeneInsight API
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Integrate powerful genetic analysis capabilities into your applications 
            with our RESTful API. Process DNA sequences, generate 3D structures, 
            and access AI-powered insights programmatically.
          </p>
          <div className="flex justify-center space-x-4">
            <Badge variant="secondary" className="px-4 py-2">
              <Code className="h-4 w-4 mr-2" />
              RESTful API
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Key className="h-4 w-4 mr-2" />
              API Key Auth
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Zap className="h-4 w-4 mr-2" />
              Real-time Results
            </Badge>
          </div>
        </div>

        {/* Quick Start */}
        <Card className="mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Quick Start</CardTitle>
            <CardDescription>
              Get up and running with the GeneInsight API in minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="font-semibold mb-2">Get API Key</h3>
                <p className="text-sm text-gray-600">
                  Sign up and generate your API key from the dashboard
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="font-semibold mb-2">Make Request</h3>
                <p className="text-sm text-gray-600">
                  Send your DNA sequence to our analysis endpoint
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="font-semibold mb-2">Get Results</h3>
                <p className="text-sm text-gray-600">
                  Receive comprehensive analysis results in JSON format
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  4
                </div>
                <h3 className="font-semibold mb-2">Integrate</h3>
                <p className="text-sm text-gray-600">
                  Use the results in your application or workflow
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">API Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto p-3 bg-blue-100 rounded-full w-fit mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Code Examples */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl">Code Examples</CardTitle>
            <CardDescription>
              See how to integrate GeneInsight API in your preferred language
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="curl" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="curl">cURL</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              </TabsList>
              
              {Object.entries(codeExamples).map(([lang, code]) => (
                <TabsContent key={lang} value={lang}>
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{code}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2"
                      onClick={() => navigator.clipboard.writeText(code)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* API Endpoints */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl">API Endpoints</CardTitle>
            <CardDescription>
              Core endpoints for genetic analysis and data retrieval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {endpoints.map((endpoint, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center space-x-4 mb-2">
                    <Badge 
                      className={
                        endpoint.method === 'GET' ? 'bg-green-100 text-green-800' : 
                        endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }
                    >
                      {endpoint.method}
                    </Badge>
                    <code className="font-mono text-sm">{endpoint.path}</code>
                  </div>
                  <p className="text-gray-700 mb-2">{endpoint.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {endpoint.params.map((param, paramIndex) => (
                      <Badge key={paramIndex} variant="outline" className="text-xs">
                        {param}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rate Limits */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl">Rate Limits & Pricing</CardTitle>
            <CardDescription>
              Understand our usage limits and pricing structure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 border rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Free Tier</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">100</div>
                <p className="text-gray-600 mb-4">requests/month</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Basic analysis</li>
                  <li>• Standard support</li>
                  <li>• Rate: 10 req/min</li>
                </ul>
              </div>
              <div className="text-center p-6 border rounded-lg border-blue-500">
                <h3 className="font-semibold text-lg mb-2">Pro</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">10K</div>
                <p className="text-gray-600 mb-4">requests/month</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Advanced analysis</li>
                  <li>• Priority support</li>
                  <li>• Rate: 100 req/min</li>
                </ul>
              </div>
              <div className="text-center p-6 border rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Enterprise</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">∞</div>
                <p className="text-gray-600 mb-4">unlimited</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Custom analysis</li>
                  <li>• 24/7 support</li>
                  <li>• Custom rate limits</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SDKs and Tools */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl">SDKs & Tools</CardTitle>
            <CardDescription>
              Official SDKs and tools to accelerate your development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col">
                <Code className="h-6 w-6 mb-2" />
                Python SDK
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Code className="h-6 w-6 mb-2" />
                Node.js SDK
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Code className="h-6 w-6 mb-2" />
                R Package
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <ExternalLink className="h-6 w-6 mb-2" />
                Postman Collection
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Building?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Get your API key and start integrating genetic analysis into your applications
          </p>
          <div className="space-x-4">
            <Link href="/login">
              <Button size="lg">
                Get API Key
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="outline" size="lg">
                <Book className="h-4 w-4 mr-2" />
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
