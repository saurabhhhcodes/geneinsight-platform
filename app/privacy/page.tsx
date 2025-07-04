"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Eye, Database, Users, FileText } from "lucide-react"

export default function PrivacyPage() {
  const sections = [
    {
      title: "Information We Collect",
      icon: <Database className="h-6 w-6" />,
      content: [
        "Account information (name, email, organization)",
        "Genetic sequence data you upload for analysis",
        "Usage data and analytics to improve our service",
        "Technical information (IP address, browser type, device info)",
        "Communication records when you contact support"
      ]
    },
    {
      title: "How We Use Your Information",
      icon: <Eye className="h-6 w-6" />,
      content: [
        "Provide genetic analysis and research services",
        "Generate reports and visualizations",
        "Improve our algorithms and platform features",
        "Communicate with you about your account and services",
        "Ensure platform security and prevent fraud"
      ]
    },
    {
      title: "Data Security",
      icon: <Lock className="h-6 w-6" />,
      content: [
        "End-to-end encryption for all data transmission",
        "Secure cloud storage with enterprise-grade protection",
        "Regular security audits and penetration testing",
        "Access controls and authentication protocols",
        "Compliance with SOC 2 Type II standards"
      ]
    },
    {
      title: "Data Sharing",
      icon: <Users className="h-6 w-6" />,
      content: [
        "We never sell your genetic data to third parties",
        "Data sharing only with your explicit consent",
        "Anonymized research data may be used for scientific studies",
        "Service providers bound by strict confidentiality agreements",
        "Legal compliance when required by law"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Your privacy and data security are our top priorities. Learn how we collect, 
            use, and protect your information when you use GeneInsight.
          </p>
          <div className="flex justify-center space-x-4">
            <Badge variant="secondary" className="px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              GDPR Compliant
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Lock className="h-4 w-4 mr-2" />
              SOC 2 Certified
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <FileText className="h-4 w-4 mr-2" />
              Last Updated: Jan 2024
            </Badge>
          </div>
        </div>

        {/* Key Principles */}
        <Card className="mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Our Privacy Principles</CardTitle>
            <CardDescription>
              The core values that guide our approach to data privacy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Data Protection</h3>
                <p className="text-sm text-gray-600">
                  Your genetic data is encrypted and protected with the highest security standards
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Transparency</h3>
                <p className="text-sm text-gray-600">
                  Clear information about what data we collect and how we use it
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">User Control</h3>
                <p className="text-sm text-gray-600">
                  You maintain full control over your data and can delete it anytime
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Sections */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {sections.map((section, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {section.icon}
                  </div>
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Your Rights */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl">Your Rights</CardTitle>
            <CardDescription>
              Under GDPR and other privacy laws, you have the following rights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Data Access & Control</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Access your personal data and genetic information</li>
                  <li>• Request corrections to inaccurate data</li>
                  <li>• Download your data in a portable format</li>
                  <li>• Delete your account and all associated data</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Privacy Controls</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Opt out of research participation</li>
                  <li>• Control data sharing preferences</li>
                  <li>• Withdraw consent at any time</li>
                  <li>• File complaints with data protection authorities</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl">Data Retention</CardTitle>
            <CardDescription>
              How long we keep your information and why
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Account Data</h3>
                <p className="text-gray-700">
                  We retain your account information as long as your account is active. 
                  You can delete your account at any time, and we will remove all personal data within 30 days.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Genetic Data</h3>
                <p className="text-gray-700">
                  Your genetic sequence data is stored securely and can be deleted at your request. 
                  We may retain anonymized, aggregated data for research purposes with your consent.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Usage Analytics</h3>
                <p className="text-gray-700">
                  Anonymized usage data may be retained for up to 2 years to improve our services. 
                  This data cannot be linked back to your identity.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl">Contact Our Privacy Team</CardTitle>
            <CardDescription>
              Questions about privacy or want to exercise your rights?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Data Protection Officer</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> privacy@geneinsight.com</p>
                  <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                  <p><strong>Address:</strong> 123 Innovation Drive, Suite 400<br />
                  San Francisco, CA 94105</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Response Times</h3>
                <div className="space-y-2 text-sm">
                  <p>• Privacy inquiries: Within 48 hours</p>
                  <p>• Data access requests: Within 30 days</p>
                  <p>• Data deletion requests: Within 30 days</p>
                  <p>• Urgent security matters: Within 24 hours</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Updates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Policy Updates</CardTitle>
            <CardDescription>
              How we handle changes to this privacy policy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              We may update this privacy policy from time to time to reflect changes in our practices 
              or legal requirements. When we make significant changes, we will:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• Notify you via email at least 30 days before changes take effect</li>
              <li>• Display a prominent notice on our platform</li>
              <li>• Update the "Last Updated" date at the top of this policy</li>
              <li>• Provide a summary of key changes</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Your continued use of GeneInsight after policy updates constitutes acceptance of the new terms.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
