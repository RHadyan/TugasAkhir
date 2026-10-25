'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import DashboardLayout from './components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Analytics } from '@vercel/analytics/next';
import { VCCBE_ADMIN_API_URL } from '@/lib/vccbe-config';

const API_BASE = VCCBE_ADMIN_API_URL;

export default function Home() {
  const [stats, setStats] = useState({
    countries: 0,
    programs: 0,
    publishedPrograms: 0,
    draftPrograms: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [countriesRes, programsRes] = await Promise.all([
        fetch(`${API_BASE}/countries?limit=1`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        }),
        fetch(`${API_BASE}/programs?limit=100`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        }),
      ]);

      const countriesData = await countriesRes.json();
      const programsData = await programsRes.json();

      if (countriesData.success && programsData.success) {
        const publishedPrograms = programsData.data.filter((p: any) => p.isPublished).length;
        setStats({
          countries: countriesData.pagination.total,
          programs: programsData.pagination.total,
          publishedPrograms,
          draftPrograms: programsData.pagination.total - publishedPrograms,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Countries',
      value: stats.countries,
      icon: 'solar:flag-linear',
      color: 'text-primary',
      bgColor: 'bg-lightprimary',
      link: '/admin/countries',
    },
    {
      title: 'Total Programs',
      value: stats.programs,
      icon: 'solar:document-text-linear',
      color: 'text-secondary',
      bgColor: 'bg-lightsecondary',
      link: '/admin/programs',
    },
    {
      title: 'Published Programs',
      value: stats.publishedPrograms,
      icon: 'solar:check-circle-linear',
      color: 'text-success',
      bgColor: 'bg-lightsuccess',
      link: '/admin/programs',
    },
    {
      title: 'Draft Programs',
      value: stats.draftPrograms,
      icon: 'solar:pen-new-square-linear',
      color: 'text-warning',
      bgColor: 'bg-lightwarning',
      link: '/admin/programs',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-dark dark:text-white mb-2">
            Welcome to VCC Admin
          </h1>
          <p className="text-darklink">Manage your international programs and countries</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => (
            <Link key={card.title} href={card.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-darklink mb-2">{card.title}</p>
                      {loading ? (
                        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                      ) : (
                        <h3 className="text-3xl font-bold text-dark dark:text-white">
                          {card.value}
                        </h3>
                      )}
                    </div>
                    <div className={`p-4 rounded-full ${card.bgColor}`}>
                      <Icon icon={card.icon} className={`w-8 h-8 ${card.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/admin/countries"
                className="p-4 border border-defaultBorder rounded-lg hover:bg-lightprimary transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-lightprimary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon icon="solar:add-circle-linear" className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark dark:text-white">Add Country</h4>
                    <p className="text-sm text-darklink">Create new country</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/admin/programs"
                className="p-4 border border-defaultBorder rounded-lg hover:bg-lightsecondary transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-lightsecondary group-hover:bg-secondary group-hover:text-white transition-colors">
                    <Icon icon="solar:add-square-linear" className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark dark:text-white">Add Program</h4>
                    <p className="text-sm text-darklink">Create new program</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/admin/programs"
                className="p-4 border border-defaultBorder rounded-lg hover:bg-lightsuccess transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-lightsuccess group-hover:bg-success group-hover:text-white transition-colors">
                    <Icon icon="solar:settings-linear" className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark dark:text-white">Manage All</h4>
                    <p className="text-sm text-darklink">View all programs</p>
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Analytics />
      </div>
    </DashboardLayout>
  );
}
