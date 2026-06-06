import React from 'react';
import { DataTable, Badge, Button } from '@blinkdotnew/ui';
import { ColumnDef } from '@tanstack/react-table';

interface CarrierTableProps {
  carriers: any[];
  loading: boolean;
  profile: any;
  onViewDetails: (carrier: any) => void;
}

export function CarrierTable({ carriers, loading, profile, onViewDetails }: CarrierTableProps) {
  const columns: ColumnDef<any>[] = [
    { 
      accessorKey: 'organization_name', 
      header: 'Organization',
      cell: ({ row }) => (
        <div 
          className="flex items-center gap-2 font-medium cursor-pointer hover:text-primary transition-colors"
          onClick={() => onViewDetails(row.original)}
        >
          {row.original.organization_name}
          {row.original.is_new_for_supervisor && profile?.role === 'MARKETING_SUPERVISOR' && (
            <Badge variant="info" className="animate-pulse">NEW</Badge>
          )}
        </div>
      )
    },
    { accessorKey: 'mc_number', header: 'MC Number' },
    { accessorKey: 'truck_type', header: 'Truck Type' },
    { 
      accessorKey: 'status', 
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        let variant: "success" | "warning" | "neutral" | "info" | "destructive" = "neutral";
        if (status === 'ACTIVE') variant = "success";
        if (status === 'PENDING') variant = "warning";
        if (status === 'REMARKET') variant = "info";
        if (status === 'INACTIVE') variant = "destructive";
        
        return (
          <Badge variant={variant}>
            {status}
          </Badge>
        );
      }
    },
    { 
      accessorKey: 'marketer.full_name', 
      header: 'Assigned Marketer',
      cell: ({ row }) => row.original.marketer?.full_name
    },
    { 
      accessorKey: 'dispatcher.full_name', 
      header: 'Assigned Dispatcher',
      cell: ({ row }) => row.original.dispatcher?.full_name || 'Unassigned'
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onViewDetails(row.original)}
        >
          View Details
        </Button>
      )
    }
  ];

  return (
    <DataTable 
      columns={columns} 
      data={carriers} 
      loading={loading || undefined}
      searchable
      searchColumn="organization_name"
    />
  );
}
