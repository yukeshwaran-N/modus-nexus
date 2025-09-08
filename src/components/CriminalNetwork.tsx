// src/components/CriminalNetwork.tsx
import { useState, useEffect, useRef } from 'react';
import { Link, ArrowRight, Filter, Search, Users, Target, Network, ZoomIn, ZoomOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import * as d3 from 'd3';

interface CriminalNode {
  id: string;
  name: string;
  crime_type: string;
  value: number;
  group: string;
}

interface CriminalLink {
  source: string;
  target: string;
  value: number;
  type: string;
}

// Add these interface extensions for D3
interface SimulationNode extends CriminalNode, d3.SimulationNodeDatum {
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

// Create a separate interface for simulation links
interface SimulationLink {
  source: SimulationNode;
  target: SimulationNode;
  value: number;
  type: string;
}

export function CriminalNetwork() {
  const [networkData, setNetworkData] = useState<{ nodes: CriminalNode[], links: CriminalLink[] }>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState<CriminalNode | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<SimulationNode, SimulationLink> | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  useEffect(() => {
    fetchNetworkData();
  }, [filter]);

  useEffect(() => {
    if (networkData.nodes.length > 0 && svgRef.current) {
      renderNetwork();
    }
  }, [networkData, filter, searchTerm]);

  const fetchNetworkData = async () => {
    try {
      setLoading(true);
      
      // Fetch criminal records
      const { data: criminals, error } = await supabase
        .from('criminal_records')
        .select('*');
      
      if (error) {
        console.error('Error fetching criminals:', error);
        return;
      }
      
      if (!criminals) return;
      
      // Process data into nodes and links
      const nodes: CriminalNode[] = [];
      const links: CriminalLink[] = [];
      const connectionCount: Record<string, number> = {};
      
      // Create nodes
      criminals.forEach(criminal => {
        nodes.push({
          id: criminal.case_id,
          name: criminal.name,
          crime_type: criminal.crime_type || 'Unknown',
          value: criminal.total_cases || 1,
          group: criminal.crime_type || 'Unknown'
        });
        
        connectionCount[criminal.case_id] = 0;
      });
      
      // Create links based on different connection types
      criminals.forEach(criminal => {
        // Connections through known associates
        if (criminal.known_associates) {
          const associates = criminal.known_associates.split(',').map(a => a.trim());
          associates.forEach(associate => {
            const connectedCriminal = criminals.find(c => 
              c.name.toLowerCase().includes(associate.toLowerCase()) || 
              associate.toLowerCase().includes(c.name.toLowerCase())
            );
            
            if (connectedCriminal && connectedCriminal.case_id !== criminal.case_id) {
              links.push({
                source: criminal.case_id,
                target: connectedCriminal.case_id,
                value: 1,
                type: 'Associate'
              });
              connectionCount[criminal.case_id]++;
              connectionCount[connectedCriminal.case_id]++;
            }
          });
        }
        
        // Connections through connected criminals field
        if (criminal.connected_criminals) {
          const connections = criminal.connected_criminals.split(',').map(c => c.trim());
          connections.forEach(connection => {
            const connectedCriminal = criminals.find(c => 
              c.name.toLowerCase().includes(connection.toLowerCase()) || 
              connection.toLowerCase().includes(c.name.toLowerCase())
            );
            
            if (connectedCriminal && connectedCriminal.case_id !== criminal.case_id) {
              links.push({
                source: criminal.case_id,
                target: connectedCriminal.case_id,
                value: 2,
                type: 'Direct Connection'
              });
              connectionCount[criminal.case_id]++;
              connectionCount[connectedCriminal.case_id]++;
            }
          });
        }
        
        // Connections through same crime type
        if (criminal.crime_type) {
          criminals.filter(c => 
            c.crime_type === criminal.crime_type && 
            c.case_id !== criminal.case_id
          ).forEach(sameCrimeCriminal => {
            links.push({
              source: criminal.case_id,
              target: sameCrimeCriminal.case_id,
              value: 1,
              type: `Same Crime: ${criminal.crime_type}`
            });
            connectionCount[criminal.case_id]++;
            connectionCount[sameCrimeCriminal.case_id]++;
          });
        }
      });
      
      // Update node values based on connection count
      nodes.forEach(node => {
        node.value = Math.max(1, connectionCount[node.id] || 1);
      });
      
      // Apply filters
      let filteredNodes = nodes;
      let filteredLinks = links;
      
      if (filter !== 'all') {
        filteredNodes = nodes.filter(node => node.crime_type === filter);
        filteredLinks = links.filter(link => 
          filteredNodes.some(node => node.id === link.source) && 
          filteredNodes.some(node => node.id === link.target)
        );
      }
      
      if (searchTerm) {
        filteredNodes = filteredNodes.filter(node => 
          node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          node.crime_type.toLowerCase().includes(searchTerm.toLowerCase())
        );
        filteredLinks = filteredLinks.filter(link => 
          filteredNodes.some(node => node.id === link.source) && 
          filteredNodes.some(node => node.id === link.target)
        );
      }
      
      setNetworkData({ nodes: filteredNodes, links: filteredLinks });
    } catch (error) {
      console.error('Error processing network data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderNetwork = () => {
    if (!svgRef.current) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    
    // Create color scale for crime types
    const crimeTypes = Array.from(new Set(networkData.nodes.map(d => d.group)));
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(crimeTypes);
    
    // Convert nodes to SimulationNode type
    const simulationNodes: SimulationNode[] = networkData.nodes.map(node => ({
      ...node,
      x: Math.random() * width,
      y: Math.random() * height,
      fx: undefined,
      fy: undefined
    }));
    
    // Calculate optimal force parameters based on network size
    const nodeCount = simulationNodes.length;
    const linkCount = networkData.links.length;
    
    // Dynamic force parameters
    const chargeStrength = -Math.max(50, 800 / Math.sqrt(nodeCount));
    const linkDistance = Math.max(20, 150 / Math.sqrt(nodeCount));
    const collisionRadius = Math.max(15, 30 / Math.sqrt(nodeCount));
    
    // Create simulation with optimized parameters
    const simulation = d3.forceSimulation<SimulationNode>(simulationNodes)
      .force("link", d3.forceLink<SimulationNode, SimulationLink>()
        .id(d => d.id)
        .distance(linkDistance)
        .strength(0.9))
      .force("charge", d3.forceManyBody()
        .strength(chargeStrength))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide()
        .radius(d => collisionRadius + (d.value * 1.2))
        .strength(0.8))
      .force("x", d3.forceX(width / 2).strength(0.05))
      .force("y", d3.forceY(height / 2).strength(0.05));

    simulationRef.current = simulation;
    
    // Create SVG elements
    const svg = d3.select(svgRef.current);
    
    // Create container for zoomable content
    const container = svg.append("g");
    
    // Setup zoom behavior with larger scale extent
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.05, 8])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });

    zoomRef.current = zoom;
    svg.call(zoom);
    
    // Convert links to SimulationLink type by finding the actual node objects
    const simulationLinks: SimulationLink[] = networkData.links
      .map(link => {
        const sourceNode = simulationNodes.find(n => n.id === link.source);
        const targetNode = simulationNodes.find(n => n.id === link.target);
        
        if (sourceNode && targetNode) {
          return {
            source: sourceNode,
            target: targetNode,
            value: link.value,
            type: link.type
          };
        }
        return null;
      })
      .filter(link => link !== null) as SimulationLink[];
    
    // Set the links for the simulation
    (simulation.force("link") as d3.ForceLink<SimulationNode, SimulationLink>).links(simulationLinks);
    
    // Draw links with different styles based on connection type
    const link = container.append("g")
      .selectAll("line")
      .data(simulationLinks)
      .enter().append("line")
      .attr("stroke", d => {
        if (d.type === 'Direct Connection') return "#ff6b6b";
        if (d.type === 'Associate') return "#4ecdc4";
        return "#45b7d1";
      })
      .attr("stroke-opacity", 0.7)
      .attr("stroke-width", d => Math.sqrt(d.value) * 1.5)
      .attr("stroke-dasharray", d => {
        if (d.type === 'Direct Connection') return null;
        if (d.type === 'Associate') return "4,3";
        return "2,2";
      });
    
    // Drag functions with proper typing
    const dragstarted = (event: d3.D3DragEvent<SVGCircleElement, SimulationNode, SimulationNode>, d: SimulationNode) => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    };
    
    const dragged = (event: d3.D3DragEvent<SVGCircleElement, SimulationNode, SimulationNode>, d: SimulationNode) => {
      d.fx = event.x;
      d.fy = event.y;
    };
    
    const dragended = (event: d3.D3DragEvent<SVGCircleElement, SimulationNode, SimulationNode>, d: SimulationNode) => {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    };
    
    // Draw nodes with optimized sizing
    const node = container.append("g")
      .selectAll("circle")
      .data(simulationNodes)
      .enter().append("circle")
      .attr("r", d => 6 + Math.min(d.value * 1.2, 10))
      .attr("fill", d => colorScale(d.group) as string)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .call(
        d3.drag<SVGCircleElement, SimulationNode>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended) as any
      )
      .on("click", (event, d) => {
        setSelectedNode(d);
      })
      .on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 8 + Math.min(d.value * 1.2, 12))
          .attr("stroke-width", 3);
      })
      .on("mouseout", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 6 + Math.min(d.value * 1.2, 10))
          .attr("stroke-width", 2);
      });
    
    // Add labels with better styling and conditional display
    const label = container.append("g")
      .selectAll("text")
      .data(simulationNodes)
      .enter().append("text")
      .text(d => d.name)
      .attr("font-size", "11px")
      .attr("font-weight", "600")
      .attr("dx", 12)
      .attr("dy", 4)
      .attr("fill", "#2d3748")
      .style("pointer-events", "none")
      .style("text-shadow", "2px 2px 3px white, -2px -2px 3px white, 2px -2px 3px white, -2px 2px 3px white")
      .style("opacity", d => d.value > 2 ? 1 : 0.7);
    
    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x || 0)
        .attr("y1", d => d.source.y || 0)
        .attr("x2", d => d.target.x || 0)
        .attr("y2", d => d.target.y || 0);
      
      node
        .attr("cx", d => d.x || 0)
        .attr("cy", d => d.y || 0);
      
      label
        .attr("x", d => d.x || 0)
        .attr("y", d => d.y || 0);
    });
    
    // Reset zoom double click
    svg.on("dblclick.zoom", () => {
      svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
    });

    // Auto-stop simulation after it stabilizes
    setTimeout(() => {
      simulation.alphaTarget(0);
      simulation.alpha(0.1).restart();
    }, 2000);
  };

  const zoomIn = () => {
    if (svgRef.current && zoomRef.current) {
      const currentTransform = d3.zoomTransform(svgRef.current);
      const newScale = currentTransform.k * 1.5;
      d3.select(svgRef.current)
        .transition()
        .duration(250)
        .call(zoomRef.current.scaleTo, newScale);
    }
  };

  const zoomOut = () => {
    if (svgRef.current && zoomRef.current) {
      const currentTransform = d3.zoomTransform(svgRef.current);
      const newScale = currentTransform.k / 1.5;
      d3.select(svgRef.current)
        .transition()
        .duration(250)
        .call(zoomRef.current.scaleTo, newScale);
    }
  };

  const resetZoom = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(250)
        .call(zoomRef.current.transform, d3.zoomIdentity);
    }
  };

  // Get unique crime types for filter
  const crimeTypes = [...new Set(networkData.nodes.map(node => node.crime_type))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Criminal Network Analysis
          </h1>
          <p className="text-lg text-gray-600">
            Visualize connections and relationships between criminals
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium">Filter by Crime:</span>
              </div>
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Crimes</option>
                {crimeTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search criminals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={zoomOut}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4 text-gray-700" />
              </button>
              <button
                onClick={resetZoom}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                title="Reset Zoom"
              >
                <Target className="h-4 w-4 text-gray-700" />
              </button>
              <button
                onClick={zoomIn}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{networkData.nodes.length}</h3>
                <p className="text-gray-600">Criminals</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3">
              <Network className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{networkData.links.length}</h3>
                <p className="text-gray-600">Connections</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-red-600" />
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{crimeTypes.length}</h3>
                <p className="text-gray-600">Crime Types</p>
              </div>
            </div>
          </div>
        </div>

        {/* Network Visualization - MUCH LARGER */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Criminal Network</h3>
          <div className="mb-4 text-sm text-gray-600">
            <p>• Use mouse wheel to zoom in/out</p>
            <p>• Click and drag to pan</p>
            <p>• Double click to reset zoom</p>
            <p>• Click on nodes to see details</p>
            <p>• Hover over nodes to highlight</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-[600px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : networkData.nodes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[600px] text-gray-500">
              <Users className="h-16 w-16 mb-4" />
              <p>No criminal data found</p>
              <p className="text-sm">Try changing your filters or search term</p>
            </div>
          ) : (
            <div className="h-[600px] border rounded-lg bg-gray-50 relative overflow-hidden">
              <svg 
                ref={svgRef} 
                width="100%" 
                height="100%"
                style={{ cursor: 'grab' }}
              />
              
              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md">
                <h4 className="text-sm font-semibold mb-2">Crime Types</h4>
                <div className="flex flex-wrap gap-2">
                  {crimeTypes.map((type, index) => (
                    <div key={type} className="flex items-center gap-1">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: d3.schemeCategory10[index % 10] }}
                      ></div>
                      <span className="text-xs">{type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Selected Node Details */}
        {selectedNode && (
          <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Criminal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-800">{selectedNode.name}</h4>
                <p className="text-sm text-gray-600">ID: {selectedNode.id}</p>
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-medium">Crime Type:</span> {selectedNode.crime_type}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Connections:</span> {selectedNode.value}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Connections List */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Criminals</h3>
            <div className="space-y-3">
              {networkData.nodes
                .sort((a, b) => b.value - a.value)
                .slice(0, 5)
                .map(node => (
                  <div key={node.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">{node.name}</h4>
                      <p className="text-sm text-gray-600">{node.crime_type}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {node.value} connections
                      </span>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Connection Types</h3>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-800">Known Associates</span>
                  <span className="text-sm text-gray-600">
                    {networkData.links.filter(l => l.type === 'Associate').length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(networkData.links.filter(l => l.type === 'Associate').length / Math.max(networkData.links.length, 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-800">Direct Connections</span>
                  <span className="text-sm text-gray-600">
                    {networkData.links.filter(l => l.type === 'Direct Connection').length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(networkData.links.filter(l => l.type === 'Direct Connection').length / Math.max(networkData.links.length, 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-800">Same Crime Type</span>
                  <span className="text-sm text-gray-600">
                    {networkData.links.filter(l => l.type.includes('Same Crime')).length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full" 
                    style={{ width: `${(networkData.links.filter(l => l.type.includes('Same Crime')).length / Math.max(networkData.links.length, 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}