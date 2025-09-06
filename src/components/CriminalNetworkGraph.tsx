import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';

// Mock network data
const mockNetworkData = {
  nodes: [
    { id: 'CR001', label: 'Marcus Rodriguez', type: 'high-risk', connections: 12, charge: 'Drug Trafficking' },
    { id: 'CR002', label: 'Jennifer Walsh', type: 'medium-risk', connections: 8, charge: 'Financial Fraud' },
    { id: 'CR003', label: 'David Kumar', type: 'high-risk', connections: 15, charge: 'Cybercrime' },
    { id: 'CR004', label: 'Maria Santos', type: 'low-risk', connections: 5, charge: 'Identity Theft' },
    { id: 'CR005', label: 'Tony Chen', type: 'medium-risk', connections: 7, charge: 'Money Laundering' },
    { id: 'CR006', label: 'Sarah Wilson', type: 'low-risk', connections: 3, charge: 'Credit Card Fraud' },
  ],
  edges: [
    { from: 'CR001', to: 'CR002', relationship: 'associate' },
    { from: 'CR001', to: 'CR005', relationship: 'business' },
    { from: 'CR002', to: 'CR003', relationship: 'contact' },
    { from: 'CR003', to: 'CR005', relationship: 'partner' },
    { from: 'CR004', to: 'CR006', relationship: 'mentor' },
    { from: 'CR005', to: 'CR006', relationship: 'contact' },
  ]
};

export function CriminalNetworkGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Draw network visualization
    drawNetwork(ctx, canvas.offsetWidth, canvas.offsetHeight);
  }, []);

  const drawNetwork = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    // Position nodes in a circle layout
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    const positions = mockNetworkData.nodes.map((node, index) => {
      const angle = (index / mockNetworkData.nodes.length) * 2 * Math.PI;
      return {
        ...node,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      };
    });

    // Draw edges
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 2;
    mockNetworkData.edges.forEach(edge => {
      const fromNode = positions.find(n => n.id === edge.from);
      const toNode = positions.find(n => n.id === edge.to);
      if (fromNode && toNode) {
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();
      }
    });

    // Draw nodes
    positions.forEach(node => {
      // Node color based on risk level
      let nodeColor = '#22c55e'; // green for low-risk
      if (node.type === 'medium-risk') nodeColor = '#f59e0b'; // yellow
      if (node.type === 'high-risk') nodeColor = '#ef4444'; // red

      // Node size based on connections
      const nodeSize = 8 + (node.connections * 2);

      // Draw node circle
      ctx.fillStyle = nodeColor;
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI);
      ctx.fill();

      // Draw node border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw node label
      ctx.fillStyle = '#1f2937';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + nodeSize + 15);
    });
  };

  return (
    <Card className="law-enforcement-card h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Criminal Network Analysis</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="relative h-[400px] w-full">
          <canvas
            ref={canvasRef}
            className="w-full h-full border border-border rounded-lg bg-muted/10"
            style={{ display: 'block' }}
          />
          
          {/* Legend */}
          <div className="absolute top-4 right-4 bg-card border border-border rounded-lg p-3 space-y-2">
            <h4 className="font-medium text-sm">Risk Levels</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>High Risk</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Medium Risk</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Low Risk</span>
              </div>
            </div>
          </div>

          {/* Node info tooltip */}
          {selectedNode && (
            <div className="absolute bottom-4 left-4 bg-card border border-border rounded-lg p-3 min-w-[200px]">
              <h4 className="font-medium">{selectedNode.label}</h4>
              <p className="text-sm text-muted-foreground">{selectedNode.charge}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedNode.connections} known associates
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}