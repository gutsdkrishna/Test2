import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown } from "lucide-react";
import { mockPremiumFeatures } from "@/lib/mock-data";

export default function Premium() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="text-center mb-12">
        <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold">Upgrade to Premium</h1>
        <p className="text-muted-foreground mt-2">
          Unlock advanced AI optimization features
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {mockPremiumFeatures.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button size="lg" className="w-full max-w-md">
          Upgrade Now
        </Button>
      </div>
    </div>
  );
}
