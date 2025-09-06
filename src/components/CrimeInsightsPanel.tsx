import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Brain, AlertCircle } from 'lucide-react';

// Mock insights data
const mockInsights = {
  bailRisk: {
    score: 78,
    factors: ['Previous violations', 'Flight risk', 'Community ties'],
    recommendation: 'High Risk - Recommend detention'
  },
  crimePatterns: [
    {
      pattern: 'Drug trafficking increase in downtown',
      confidence: 92,
      trend: 'up',
      impact: 'high'
    },
    {
      pattern: 'Cybercrime activity peaks at night',
      confidence: 87,
      trend: 'up',
      impact: 'medium'
    },
    {
      pattern: 'Burglary rates declining in residential areas',
      confidence: 83,
      trend: 'down',
      impact: 'low'
    }
  ],
  similarCases: [
    {
      caseId: '2024-0089',
      similarity: 94,
      type: 'Drug trafficking network',
      outcome: 'Convicted'
    },
    {
      caseId: '2023-0234',
      similarity: 87,
      type: 'Financial fraud scheme',
      outcome: 'Plea bargain'
    }
  ],
  predictions: {
    nextCrimeLocation: 'East District',
    probability: 76,
    timeframe: '24-48 hours',
    crimeType: 'Property theft'
  }
};

export function CrimeInsightsPanel() {
  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? 
      <TrendingUp className="h-4 w-4 text-destructive" /> : 
      <TrendingDown className="h-4 w-4 text-accent" />;
  };

  const getImpactBadgeVariant = (impact: string) => {
    switch (impact) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-destructive';
    if (score >= 40) return 'text-warning';
    return 'text-accent';
  };

  return (
    <Card className="law-enforcement-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Crime Insights
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Bail Risk Assessment */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Bail Risk Assessment</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Risk Score</span>
              <span className={`font-semibold ${getRiskColor(mockInsights.bailRisk.score)}`}>
                {mockInsights.bailRisk.score}%
              </span>
            </div>
            <Progress value={mockInsights.bailRisk.score} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {mockInsights.bailRisk.recommendation}
            </p>
          </div>
        </div>

        {/* Crime Pattern Analysis */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Crime Patterns</h3>
          <div className="space-y-2">
            {mockInsights.crimePatterns.slice(0, 2).map((pattern, index) => (
              <div key={index} className="p-2 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {getTrendIcon(pattern.trend)}
                    <span className="text-xs font-medium">{pattern.confidence}% confidence</span>
                  </div>
                  <Badge variant={getImpactBadgeVariant(pattern.impact)} className="text-xs">
                    {pattern.impact}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{pattern.pattern}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Similar Cases */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Similar Cases</h3>
          <div className="space-y-2">
            {mockInsights.similarCases.map((case_, index) => (
              <div key={index} className="p-2 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">Case {case_.caseId}</span>
                  <span className="text-xs text-accent font-medium">{case_.similarity}% match</span>
                </div>
                <p className="text-xs text-muted-foreground">{case_.type}</p>
                <p className="text-xs text-muted-foreground">Outcome: {case_.outcome}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Predictive Analytics */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-warning" />
            Crime Prediction
          </h3>
          <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Next incident probability</span>
                <span className="font-semibold text-warning">{mockInsights.predictions.probability}%</span>
              </div>
              <p className="text-xs text-muted-foreground">
                <strong>{mockInsights.predictions.crimeType}</strong> predicted in{' '}
                <strong>{mockInsights.predictions.nextCrimeLocation}</strong>
              </p>
              <p className="text-xs text-muted-foreground">
                Timeframe: {mockInsights.predictions.timeframe}
              </p>
            </div>
          </div>
        </div>

        <Button variant="outline" size="sm" className="w-full">
          View Full Analytics Report
        </Button>
      </CardContent>
    </Card>
  );
}