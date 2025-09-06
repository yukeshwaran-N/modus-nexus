import { useState, useMemo } from 'react';
import { Search, Filter, MoreHorizontal, UserX, Eye, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';

// Mock data for criminals
const mockCriminals = [
  {
    id: 'CR001',
    name: 'Marcus "Snake" Rodriguez',
    aliases: ['El Serpiente', 'M.R.'],
    primaryMO: 'Drug Trafficking',
    lastKnownLocation: 'Downtown District',
    associates: 12,
    riskLevel: 'High',
    status: 'Active'
  },
  {
    id: 'CR002', 
    name: 'Jennifer Walsh',
    aliases: ['Jenny W.'],
    primaryMO: 'Financial Fraud',
    lastKnownLocation: 'Business District',
    associates: 8,
    riskLevel: 'Medium',
    status: 'Under Investigation'
  },
  {
    id: 'CR003',
    name: 'David "Tech" Kumar',
    aliases: ['D.K.', 'The Hacker'],
    primaryMO: 'Cybercrime',
    lastKnownLocation: 'Unknown',
    associates: 15,
    riskLevel: 'High',
    status: 'Wanted'
  },
  {
    id: 'CR004',
    name: 'Maria Santos',
    aliases: ['M.S.'],
    primaryMO: 'Identity Theft',
    lastKnownLocation: 'Residential Area',
    associates: 5,
    riskLevel: 'Low',
    status: 'Monitored'
  }
];

export function CriminalsTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filteredCriminals = useMemo(() => {
    return mockCriminals.filter(criminal =>
      criminal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      criminal.aliases.some(alias => alias.toLowerCase().includes(searchTerm.toLowerCase())) ||
      criminal.primaryMO.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'destructive';
      case 'Wanted': return 'destructive';
      case 'Under Investigation': return 'secondary';
      case 'Monitored': return 'outline';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <Card className="law-enforcement-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">Criminal Database</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search criminals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="default" size="sm">
                Add Criminal
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Aliases</TableHead>
                  <TableHead>Primary M.O.</TableHead>
                  <TableHead>Last Known Location</TableHead>
                  <TableHead>Associates</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCriminals.map((criminal) => (
                  <TableRow key={criminal.id} className="data-table-row">
                    <TableCell className="font-medium">{criminal.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{criminal.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {criminal.aliases.join(', ')}
                      </div>
                    </TableCell>
                    <TableCell>{criminal.primaryMO}</TableCell>
                    <TableCell>{criminal.lastKnownLocation}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{criminal.associates}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRiskBadgeVariant(criminal.riskLevel)}>
                        {criminal.riskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(criminal.status)}>
                        {criminal.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserX className="h-4 w-4 mr-2" />
                            Mark Inactive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredCriminals.length} of {mockCriminals.length} criminals
            </p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}