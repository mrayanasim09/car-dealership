import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'AM Tycoons Inc. Privacy Policy - Learn how we collect, use, and protect your personal information.',
}

export default function PrivacyPolicyPage() {
  const lastUpdated = 'December 15, 2024'
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>1. Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              AM Tycoons Inc. (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you visit our website, use our services, or interact with us.
            </p>
            <p>
              By using our services, you consent to the data practices described in this policy. 
              If you do not agree with our policies and practices, please do not use our services.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>2. Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">2.1 Personal Information</h3>
              <p>We may collect the following personal information:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>Name and contact information (email, phone number)</li>
                <li>Vehicle preferences and requirements</li>
                <li>Communication history and preferences</li>
                <li>Account credentials (for admin users)</li>
                <li>Device and usage information</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2.2 Automatically Collected Information</h3>
              <p>We automatically collect certain information when you visit our website:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>IP address and location data</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages visited and time spent</li>
                <li>Referring website</li>
                <li>Device identifiers</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2.3 Cookies and Tracking Technologies</h3>
              <p>
                We use cookies and similar technologies to enhance your experience, analyze usage, 
                and provide personalized content. You can control cookie settings through your browser.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>3. How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We use the collected information for the following purposes:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Provide and maintain our services</li>
              <li>Process your inquiries and requests</li>
              <li>Send you relevant information about vehicles and services</li>
              <li>Improve our website and user experience</li>
              <li>Ensure security and prevent fraud</li>
              <li>Comply with legal obligations</li>
              <li>Send administrative information and updates</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>4. Data Retention Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">4.1 Retention Periods</h3>
              <p>We retain your personal information for the following periods:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li><strong>Contact Form Submissions:</strong> 3 years from last interaction</li>
                <li><strong>Website Analytics Data:</strong> 26 months</li>
                <li><strong>Admin User Accounts:</strong> Until account deletion or 2 years of inactivity</li>
                <li><strong>Cookies and Session Data:</strong> As specified in our cookie policy</li>
                <li><strong>Backup Data:</strong> 90 days</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">4.2 Data Deletion</h3>
              <p>
                You may request deletion of your personal information at any time. We will process 
                deletion requests within 30 days and confirm completion. Some information may be 
                retained for legal or legitimate business purposes.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">4.3 Data Anonymization</h3>
              <p>
                After the retention period expires, we may anonymize your data for analytical 
                purposes, ensuring it cannot be linked back to you.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>5. Data Sharing and Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Service Providers:</strong> With trusted third-party service providers who assist in operating our website and services</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>6. Your Rights and Choices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Under applicable data protection laws, you have the following rights:</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Rectification:</strong> Correct inaccurate or incomplete information</li>
              <li><strong>Erasure:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Objection:</strong> Object to processing of your personal information</li>
              <li><strong>Restriction:</strong> Limit how we process your information</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for processing</li>
            </ul>
            
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm">
                <strong>To exercise these rights:</strong> Contact us at{' '}
                <a href="mailto:privacy@amtycoonsinc.com" className="text-primary hover:underline">
                  privacy@amtycoonsinc.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>7. Data Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We implement appropriate technical and organizational measures to protect your personal information:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication measures</li>
              <li>Employee training on data protection</li>
              <li>Incident response procedures</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>8. International Data Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Your personal information may be transferred to and processed in countries other than 
              your own. We ensure appropriate safeguards are in place for such transfers in 
              accordance with applicable data protection laws.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>9. Children&apos;s Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Our services are not intended for children under 16 years of age. We do not knowingly 
              collect personal information from children under 16. If you believe we have collected 
              such information, please contact us immediately.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>10. Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any 
              material changes by posting the new policy on this page and updating the &ldquo;Last updated&rdquo; 
              date. Your continued use of our services after such changes constitutes acceptance of 
              the updated policy.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>11. Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>If you have questions about this Privacy Policy or our data practices, please contact us:</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Data Protection Officer</h4>
                <p className="text-sm">
                  Email: <a href="mailto:dpo@amtycoonsinc.com" className="text-primary hover:underline">dpo@amtycoonsinc.com</a><br />
                  Phone: <a href="tel:+1234567890" className="text-primary hover:underline">+1 (234) 567-890</a>
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">General Privacy Inquiries</h4>
                <p className="text-sm">
                  Email: <a href="mailto:privacy@amtycoonsinc.com" className="text-primary hover:underline">privacy@amtycoonsinc.com</a><br />
                  Address: 123 Main Street, City, State 12345
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm">
                <strong>EU Residents:</strong> You have the right to lodge a complaint with your 
                local data protection authority if you believe we have not addressed your concerns adequately.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            This Privacy Policy is effective as of {lastUpdated} and supersedes all previous versions.
          </p>
        </div>
      </div>
    </div>
  )
}


