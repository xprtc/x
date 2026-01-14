import dynamic from 'next/dynamic';
import React from 'react';

// Dynamic imports to load apps only when needed
const EcommerceApp = dynamic(() => import('@/app/dashboard/ecommerce/page'), { loading: () => <p>Loading eCommerce...</p> });
const CrmApp = dynamic(() => import('@/app/dashboard/crm/page'), { loading: () => <p>Loading CRM...</p> });
const AnalyticsApp = dynamic(() => import('@/app/dashboard/analytics/page'), { loading: () => <p>Loading Analytics...</p> });
const ProjectApp = dynamic(() => import('@/app/dashboard/project-management/page'), { loading: () => <p>Loading Projects...</p> });

export interface AppConfig {
  id: string;
  title: string;
  icon: React.ReactNode; 
  component: React.ComponentType;
}

export const APPS: Record<string, AppConfig> = {
  ecommerce: {
    id: 'ecommerce',
    title: 'eCommerce',
    icon: <i className="ri-shopping-cart-2-line text-2xl"></i>,
    component: EcommerceApp
  },
  crm: {
    id: 'crm',
    title: 'CRM',
    icon: <i className="ri-shake-hands-line text-2xl"></i>,
    component: CrmApp
  },
  analytics: {
    id: 'analytics',
    title: 'Analytics',
    icon: <i className="ri-bar-chart-groupped-line text-2xl"></i>,
    component: AnalyticsApp
  },
  project: {
    id: 'project',
    title: 'Project Mgmt',
    icon: <i className="ri-kanban-view-2 text-2xl"></i>,
    component: ProjectApp
  }
};

export const getAllApps = () => Object.values(APPS);
