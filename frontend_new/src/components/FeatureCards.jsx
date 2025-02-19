import React from "react";
import { Upload, Clock, Search, Shield, Receipt, ChartBar } from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md">
    <div className="flex flex-col items-center text-center">
      <div className="p-3 bg-indigo-100 rounded-full mb-4">
        <Icon className="h-6 w-6 text-indigo-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

const FeaturesSection = () => {
  const features = [
    {
      icon: Upload,
      title: "Easy Receipt Upload",
      description:
        "Upload receipts instantly with our smart OCR technology that automatically extracts key information",
    },
    {
      icon: Clock,
      title: "Real-Time Tracking",
      description:
        "Monitor expense status and approvals in real-time with our intuitive dashboard",
    },
    {
      icon: Search,
      title: "Smart Search",
      description:
        "Quickly find and filter receipts by date, category, or status",
    },
    {
      icon: Shield,
      title: "Secure Storage",
      description:
        "Keep your expense data safe with our enterprise-grade security",
    },
    {
      icon: Receipt,
      title: "Easy Management",
      description:
        "Organize receipts by categories and manage expenses effortlessly",
    },
    {
      icon: ChartBar,
      title: "Analytics & Reports",
      description:
        "Generate detailed reports and gain insights into expense patterns",
    },
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Streamline Your Expense Reporting
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simplify receipt management and expense tracking with our
            comprehensive solution
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
