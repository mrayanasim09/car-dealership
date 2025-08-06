import { Shield, Award, Clock, Users, Car, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const trustFeatures = [
  {
    icon: Shield,
    title: "Quality Guarantee",
    description: "Every vehicle undergoes a comprehensive 150-point inspection"
  },
  {
    icon: Award,
    title: "Best Price Promise",
    description: "We guarantee competitive pricing with no hidden fees"
  },
  {
    icon: Clock,
    title: "Quick Process",
    description: "Complete your purchase in as little as 30 minutes"
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "Certified mechanics and automotive professionals"
  },
  {
    icon: Car,
    title: "Wide Selection",
    description: "Hundreds of quality pre-owned vehicles in stock"
  },
  {
    icon: CheckCircle,
    title: "Warranty Coverage",
    description: "All vehicles come with comprehensive warranty protection"
  }
]

export function TrustBadges() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose AM Tycoons Inc.?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We're committed to providing the best car buying experience with transparency, quality, and customer satisfaction at the core of everything we do.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustFeatures.map((feature, index) => (
            <Card key={index} className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-8 bg-gray-50 dark:bg-gray-800 rounded-lg px-8 py-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">BBB Accredited</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Certified Dealer</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-red-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quality Assured</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

