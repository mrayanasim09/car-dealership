import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Award, Shield, Heart, Star, CheckCircle, MapPin, Phone, Mail } from "lucide-react"

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
      description: "Your satisfaction is our priority. We&apos;re here to help you find the perfect vehicle.",
      icon: Heart,
    },
    {
      title: "Expert Team",
      description: "Our experienced team has the knowledge to guide you through every step of your purchase.",
      icon: Users,
    },
  ]

  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-black text-white py-16 md:py-20">
        <div className="absolute inset-0 bg-black opacity-70"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-white">About AM Tycoons Inc</h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-gray-200 max-w-3xl mx-auto">
            Your trusted partner in finding quality pre-owned vehicles since 2009
          </p>
          <Badge className="bg-red-600 text-white px-4 md:px-6 py-2 text-base md:text-lg">15+ Years of Excellence</Badge>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <Card key={index} className="text-center bg-gray-800 border-gray-700">
                  <CardContent className="p-4 md:p-6">
                    <IconComponent className="h-6 w-6 md:h-8 md:w-8 text-red-500 mx-auto mb-3 md:mb-4" />
                    <div className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">{stat.value}</div>
                    <p className="text-sm md:text-base text-gray-300 font-medium">{stat.label}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 md:py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">Our Story</h2>
            <div className="space-y-4 md:space-y-6 text-gray-200 text-base md:text-lg leading-relaxed">
              <p>
                Founded in 2009 by automotive enthusiast AM Tycoons Inc began as a small family business
                with a simple mission: to provide quality pre-owned vehicles with honest, transparent service.
              </p>
              <p>
                What started in a modest lot with just 20 vehicles has grown into one of Los Angeles&apos; most trusted
                used car dealerships, serving thousands of satisfied customers throughout Southern California.
              </p>
              <p>
                Today, we continue to uphold the same values that built our reputation: integrity, quality, and
                putting our customers first. Every vehicle on our lot is carefully selected and thoroughly inspected
                to ensure you&apos;re getting the best value for your investment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 md:py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">Our Values</h2>
            <p className="text-gray-300 max-w-2xl mx-auto font-medium">
              These core principles guide everything we do and ensure every customer has an exceptional experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <Card key={index} className="text-center h-full bg-gray-800 border-gray-700">
                  <CardContent className="p-4 md:p-6">
                    <IconComponent className="h-10 w-10 md:h-12 md:w-12 text-red-500 mx-auto mb-3 md:mb-4" />
                    <h3 className="text-lg md:text-xl font-semibold text-white mb-2 md:mb-3">{value.title}</h3>
                    <p className="text-sm md:text-base text-gray-300">{value.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Location & Contact Section */}
      <section className="py-12 md:py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">Visit Our Showroom</h2>
            <p className="text-gray-300 max-w-2xl mx-auto font-medium">
              Come see us in person and experience the AM Tycoons Inc difference.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
            <Card className="text-center bg-gray-800 border-gray-700">
              <CardContent className="p-4 md:p-6">
                <MapPin className="h-10 w-10 md:h-12 md:w-12 text-red-500 mx-auto mb-3 md:mb-4" />
                <h3 className="text-lg md:text-xl font-semibold text-white mb-2 md:mb-3">Our Location</h3>
                <p className="text-sm md:text-base text-gray-300">
                  12440 Firestone Blvd, Suite 3025D<br />
                  Norwalk, CA 90650
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center bg-gray-800 border-gray-700">
              <CardContent className="p-4 md:p-6">
                <Phone className="h-10 w-10 md:h-12 md:w-12 text-red-500 mx-auto mb-3 md:mb-4" />
                <h3 className="text-lg md:text-xl font-semibold text-white mb-2 md:mb-3">Call Us</h3>
                <div className="space-y-1 text-sm md:text-base text-gray-300">
                  <p>+1 424-303-0386</p>
                  <p>+1 310-350-7709</p>
                  <p>+1 310-972-0341</p>
                  <p>+1 310-904-8377</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="text-center bg-gray-800 border-gray-700">
              <CardContent className="p-4 md:p-6">
                <Mail className="h-10 w-10 md:h-12 md:w-12 text-red-500 mx-auto mb-3 md:mb-4" />
                <h3 className="text-lg md:text-xl font-semibold text-white mb-2 md:mb-3">Email Us</h3>
                <p className="text-sm md:text-base text-gray-300">
                  info@amtycoons.com<br />               
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Ready to Find Your Perfect Car?</h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 text-red-100">
            Browse our inventory or visit our showroom to experience the AM Tycoons Inc difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <a
              href="/listings"
              className="bg-white text-red-600 px-6 md:px-8 py-2 md:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm md:text-base"
            >
              Browse Inventory
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-6 md:px-8 py-2 md:py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors text-sm md:text-base"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
