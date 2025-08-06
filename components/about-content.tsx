import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CloudinaryImage } from "@/components/cloudinary-image"
import { Users, Award, Shield, Heart, Star, CheckCircle } from "lucide-react"

export function AboutContent() {
  const stats = [
    { label: "Years in Business", value: "15+", icon: Award },
    { label: "Cars Sold", value: "5,000+", icon: Star },
    { label: "Happy Customers", value: "4,800+", icon: Heart },
    { label: "Team Members", value: "25+", icon: Users },
  ]

  const values = [
    {
      title: "Quality Assurance",
      description: "Every vehicle undergoes a comprehensive 150-point inspection before being offered for sale.",
      icon: Shield,
    },
    {
      title: "Transparent Pricing",
      description: "No hidden fees, no surprises. Our prices are competitive and clearly displayed.",
      icon: CheckCircle,
    },
    {
      title: "Customer First",
      description: "Your satisfaction is our priority. We're here to help you find the perfect vehicle.",
      icon: Heart,
    },
    {
      title: "Expert Team",
      description: "Our experienced team has the knowledge to guide you through every step of your purchase.",
      icon: Users,
    },
  ]

  const team = [
    {
      name: "Michael Rodriguez",
      position: "General Manager",
      image: "samples/people/boy-snow-hoodie",
      description: "15+ years in automotive sales with a passion for customer service.",
    },
    {
      name: "Sarah Johnson",
      position: "Sales Director",
      image: "samples/people/smiling-man",
      description: "Expert in matching customers with their perfect vehicle.",
    },
    {
      name: "David Chen",
      position: "Finance Manager",
      image: "samples/people/kitchen-bar",
      description: "Specializes in finding the best financing options for our customers.",
    },
    {
      name: "Lisa Thompson",
      position: "Service Advisor",
      image: "samples/people/jazz",
      description: "Ensures every vehicle meets our high-quality standards.",
    },
  ]

  return (
    <div className="py-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-gray-700 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About AM Tycoons Inc</h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
            Your trusted partner in finding quality pre-owned vehicles since 2009
          </p>
          <Badge className="bg-red-600 text-white px-6 py-2 text-lg">15+ Years of Excellence</Badge>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <IconComponent className="h-8 w-8 text-red-600 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <p className="text-gray-600">{stat.label}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Founded in 2009 by automotive enthusiast Alex Martinez, AM Tycoons Inc began as a small family business
                  with a simple mission: to provide quality pre-owned vehicles with honest, transparent service.
                </p>
                <p>
                  What started in a modest lot with just 20 vehicles has grown into one of Los Angeles' most trusted
                  used car dealerships, serving thousands of satisfied customers throughout Southern California.
                </p>
                <p>
                  Today, we continue to uphold the same values that built our reputation: integrity, quality, and
                  putting our customers first. Every vehicle on our lot is carefully selected and thoroughly inspected
                  to ensure you're getting the best value for your investment.
                </p>
              </div>
            </div>
            <div className="relative">
              <CloudinaryImage
                src="samples/landscapes/beach-boat"
                alt="AM Tycoons Inc Showroom"
                width={600}
                height={400}
                className="rounded-lg shadow-lg w-full"
                crop={{ type: "fill", source: true }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do and ensure every customer has an exceptional experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <Card key={index} className="text-center h-full">
                  <CardContent className="p-6">
                    <IconComponent className="h-12 w-12 text-red-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our experienced professionals are here to help you find the perfect vehicle and ensure a smooth buying
              experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <CloudinaryImage
                    src={member.image}
                    alt={member.name}
                    width={150}
                    height={150}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    crop={{ type: "fill", source: true }}
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-red-600 font-medium mb-3">{member.position}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Car?</h2>
          <p className="text-xl mb-8 text-red-100">
            Browse our inventory or visit our showroom to experience the AM Tycoons Inc difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/listings"
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Inventory
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
