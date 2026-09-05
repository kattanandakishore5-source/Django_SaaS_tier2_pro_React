import React from 'react';
import { Users, Activity, FolderKanban, Trash2, BarChart3, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { DataTable } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { useProjects, useDashboardStats, useDeleteProject, useCreateProject } from '../hooks';
import type { Project } from '../../../types';
import { useToast } from '../../../components/ui/Toast';
import { FeatureGate } from '../../../components/ui/FeatureGate';
import { useEntitlements } from '../../billing/hooks';

export const Dashboard: React.FC = () => {
  const { data: stats, isLoading: statsLoading, isError: statsError } = useDashboardStats();
  const { data: projects, isLoading: projectsLoading, isError: projectsError } = useProjects();
  const { data: entitlements } = useEntitlements();
  const deleteProject = useDeleteProject();
  const createProject = useCreateProject();
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject.mutate(id, {
        onSuccess: () => toast({ type: 'success', title: 'Project deleted' }),
        onError: () => toast({ type: 'error', title: 'Failed to delete project' }),
      });
    }
  };

  const handleCreate = () => {
    createProject.mutate({ name: `New Project ${Date.now()}` }, {
      onSuccess: () => toast({ type: 'success', title: 'Project created' }),
      onError: (err: any) => toast({ type: 'error', title: err.message || 'Failed to create project' })
    });
  };

  const projectLimit = entitlements?.limits?.projects || 1;
  const isAtLimit = projects && projects.length >= projectLimit;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-2">
          Overview of your account activity and metrics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? '...' : (statsError ? '---' : stats?.total_users)}
            </div>
            <p className="text-xs text-muted-foreground">Admin only data</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registrations (30d)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? '...' : (statsError ? '---' : stats?.registrations_30d)}
            </div>
            <p className="text-xs text-muted-foreground">Admin only data</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Operational</div>
            <p className="text-xs text-muted-foreground">All systems go</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your Projects</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {projects?.length || 0} / {projectLimit}
              </span>
              <Button 
                size="sm" 
                onClick={handleCreate} 
                disabled={isAtLimit || createProject.isPending}
              >
                <Plus className="w-4 h-4 mr-1" />
                New Project
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable 
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'created_at', label: 'Created' },
                { key: 'actions', label: '', className: 'text-right' },
              ]}
              data={projects || []}
              isLoading={projectsLoading}
              isError={projectsError}
              isEmpty={!projects?.length}
              emptyTitle="No projects found"
              emptyDescription="You haven't created any projects yet."
              renderRow={(item: Project) => (
                <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle font-medium flex items-center gap-2">
                    <FolderKanban className="h-4 w-4 text-muted-foreground" />
                    {item.name}
                  </td>
                  <td className="p-4 align-middle text-muted-foreground">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 align-middle text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(item.id)}
                      disabled={deleteProject.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              )}
            />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Advanced Charts</CardTitle>
          </CardHeader>
          <CardContent>
            <FeatureGate feature="advanced_charts">
              <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/30">
                <BarChart3 className="w-8 h-8 mb-4 text-primary" />
                <h3 className="mb-2 font-medium">Pro Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  You have access to advanced charting features because you are on the Pro plan!
                </p>
              </div>
            </FeatureGate>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
